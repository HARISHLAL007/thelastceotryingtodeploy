import { create } from 'zustand';
import type { GameState, CompanyProfile, LLMReport } from '@/types';

export interface DecisionOutcome {
  id: string;
  title: string;
  cost: number;
  roiImpact: number;
  moraleImpact: number;
  employeeGain: number;
  aiMaturityGain?: number;
  automationGain?: number;
  trainingGain?: number;
  deploymentGain?: number;
}

const initialState: GameState = {
  currentYear: 2024,
  currentQuarter: 1,
  budget: 1000000,
  morale: 75,
  roi: 0,
  revenue: 0,
  employees: 10,
  xp: 0,
  level: 1,
  unlockedTech: [],
  currentDecisions: [],
  isGameOver: false,
  gameResult: null,
  history: [],
};

export const useGameStore = create<{
  state: GameState;
  company: CompanyProfile | null;
  currentReport: LLMReport | null;
  lastDecisionOutcome: DecisionOutcome | null;
  currentEvent: any | null;
  actions: {
    initializeGame: (company: CompanyProfile) => void;
    nextQuarter: () => void;
    makeDecision: (decisionId: string) => void;
    updateGameState: (state: Partial<GameState>) => void;
    updateCompany: (updates: Partial<CompanyProfile>) => void;
    setReport: (report: LLMReport) => void;
    setLastDecisionOutcome: (outcome: DecisionOutcome | null) => void;
    setCurrentEvent: (event: any | null) => void;
    addXp: (amount: number) => void;
    resetGame: () => void;
  };
}>((set) => ({
  state: initialState,
  company: null,
  currentReport: null,
  lastDecisionOutcome: null,
  currentEvent: null,
  actions: {
    initializeGame: (company) => {
      let updatedCompany = { ...company };

      // Apply Founder Class Bonuses
      if (company.founderClass === 'engineer') {
        updatedCompany.automationRate += 15;
      } else if (company.founderClass === 'mba') {
        updatedCompany.aiInvestment += 200000;
      } else if (company.founderClass === 'researcher') {
        updatedCompany.aiMaturityScore += 20;
      } else if (company.founderClass === 'sales') {
        // Base Revenue scaling factor can be handled elsewhere or we can set an initial boost.
      } else if (company.founderClass === 'grit') {
        // Risk resistance handled in prediction layer or game logic.
      }

      const startYear = updatedCompany.foundedYear || 2024;
      const initialBudget = updatedCompany.startingBudget || 1000000;
      const mockHistory = [
        { year: startYear, revenue: 4500000, budget: initialBudget, roi: company.founderClass === 'mba' ? 10 : 0, morale: 75, employees: 10 }
      ];
      set({
        company: updatedCompany,
        state: {
          ...initialState,
          currentYear: startYear,
          budget: initialBudget,
          employees: 10,
          roi: company.founderClass === 'mba' ? 10 : 0,
          history: mockHistory,
        },
        lastDecisionOutcome: null,
        currentEvent: null,
      });
    },
    nextQuarter: () => {
      set((prev) => {
        const { currentQuarter, currentYear } = prev.state;
        const newQuarter = currentQuarter + 1;
        const newYear = newQuarter > 4 ? currentYear + 1 : currentYear;
        return {
          state: {
            ...prev.state,
            currentQuarter: newQuarter > 4 ? 1 : newQuarter,
            currentYear: newYear,
          },
        };
      });
    },
    makeDecision: (decisionId) => {
      set((prev) => ({ state: prev.state }));
    },
    updateGameState: (newState) => {
      set((prev) => ({
        state: { ...prev.state, ...newState },
      }));
    },
    updateCompany: (updates) => {
      set((prev) => ({
        company: prev.company ? { ...prev.company, ...updates } : null,
      }));
    },
    setReport: (report) => {
      set({ currentReport: report });
    },
    setLastDecisionOutcome: (outcome) => {
      set({ lastDecisionOutcome: outcome });
    },
    setCurrentEvent: (event) => {
      set({ currentEvent: event });
    },
    addXp: (amount) => {
      set((prev) => {
        let newXp = prev.state.xp + amount;
        let newLevel = prev.state.level;
        if (newXp >= newLevel * 1000) {
          newXp -= newLevel * 1000;
          newLevel += 1;
        }
        return { state: { ...prev.state, xp: newXp, level: newLevel } };
      });
    },
    resetGame: () => {
      set({
        state: initialState,
        company: null,
        currentReport: null,
        lastDecisionOutcome: null,
        currentEvent: null,
      });
    },
  },
}));
