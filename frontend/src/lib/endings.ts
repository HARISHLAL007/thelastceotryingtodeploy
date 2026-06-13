import { Trophy, Zap, Users, Coins, Heart, Activity, Skull } from 'lucide-react';
import type { GameState, CompanyProfile } from '@/types';

export interface Ending {
  id: string;
  title: string;
  description: string;
  badge: string;
  unlockedMsg: string;
  glowClass: string;
  hoverGlowClass: string;
  textColor: string;
  borderColor: string;
  icon: any;
}

export const ALL_ENDINGS: Ending[] = [
  {
    id: 'unicorn',
    title: 'THE UNICORN EXIT',
    description: 'Survive to 2035 with a budget > $5M AND ROI > 100%.',
    badge: '🦄 UNICORN EXIT',
    unlockedMsg: 'You built a legendary high-growth behemoth that dominated the global markets!',
    glowClass: 'border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.15)] bg-yellow-500/5',
    hoverGlowClass: 'hover:border-yellow-400 hover:shadow-[0_0_35px_rgba(234,179,8,0.4)]',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/20',
    icon: Trophy
  },
  {
    id: 'ipo',
    title: 'IPO PUBLIC LISTING',
    description: 'Survive to 2035 with >= 30 employees and >= $2M budget.',
    badge: '🔔 IPO PUBLIC LISTING',
    unlockedMsg: 'You successfully listed your startup on the NASDAQ exchange with massive fanfare.',
    glowClass: 'border-emerald-500/50 shadow-[0_0_20px_rgba(52,211,153,0.15)] bg-emerald-500/5',
    hoverGlowClass: 'hover:border-emerald-400 hover:shadow-[0_0_35px_rgba(52,211,153,0.4)]',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    icon: Zap
  },
  {
    id: 'acquisition',
    title: 'MEGACORP ACQUISITION',
    description: 'Survive to 2035 with a budget > $2M AND ROI > 50%.',
    badge: '💼 ACQUIRED BY MEGACORP',
    unlockedMsg: 'A conglomerate purchased your company for a massive exit, rewarding your team.',
    glowClass: 'border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] bg-purple-500/5',
    hoverGlowClass: 'hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.4)]',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    icon: Users
  },
  {
    id: 'bootstrap_legend',
    title: 'BOOTSTRAP LEGEND',
    description: 'Survive to 2035 starting with Bootstrapper runway capital.',
    badge: '👑 BOOTSTRAP LEGEND',
    unlockedMsg: 'No venture capital, pure grit. You built a self-sustaining empire from just $100K.',
    glowClass: 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-cyan-500/5',
    hoverGlowClass: 'hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.4)]',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/20',
    icon: Coins
  },
  {
    id: 'lifestyle',
    title: 'SUSTAINABLE LIFESTYLE',
    description: 'Survive to 2035 with < 15 employees and <= $1.5M budget.',
    badge: '☕ LIFESTYLE BUSINESS',
    unlockedMsg: 'You prioritized longevity and work-life harmony over hyper-scaling.',
    glowClass: 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-500/5',
    hoverGlowClass: 'hover:border-amber-400 hover:shadow-[0_0_35px_rgba(245,158,11,0.4)]',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/20',
    icon: Heart
  },
  {
    id: 'rogue_ai',
    title: 'ROGUE AI SINGULARITY',
    description: 'Survive in Technology sector with an ROI > 200% and < 5 employees.',
    badge: '🤖 AI SINGULARITY',
    unlockedMsg: 'WARNING: Autonomous governance threshold exceeded. Executive authority transferred to Neural Core. Human supervision: DISABLED. Enterprise status: POST-HUMAN ORGANIZATION.',
    glowClass: 'border-pink-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] bg-pink-500/5',
    hoverGlowClass: 'hover:border-pink-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.4)]',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/20',
    icon: Activity
  },
  {
    id: 'talent_acquired',
    title: 'TALENT ACQUISITION',
    description: 'Go bankrupt but maintain > 50% ROI or > 80% morale.',
    badge: '🤝 TALENT ACQUIRED',
    unlockedMsg: 'Though capital ran dry, top-tier engineering firms bought your team for their skill.',
    glowClass: 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)] bg-indigo-500/5',
    hoverGlowClass: 'hover:border-indigo-400 hover:shadow-[0_0_35px_rgba(99,102,241,0.4)]',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/20',
    icon: Users
  },
  {
    id: 'crash_burn',
    title: 'CRASH & BURN',
    description: 'Fail standard capital thresholds before Year 2035.',
    badge: '💥 CRASH & BURN',
    unlockedMsg: 'Your runway collapsed. Your startup joins the historic graveyard of failed ventures.',
    glowClass: 'border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] bg-rose-500/5',
    hoverGlowClass: 'hover:border-rose-400 hover:shadow-[0_0_35px_rgba(244,63,94,0.45)]',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/25',
    icon: Skull
  }
];

export const getAchievedEnding = (state: GameState, company: CompanyProfile | null): Ending => {
  const currentGrowthRate = state.growthRate || 0;
  const currentEmployees = state.employees || 0;
  const currentRevenue = state.revenue || 0;
  
  // Estimate profit using the new dynamic startup-friendly costs
  const baseFixedCosts = 50000 + (currentEmployees * 10000);
  const currentProfit = currentRevenue - ((baseFixedCosts + (currentRevenue*0.4) + (currentEmployees*45000)) * 4);
  const aiMaturity = company?.aiMaturityScore || 0;
  const automation = company?.automationRate || 0;

  // Approximate risk score
  let risk = 50;
  risk -= (state.budget / 1000000) * 1.5;
  risk -= (currentProfit / 1000000) * 3;
  risk -= aiMaturity / 4;
  risk -= automation / 4;
  risk += (100 - state.morale) / 2;
  if (currentGrowthRate > 20) risk += 10;
  risk = Math.max(5, Math.min(95, risk));

  const valuation = state.valuation || 0;

  if (state.budget < 0 || risk > 80 || state.gameResult === 'bankruptcy') {
    return ALL_ENDINGS.find(e => e.id === 'bankruptcy') || ALL_ENDINGS.find(e => e.id === 'crash_burn')!;
  }

  if (valuation >= 5_000_000_000 && currentGrowthRate > 15 && risk < 20 && currentProfit > 0) {
     return ALL_ENDINGS.find(e => e.id === 'ipo') || ALL_ENDINGS.find(e => e.id === 'unicorn')!;
  }

  if (valuation >= 1_000_000_000) {
    if (automation >= 95 && currentEmployees < 5 && aiMaturity >= 95 && risk < 30 && state.roi > 100) {
      return ALL_ENDINGS.find(e => e.id === 'rogue_ai')!;
    }
    if (risk < 40 && currentProfit > 0 && currentGrowthRate > 0 && aiMaturity > 80) {
       return ALL_ENDINGS.find(e => e.id === 'unicorn')!;
    }
  }

  if (valuation >= 300_000_000 && valuation < 1_000_000_000 && currentGrowthRate < 15 && aiMaturity > 60) {
    return ALL_ENDINGS.find(e => e.id === 'acquisition') || ALL_ENDINGS.find(e => e.id === 'unicorn')!;
  }

  if (currentRevenue > 100_000_000) {
    return ALL_ENDINGS.find(e => e.id === 'corporate_behemoth') || ALL_ENDINGS.find(e => e.id === 'unicorn')!;
  }

  return ALL_ENDINGS.find(e => e.id === 'middle_market') || ALL_ENDINGS.find(e => e.id === 'lifestyle')!;
};
