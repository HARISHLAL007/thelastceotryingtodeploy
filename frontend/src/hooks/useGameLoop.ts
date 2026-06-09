import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/apiClient';
import { useGameStore } from '@/store/gameStore';
import type { LLMReport } from '@/types';

export const useGameLoop = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { actions, state, company } = useGameStore();

  const fetchQuarterReport = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getQuarterReport(
        state.currentYear,
        state.currentQuarter
      );
      
      const report: LLMReport = response.data;
      actions.setReport(report);
      actions.updateGameState({
        revenue: report.revenue,
        budget: state.budget - report.expenses + report.revenue,
        roi: report.roi,
        morale: Math.max(Math.min(state.morale + report.moraleChange, 100), 0),
      });
    } catch (err) {
      console.warn('Backend API offline. Simulating mock quarterly report...', err);
      // Simulate reports locally for the prototype
      const mockExpenses = Math.floor(Math.random() * 30000) + 20000;
      const mockRevenue = Math.floor(Math.random() * 50000) + 15000;
      const mockRoiChange = Math.floor(Math.random() * 8) - 3;
      const mockMoraleChange = Math.floor(Math.random() * 6) - 3;

      const report: LLMReport = {
        quarter: state.currentQuarter,
        year: state.currentYear,
        summary: `Holographic data analytics for ${company?.name || 'Startup'} indicate stable core metrics this quarter. Marketing output yields normal conversion thresholds.`,
        revenue: mockRevenue,
        expenses: mockExpenses,
        roi: Math.max(state.roi + mockRoiChange, 0),
        moraleChange: mockMoraleChange,
        recommendations: [
          'Direct asset allocation towards product performance optimization.',
          'Broaden targeted reach variables in regional domains.'
        ],
        risks: [
          'High overhead investment variables limit cash flow flexibility.',
          'Staff attrition indices warn of workload spikes.'
        ]
      };

      actions.setReport(report);
      actions.updateGameState({
        revenue: report.revenue,
        budget: state.budget - report.expenses + report.revenue,
        roi: report.roi,
        morale: Math.max(Math.min(state.morale + report.moraleChange, 100), 0),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const makeQuarterDecision = async (decisionId: string) => {
    setIsLoading(true);
    setError(null);

    // Track decision attributes for consequence modal
    let decisionTitle = 'STRATEGIC ACTION';
    let budgetCost = 50000;
    let roiGain = 15;
    let moraleGain = 5;
    let employeeGain = 0;

    if (decisionId === 'hire-employees') {
      decisionTitle = 'HIRE 5 EMPLOYEES';
      budgetCost = 50000;
      roiGain = 10;
      moraleGain = 8;
      employeeGain = 5;
    } else if (decisionId === 'marketing-campaign') {
      decisionTitle = 'LAUNCH CAMPAIGN';
      budgetCost = 75000;
      roiGain = 20;
      moraleGain = 2;
      employeeGain = 0;
    } else if (decisionId === 'product-development') {
      decisionTitle = 'DEVELOP NEW PRODUCT';
      budgetCost = 120000;
      roiGain = 35;
      moraleGain = 5;
      employeeGain = 0;
    }

    actions.setLastDecisionOutcome({
      id: decisionId,
      title: decisionTitle,
      cost: budgetCost,
      roiImpact: roiGain,
      moraleImpact: moraleGain,
      employeeGain: employeeGain,
    });

    try {
      const response = await api.makeDecision(decisionId);
      actions.makeDecision(decisionId);
      actions.updateGameState(response.data.gameState);
      
      // Auto-fetch next quarter report
      await fetchQuarterReport();
    } catch (err) {
      console.warn('Backend API offline. Processing mock strategic decision...', err);
      
      const nextBudget = state.budget - budgetCost;
      const nextRoi = state.roi + roiGain;
      const nextMorale = Math.min(state.morale + moraleGain, 100);
      const nextEmployees = state.employees + employeeGain;

      // Update basic fields
      actions.updateGameState({
        budget: nextBudget,
        roi: nextRoi,
        morale: nextMorale,
        employees: nextEmployees
      });

      // Calculate time metrics progression
      const nextQuarter = state.currentQuarter + 1;
      const willYearChange = nextQuarter > 4;
      const nextYear = willYearChange ? state.currentYear + 1 : state.currentYear;

      // Check Victory or Defeat
      let isGameOver = false;
      let gameResult: 'victory' | 'bankruptcy' | null = null;

      if (nextBudget <= 0) {
        isGameOver = true;
        gameResult = 'bankruptcy';
      } else if (nextYear >= 2035) {
        isGameOver = true;
        gameResult = 'victory';
      }

      // Populate history records if year rolls over, feeding the Recharts graph
      const updatedHistory = [...state.history];
      if (willYearChange) {
        updatedHistory.push({
          year: state.currentYear,
          revenue: state.revenue,
          budget: nextBudget,
          roi: nextRoi,
          morale: nextMorale
        });
      }

      actions.updateGameState({
        currentQuarter: willYearChange ? 1 : nextQuarter,
        currentYear: nextYear,
        history: updatedHistory,
        isGameOver,
        gameResult
      });

      // Fetch simulated report representing quarter metrics
      await fetchQuarterReport();
    } finally {
      setIsLoading(false);
    }
  };

  const advanceQuarter = async () => {
    setIsLoading(true);
    
    try {
      actions.nextQuarter();
      await fetchQuarterReport();
    } catch (err) {
      actions.nextQuarter();
      await fetchQuarterReport();
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
  };
};
