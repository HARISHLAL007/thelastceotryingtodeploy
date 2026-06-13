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

      const AI_REVENUE_SCALE = 8; // lifts the per-quarter model impact to enterprise scale
      const organicRevenue = 3500000 + freshState.employees * 200000; // non-AI baseline business (quarterly)
      
      // Smooth Revenue to avoid random spikes
      const rawAiRevenue = Math.max(0, metrics.revenue_impact) * AI_REVENUE_SCALE;
      const quarterlyRevenue = organicRevenue + rawAiRevenue;

      const costs = 2000000; // Base operational costs for a quarter
      const salaries = freshState.employees * 40000; // 40k per quarter per employee

      const nextBudget = freshState.budget + quarterlyRevenue - costs - salaries;
      const annualizedRevenue = quarterlyRevenue * 4;
      const totalAiInvestment = freshCompany?.aiInvestment || 1;

      // Realistic ROI: amortize AI investment over 5 years (20% per year) for ROI calculation
      const amortizedInvestment = totalAiInvestment * 0.20;
      const totalAnnualExpenses = (costs * 4) + (salaries * 4) + amortizedInvestment;
      const profit = annualizedRevenue - totalAnnualExpenses;
      let rawRoi = Math.round((profit / totalAnnualExpenses) * 100);
      
      // Smooth ROI changes (Max ±15% per quarter)
      const previousRoi = freshState.roi;
      let roiChange = rawRoi - previousRoi;
      if (roiChange > 15) roiChange = 15;
      if (roiChange < -15) roiChange = -15;
      let calculatedRoi = previousRoi + roiChange;
      calculatedRoi = Math.max(calculatedRoi, -100);

      // Workforce & Morale Dynamics
      let nextEmployees = freshState.employees;
      let nextMorale = freshState.morale;

      // Automation replaces jobs naturally if high, slowing employee growth
      if ((freshCompany?.automationRate || 0) > 50) {
         if (nextEmployees > 0) {
             // Up to 5% attrition based on how far above 50% automation is
             const automationFactor = (freshCompany.automationRate - 50) / 1000; 
             const laidOff = Math.ceil(nextEmployees * automationFactor);
             nextEmployees -= laidOff;
         }
      }

      if (nextEmployees <= 0) {
         nextEmployees = 0;
         nextMorale += ((freshCompany?.automationRate || 0) >= 90) ? 5 : -5;
      }

      // Smooth Morale changes (Max ±10 points per quarter)
      // Productivity gain from ML is a high percentage (e.g. 75%), so we scale it down to a ± impact
      let rawMoraleImpact = ((metrics.productivity_gain || 50) - 50) / 5; 
      let finalMoraleChange = rawMoraleImpact;
      if (finalMoraleChange > 10) finalMoraleChange = 10;
      if (finalMoraleChange < -10) finalMoraleChange = -10;
      
      nextMorale = nextMorale + finalMoraleChange;
      nextMorale = Math.max(0, Math.min(100, nextMorale));

      const quarterExpenses = costs + salaries + (amortizedInvestment / 4);

      // Logic override: If the company is bleeding money and budget is low, force a survival recommendation
      let finalRecommendation = metrics.recommendation;
      let boardDecision = metrics.board_decision;
      
      if (quarterlyRevenue < quarterExpenses && nextBudget < 2000000) {
         finalRecommendation = "CRITICAL WARNING: The company is experiencing severe negative cash flow and is nearing bankruptcy. Immediate cost reduction, automation, and operational efficiency are required. Halt aggressive expansion.";
         boardDecision = "MANDATE COST REDUCTION";
      }

      const reportPayload: LLMReport = {
        quarter: preQuarter || freshState.currentQuarter,
        year: preYear || freshState.currentYear,
        summary: `Board Decision: ${boardDecision} - ${finalRecommendation}`,
        revenue: Math.round(quarterlyRevenue),
        expenses: Math.round(quarterExpenses),
        roi: calculatedRoi,
        moraleChange: Math.round(finalMoraleChange),
        recommendations,
        risks: [
          `Projected 10-Year AI ROI: ${Math.round(metrics.roi)}%`,
          `AI Transformation Score: ${metrics.ai_transformation_score.toFixed(0)}/100`,
          `Risk Level: ${metrics.readiness_level}`
        ]
      };

      actions.setReport(reportPayload);
      
      // Give XP based on ML metrics
      actions.addXp(Math.round(metrics.ai_transformation_score * 10));

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
      const nextEmployees = state.employees + decision.employeeGain;

      // Smooth Morale impact from decision
      let decisionMoraleImpact = decision.moraleImpact;
      if (decisionMoraleImpact > 10) decisionMoraleImpact = 10;
      if (decisionMoraleImpact < -10) decisionMoraleImpact = -10;
      const preMorale = Math.max(0, Math.min(state.morale + decisionMoraleImpact, 100));

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
      const willYearChange = nextQuarter > 4;
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

      // Bankruptcy only if budget is severely negative (giving them a chance to recover)
      if (finalBudget <= -5000000) {
        isGameOver = true;
        gameResult = 'bankruptcy';
      } else if (state.currentYear >= 2035) {
        isGameOver = true;
        gameResult = 'victory';
      }

      // History tracking: log a data point for EVERY quarter that just completed
      // (state.* here is the pre-advance closure, i.e. the quarter we just played)
      // Check to prevent duplicate quarter entries
      const updatedHistory = [...state.history];
      const isDuplicate = updatedHistory.some(h => h.year === state.currentYear && h.quarter === state.currentQuarter);
      
      if (!isDuplicate) {
        updatedHistory.push({
          year: state.currentYear,
          quarter: state.currentQuarter,
          revenue: finalRevenue,
          budget: finalBudget,
          roi: finalRoi,
          morale: freshState.morale,
          employees: reportResults?.nextEmployees ?? nextEmployees,
          decision: decision.title
        });
      }

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
