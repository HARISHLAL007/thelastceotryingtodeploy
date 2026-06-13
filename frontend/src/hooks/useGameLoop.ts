import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/apiClient';
import { useGameStore } from '@/store/gameStore';
import type { LLMReport } from '@/types';
import { DECISIONS, EVENTS } from '@/data/decisions';

export const useGameLoop = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { actions, state, company } = useGameStore();

  const rollDecisions = () => {
    const snapshot = useGameStore.getState();
    const freshState = snapshot.state;
    const c = snapshot.company;
    const prev = freshState.currentDecisions;

    const available = DECISIONS.filter(d => freshState.level >= d.requiredLevel);

    // Current vitals — these were shaped by the player's PREVIOUS decisions,
    // so scoring against them makes the hand respond to how the game is going.
    const morale = freshState.morale;
    const budget = freshState.budget;
    const employees = freshState.employees;
    const maturity = c?.aiMaturityScore ?? 50;
    const automation = c?.automationRate ?? 40;
    const training = c?.trainingHours ?? 120;

    const score = (d: typeof DECISIONS[number]) => {
      let sc = Math.random() * 5; // keep some surprise

      // Struggling morale → surface options that lift the team
      if (morale < 45 && d.moraleImpact > 0) sc += 7;
      // Tight on cash → favor cheap plays, punish big spends
      if (budget < 1_000_000) sc += d.cost < 500_000 ? 5 : -4;
      // Thin headcount → favor hiring/acquisition
      if (employees < 6 && d.employeeGain > 0) sc += 5;
      // Weak AI maturity → favor capability builders
      if (maturity < 55) sc += d.aiMaturityGain * 0.35;
      // Low automation → favor automation plays
      if (automation < 45) sc += d.automationGain * 0.25;
      // Under-trained workforce → favor upskilling
      if (training < 150) sc += d.trainingGain * 0.06;
      // Healthy company → chase growth/ROI
      if (morale >= 45 && budget >= 1_000_000) sc += d.roiImpact * 0.12;
      // Avoid repeating last quarter's exact hand
      if (prev.includes(d.id)) sc -= 6;

      return sc;
    };

    const ranked = [...available].sort((a, b) => score(b) - score(a));

    // Pick the 3 strongest, but keep category variety so the hand feels distinct
    const picked: string[] = [];
    const usedCats = new Set<string>();
    for (const d of ranked) {
      if (picked.length >= 3) break;
      if (usedCats.has(d.category)) continue;
      picked.push(d.id);
      usedCats.add(d.category);
    }
    // Fallback: if category-diversity left us short, fill from the ranked list
    if (picked.length < 3) {
      for (const d of ranked) {
        if (picked.length >= 3) break;
        if (!picked.includes(d.id)) picked.push(d.id);
      }
    }

    actions.updateGameState({ currentDecisions: picked });
  };

  const triggerRandomEvent = () => {
    // 25% chance of event each quarter
    if (Math.random() < 0.25) {
      const event = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      actions.setCurrentEvent(event);
      
      const freshState = useGameStore.getState().state;
      actions.updateGameState({
        budget: freshState.budget + event.impact.budget,
        roi: freshState.roi + event.impact.roi,
        morale: Math.max(Math.min(freshState.morale + event.impact.morale, 100), 0),
        revenue: freshState.revenue + (event.impact.revenue || 0)
      });
      return event;
    }
    actions.setCurrentEvent(null);
    return null;
  };

  const fetchQuarterReport = async (chosenDecision?: any, unpickedDecisions: any[] = [], preCompanyState?: any, preQuarter?: number, preYear?: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const freshState = useGameStore.getState().state;
      const freshCompany = useGameStore.getState().company;

      const payload = {
        industry: freshCompany?.industry || "Technology",
        country: freshCompany?.country || "United States",
        year: preYear || freshState.currentYear,
        quarter: preQuarter || freshState.currentQuarter,
        ai_adoption_level: freshCompany?.aiAdoptionLevel || 3.5,
        ai_investment_usd: freshCompany?.aiInvestment || 500000,
        automation_rate: freshCompany?.automationRate || 45.0,
        employee_ai_training_hours: freshCompany?.trainingHours || 120.0,
        ai_maturity_score: freshCompany?.aiMaturityScore || 75.0,
        deployment_count: freshCompany?.deploymentCount || 10,
        save_to_db: true,
        player_decision: chosenDecision ? chosenDecision.title : "None",
        player_result: chosenDecision ? `Cost: $${chosenDecision.cost.toLocaleString()}, ROI Impact: ${chosenDecision.roiImpact}%` : "None"
      };

      const response = await api.getQuarterReport(payload);
      
      const newPayloads = [...freshState.quarterlyPayloads, payload];
      actions.updateGameState({ quarterlyPayloads: newPayloads });

      const metrics = response.data.metrics;
      const scenarios = response.data.scenarios;
      
      let recommendations = [];
      if (chosenDecision && unpickedDecisions.length > 0 && preCompanyState) {
          recommendations.push(`Chosen: ${chosenDecision.title}: ROI ${Math.round(metrics.roi)}%, Revenue $${(metrics.revenue_impact/1000000).toFixed(2)}M`);

          // "What if" lines for the un-chosen options. Fire them in parallel instead
          // of awaiting each one sequentially, then keep the original order.
          const altLines = await Promise.all(unpickedDecisions.map(async (dec) => {
             const altPayload = {
                industry: preCompanyState.industry || "Technology",
                country: preCompanyState.country || "United States",
                year: preYear || freshState.currentYear,
                ai_adoption_level: preCompanyState.aiAdoptionLevel || 3.5,
                ai_investment_usd: (preCompanyState.aiInvestment || 500000) + dec.cost,
                automation_rate: Math.min((preCompanyState.automationRate || 45.0) + dec.automationGain, 100),
                employee_ai_training_hours: (preCompanyState.trainingHours || 120.0) + dec.trainingGain,
                ai_maturity_score: Math.min((preCompanyState.aiMaturityScore || 75.0) + dec.aiMaturityGain, 100),
                deployment_count: (preCompanyState.deploymentCount || 10) + dec.deploymentGain,
                save_to_db: false
             };
             try {
                const altRes = await api.getQuarterReport(altPayload);
                const altMetrics = altRes.data.metrics;
                return `If Chose: ${dec.title}: ROI ${Math.round(altMetrics.roi)}%, Revenue $${(altMetrics.revenue_impact/1000000).toFixed(2)}M`;
             } catch (e) {
                return `If Chose: ${dec.title}: (Prediction Failed)`;
             }
          }));
          recommendations.push(...altLines);
      } else {
         recommendations = [
            `Scenario A (Maintain): ROI ${Math.round(scenarios.A.roi)}%, Revenue $${(scenarios.A.revenue/1000000).toFixed(2)}M`,
            `Scenario B (+20%): ROI ${Math.round(scenarios.B.roi)}%, Revenue $${(scenarios.B.revenue/1000000).toFixed(2)}M`,
            `Scenario C (+50%): ROI ${Math.round(scenarios.C.roi)}%, Revenue $${(scenarios.C.revenue/1000000).toFixed(2)}M`
         ];
      }

      const report: LLMReport = {
        quarter: preQuarter || freshState.currentQuarter,
        year: preYear || freshState.currentYear,
        summary: `Board Decision: ${metrics.board_decision} - ${metrics.recommendation}`,
        revenue: Math.round(metrics.revenue_impact),
        expenses: Math.round(payload.ai_investment_usd),
        roi: Math.round(metrics.roi),
        moraleChange: Math.round(metrics.productivity_gain),
        recommendations,
        risks: [
          `AI Transformation Score: ${metrics.ai_transformation_score.toFixed(0)}/100`,
          `Risk Score: ${metrics.risk_score.toFixed(0)}%`,
          `Readiness Level: ${metrics.readiness_level}`
        ]
      };

      actions.setReport(report);
      
      // Give XP based on ML metrics
      actions.addXp(Math.round(metrics.ai_transformation_score * 10));

      // --- Quarterly economy (XGBoost-driven) ---
      // The model already accounts for automation_rate, ai_maturity_score, investment,
      // training and deployment_count, so the AI revenue line now comes straight from
      // its prediction (full weight) instead of the old hardcoded automation/maturity
      // bonuses that double-counted those signals and drowned out the model.
      const AI_REVENUE_SCALE = 8; // lifts the per-quarter model impact to enterprise scale (tunable)
      const organicRevenue = 7000000 + freshState.employees * 400000; // non-AI baseline business (half-year)
      const aiRevenue = Math.max(0, report.revenue) * AI_REVENUE_SCALE; // report.revenue = model's quarterly revenue impact

      const quarterlyRevenue = organicRevenue + aiRevenue;

      const costs = 4000000; // Base operational costs for a half-year
      const salaries = freshState.employees * 80000; // 80k per half-year per employee

      const nextBudget = freshState.budget + quarterlyRevenue - costs - salaries;
      const annualizedRevenue = quarterlyRevenue * 2;
      const totalAiInvestment = freshCompany?.aiInvestment || 1;

      // Realistic ROI: annual profit / total annual expenses — now reflects the
      // model-driven revenue above rather than a flat hardcoded baseline.
      const totalAnnualExpenses = (costs * 2) + (salaries * 2) + totalAiInvestment;
      const profit = annualizedRevenue - totalAnnualExpenses;
      let calculatedRoi = Math.round((profit / totalAnnualExpenses) * 100);
      calculatedRoi = Math.max(calculatedRoi, -100); // Floor at -100%, let it fly high naturally

      // Workforce & Morale Dynamics
      let nextEmployees = freshState.employees;
      let nextMorale = freshState.morale + report.moraleChange;

      // Automation replaces jobs naturally if not actively hiring
      if ((freshCompany?.automationRate || 0) > 50) {
         if (nextEmployees > 0) {
             const laidOff = Math.ceil(nextEmployees * 0.05); // 5% attrition
             nextEmployees -= laidOff;
             nextMorale -= (laidOff * 2); // Morale drops from layoffs
         }
      }

      // If everyone is fired/automated, morale becomes N/A (represented as 0 or 100 in story, let's keep it at 100 for Post-Human)
      if (nextEmployees <= 0) {
         nextEmployees = 0;
         if ((freshCompany?.automationRate || 0) >= 90) {
             nextMorale = 100; // Post-human machine perfection
         } else {
             nextMorale = 0; // Dead company
         }
      } else {
         nextMorale = Math.max(Math.min(nextMorale, 100), 0);
      }

      actions.updateGameState({
        revenue: annualizedRevenue,
        budget: nextBudget, 
        roi: calculatedRoi,
        morale: nextMorale,
        employees: nextEmployees
      });
      
      return { nextBudget, calculatedRoi, annualizedRevenue, nextEmployees, nextMorale };
    } catch (err) {
      console.warn('Backend API offline. Could not fetch XGBoost prediction.', err);
      setError('Failed to connect to ML Backend.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const makeQuarterDecision = async (decisionId: string) => {
    setIsLoading(true);
    setError(null);

    const decision = DECISIONS.find(d => d.id === decisionId);
    if (!decision) return;

    actions.setLastDecisionOutcome({
      id: decision.id,
      title: decision.title,
      cost: decision.cost,
      roiImpact: decision.roiImpact,
      moraleImpact: decision.moraleImpact,
      employeeGain: decision.employeeGain,
      aiMaturityGain: decision.aiMaturityGain,
      automationGain: decision.automationGain,
      trainingGain: decision.trainingGain,
      deploymentGain: decision.deploymentGain
    });

    try {
      // 1. Update Game State (Budget, Morale, Employees) -> Subtracting AI Investment/Decision Cost here
      const preBudget = state.budget - decision.cost;
      const preMorale = Math.min(state.morale + decision.moraleImpact, 100);
      const nextEmployees = state.employees + decision.employeeGain;

      const preCompanyState = { ...company };

      // 2. Update Company Core AI Metrics (this feeds ML)
      actions.updateCompany({
        aiInvestment: (company?.aiInvestment || 0) + decision.cost,
        aiMaturityScore: Math.min((company?.aiMaturityScore || 0) + decision.aiMaturityGain, 100),
        automationRate: Math.min((company?.automationRate || 0) + decision.automationGain, 100),
        trainingHours: (company?.trainingHours || 0) + decision.trainingGain,
        deploymentCount: (company?.deploymentCount || 0) + decision.deploymentGain
      });

      const nextQuarter = state.currentQuarter + 1;
      const willYearChange = nextQuarter > 2;
      const nextYear = willYearChange ? state.currentYear + 1 : state.currentYear;

      // Interim state update before fetching the report
      actions.updateGameState({
        budget: preBudget,
        morale: preMorale,
        employees: nextEmployees,
        currentQuarter: willYearChange ? 1 : nextQuarter,
        currentYear: nextYear,
      });

      const unpickedDecisions = DECISIONS.filter(d => state.currentDecisions.includes(d.id) && d.id !== decisionId);

      // 3. Fetch simulated report representing quarter metrics first
      const reportResults = await fetchQuarterReport(decision, unpickedDecisions, preCompanyState, state.currentQuarter, state.currentYear);
      
      const freshState = useGameStore.getState().state;
      const finalBudget = reportResults?.nextBudget ?? preBudget;
      const finalRoi = reportResults?.calculatedRoi ?? state.roi;
      const finalRevenue = reportResults?.annualizedRevenue ?? state.revenue;

      let isGameOver = false;
      let gameResult: 'victory' | 'bankruptcy' | null = null;

      if (finalBudget <= 0) {
        isGameOver = true;
        gameResult = 'bankruptcy';
      } else if (nextYear >= 2035) {
        isGameOver = true;
        gameResult = 'victory';
      }

      // History tracking: log a data point for EVERY quarter that just completed
      // (state.* here is the pre-advance closure, i.e. the quarter we just played)
      const updatedHistory = [...state.history];
      updatedHistory.push({
        year: state.currentYear,
        quarter: state.currentQuarter,
        revenue: finalRevenue,
        budget: finalBudget,
        roi: finalRoi,
        morale: freshState.morale,
        employees: nextEmployees
      });

      actions.updateGameState({
        history: updatedHistory,
        isGameOver,
        gameResult
      });

      if (isGameOver) {
        try {
          await api.saveGameHistory(useGameStore.getState().state.quarterlyPayloads);
        } catch (e) {
          console.error("Failed to save game history", e);
        }
      }

      // 4. Roll a fresh, state-aware hand for the next quarter
      rollDecisions();
      
      // 5. Trigger Random Event for next quarter
      triggerRandomEvent();

    } finally {
      setIsLoading(false);
    }
  };

  const advanceQuarter = async () => {
    setIsLoading(true);
    try {
      actions.nextQuarter();
      triggerRandomEvent();
      await fetchQuarterReport();
    } catch (err) {
      actions.nextQuarter();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    fetchQuarterReport,
    makeQuarterDecision,
    advanceQuarter,
    rollDecisions,
  };
};
