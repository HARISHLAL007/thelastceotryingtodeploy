import { create } from 'zustand';
import type { GameState, CompanyProfile, LLMReport } from '@/types';

export interface DecisionOutcome {
  id: string;
  title: string;
  cost: number;
  roiImpact: number;
  moraleImpact: number;
  employeeGain: number;
}

const initialState: GameState = {
  currentYear: 2024,
  currentQuarter: 1,
  budget: 1000000,
  morale: 75,
  roi: 0,
  revenue: 0,
  employees: 10,
  isGameOver: false,
  gameResult: null,
  history: [],
};

export const useGameStore = create<{
  state: GameState;
  company: CompanyProfile | null;
  currentReport: LLMReport | null;
  lastDecisionOutcome: DecisionOutcome | null;
  actions: {
    initializeGame: (company: CompanyProfile) => void;
    nextQuarter: () => void;
    makeDecision: (decisionId: string) => void;
    updateGameState: (state: Partial<GameState>) => void;
    setReport: (report: LLMReport) => void;
    setLastDecisionOutcome: (outcome: DecisionOutcome | null) => void;
    resetGame: () => void;
  };
}>((set) => ({
  state: initialState,
  company: null,
  currentReport: null,
  lastDecisionOutcome: null,
  actions: {
    initializeGame: (company) => {
      const startYear = company.foundedYear || 2024;
      const initialBudget = company.startingBudget || 1000000;
      // Pre-fill scaled mock historical data relative to the starting budget
      const mockHistory = [
        { year: startYear - 4, revenue: Math.floor(initialBudget * 0.08), budget: Math.floor(initialBudget * 0.4), roi: 5, morale: 70 },
        { year: startYear - 3, revenue: Math.floor(initialBudget * 0.12), budget: Math.floor(initialBudget * 0.55), roi: 8, morale: 75 },
        { year: startYear - 2, revenue: Math.floor(initialBudget * 0.18), budget: Math.floor(initialBudget * 0.7), roi: 12, morale: 68 },
        { year: startYear - 1, revenue: Math.floor(initialBudget * 0.26), budget: Math.floor(initialBudget * 0.85), roi: 15, morale: 72 },
      ];
      set({
        company,
        state: {
          ...initialState,
          currentYear: startYear,
          budget: initialBudget,
          employees: 10,
          history: mockHistory,
        },
        lastDecisionOutcome: null,
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
    setReport: (report) => {
      set({ currentReport: report });
    },
    setLastDecisionOutcome: (outcome) => {
      set({ lastDecisionOutcome: outcome });
    },
    resetGame: () => {
      set({
        state: initialState,
        company: null,
        currentReport: null,
        lastDecisionOutcome: null,
      });
    },
  },
}));
