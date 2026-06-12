// Company profile structure
export interface CompanyProfile {
  name: string;
  industry: string;
  description: string;
  foundedYear: number;
  founderName: string;
  startingBudget: number;
  country: string;
  aiAdoptionLevel: number;
  aiInvestment: number;
  automationRate: number;
  trainingHours: number;
  aiMaturityScore: number;
  deploymentCount: number;
  employees: number;
  skin?: string; // cosmetic CEO appearance only — no gameplay effect
}

// Game state structure
export interface GameState {
  currentYear: number;
  currentQuarter: number;
  budget: number;
  morale: number;
  roi: number;
  revenue: number;
  employees: number;
  xp: number;
  level: number;
  unlockedTech: string[];
  currentDecisions: string[];
  isGameOver: boolean;
  gameResult: 'victory' | 'bankruptcy' | null;
  history: YearHistory[];
}

export interface YearHistory {
  year: number;
  quarter?: number;
  revenue: number;
  budget: number;
  roi: number;
  morale: number;
  employees?: number;
}

// LLM Report structure
export interface LLMReport {
  quarter: number;
  year: number;
  summary: string;
  revenue: number;
  expenses: number;
  roi: number;
  moraleChange: number;
  recommendations: string[];
  risks: string[];
}

// Decision options
export interface Decision {
  id: string;
  title: string;
  description: string;
  cost: number;
  roiImpact: number;
  moraleImpact: number;
  riskLevel: 'low' | 'medium' | 'high';
}

// UI component types
export interface StatCardProps {
  label: string;
  value: number | string;
  trend?: number;
  icon: string;
  color: string;
}
