import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { LoadingOverlay } from '@/components/shared/LoadingOverlay';
import { AIReportModal } from '@/components/shared/AIReportModal';
import { GameOverModal } from '@/components/shared/GameOverModal';
import { QuarterlyDecision } from '@/components/game/QuarterlyDecision';
import { GameTimeline } from '@/components/game/GameTimeline';
import { StatCard } from '@/components/dashboard/StatCard';
import { ROIChart } from '@/components/dashboard/ROIChart';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Heart,
  Terminal
} from 'lucide-react';

export const Engine = () => {
  const state = useGameStore((s) => s.state);
  const company = useGameStore((s) => s.company);
  const currentReport = useGameStore((s) => s.currentReport);
  const { isLoading, fetchQuarterReport } = useGameLoop();

  useEffect(() => {
    if (company) {
      fetchQuarterReport();
    }
  }, [company]);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#060814] text-white">
        <p className="text-muted-foreground">Please create a company first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060814] text-white scanlines">
      <LoadingOverlay isLoading={isLoading} />
      
      <div className="container py-8 px-6 mx-auto max-w-7xl space-y-8">
        
        {/* Header HUD panel */}
        <div className="cyber-glass cyber-border-cyan rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Terminal className="h-7 w-7 text-cyan-400 animate-pulse" />
            <div>
              <h1 className="text-2xl font-black font-orbitron text-slate-100 tracking-wider">
                {company.name.toUpperCase()}
              </h1>
              <p className="text-xs text-slate-400">
                CORE DIRECTIVE: {company.description} <span className="text-slate-600">//</span> SECTOR: {company.industry.toUpperCase()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-slate-950 px-4 py-2 rounded border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-orbitron font-bold text-slate-400 uppercase tracking-widest">
              SIMULATION_ACTIVE
            </span>
          </div>
        </div>

        {/* Visual Progress Timeline */}
        <GameTimeline currentYear={state.currentYear} />

        {/* HUD Vitals stats grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Budget"
            value={`$${state.budget.toLocaleString()}`}
            trend={5.2}
            icon={<DollarSign className="h-5 w-5" />}
            color="bg-slate-950/60"
          />
          
          <StatCard
            label="ROI"
            value={`${state.roi}%`}
            trend={state.roi >= 0 ? 3.1 : -2.4}
            icon={<TrendingUp className="h-5 w-5" />}
            color="bg-slate-950/60"
          />
          
          <StatCard
            label="Employees"
            value={state.employees}
            icon={<Users className="h-5 w-5" />}
            color="bg-slate-950/60"
          />
          
          <StatCard
            label="Morale"
            value={`${state.morale}%`}
            trend={2.1}
            icon={<Heart className="h-5 w-5" />}
            color="bg-slate-950/60"
          />
        </div>

        {/* Simulation operations board split panel */}
        <div className="grid lg:grid-cols-2 gap-8">
          <QuarterlyDecision />
          <ROIChart />
        </div>
      </div>

      {currentReport && <AIReportModal />}
      <GameOverModal />
    </div>
  );
};

export default Engine;
