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
    const freshLevel = useGameStore.getState().state.level;
    const available = DECISIONS.filter(d => freshLevel >= d.requiredLevel);
    // Shuffle and pick top 3
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 3).map(d => d.id);
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

  const fetchQuarterReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const freshState = useGameStore.getState().state;
      const freshCompany = useGameStore.getState().company;

      const payload = {
        industry: freshCompany?.industry || "Technology",
        country: freshCompany?.country || "United States",
        year: freshState.currentYear,
        ai_adoption_level: freshCompany?.aiAdoptionLevel || 3.5,
        ai_investment_usd: freshCompany?.aiInvestment || 500000,
        automation_rate: freshCompany?.automationRate || 45.0,
        employee_ai_training_hours: freshCompany?.trainingHours || 120.0,
        ai_maturity_score: freshCompany?.aiMaturityScore || 75.0,
        deployment_count: freshCompany?.deploymentCount || 10,
        save_to_db: false
      };

      const response = await api.getQuarterReport(payload);
      
      const newPayloads = [...freshState.quarterlyPayloads, payload];
      actions.updateGameState({ quarterlyPayloads: newPayloads });

      const metrics = response.data.metrics;
      const scenarios = response.data.scenarios;
      
      const report: LLMReport = {
        quarter: freshState.currentQuarter,
        year: freshState.currentYear,
        summary: `Board Decision: ${metrics.board_decision} - ${metrics.recommendation}`,
        revenue: Math.round(metrics.revenue_impact),
        expenses: Math.round(payload.ai_investment_usd),
        roi: Math.round(metrics.roi),
        moraleChange: Math.round(metrics.productivity_gain),
        recommendations: [
          `Scenario A (Maintain): ROI ${Math.round(scenarios.A.roi)}%, Revenue $${(scenarios.A.revenue/1000000).toFixed(2)}M`,
          `Scenario B (+20%): ROI ${Math.round(scenarios.B.roi)}%, Revenue $${(scenarios.B.revenue/1000000).toFixed(2)}M`,
          `Scenario C (+50%): ROI ${Math.round(scenarios.C.roi)}%, Revenue $${(scenarios.C.revenue/1000000).toFixed(2)}M`
        ],
        risks: [
          `AI Transformation Score: ${metrics.ai_transformation_score.toFixed(0)}/100`,
          `Risk Score: ${metrics.risk_score.toFixed(0)}%`,
          `Readiness Level: ${metrics.readiness_level}`
        ]
      };

      actions.setReport(report);
      
      // Give XP based on ML metrics
      actions.addXp(Math.round(metrics.ai_transformation_score * 10));

      // Financials Logic
      // Revenue grows realistically with AI and Workforce
      const baseRevenue = 20000000; 
      const aiAutomationBonus = (freshCompany?.automationRate || 0) * 150000; 
      const aiMaturityBonus = (freshCompany?.aiMaturityScore || 0) * 200000; 
      const employeeRevenueBonus = freshState.employees * 500000; 

      let quarterlyRevenue = (baseRevenue + aiAutomationBonus + aiMaturityBonus + employeeRevenueBonus) / 4;
      // Add XGBoost prediction bonus/penalty
      quarterlyRevenue += (report.revenue / 2); // Dampen the ML spike slightly

      const costs = 2000000; // Base operational costs
      const salaries = freshState.employees * 40000; // 40k per quarter per employee
      
      const nextBudget = freshState.budget + quarterlyRevenue - costs - salaries; 
      const annualizedRevenue = quarterlyRevenue * 4;
      const totalAiInvestment = freshCompany?.aiInvestment || 1;
      
      // Realistic ROI: Profit / Total Expenses
      const totalAnnualExpenses = (costs * 4) + (salaries * 4) + totalAiInvestment;
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

      // 3. Fetch simulated report representing quarter metrics first
      const reportResults = await fetchQuarterReport();
      
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

      // History tracking: fix duplicate year bug
      const updatedHistory = [...state.history];
      if (willYearChange) {
        updatedHistory.push({
          year: nextYear, // Fixed bug: push the new year, not the old year
          revenue: finalRevenue,
          budget: finalBudget,
          roi: finalRoi,
          morale: freshState.morale,
          employees: nextEmployees
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

      // 4. Roll new decision cards for next quarter using updated XP/level
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
