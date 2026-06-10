import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Coins, 
  TrendingUp, 
  Heart, 
  Users, 
  Lightbulb, 
  AlertTriangle, 
  Zap,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const AIReportModal = () => {
  const state = useGameStore((s) => s.state);
  const actions = useGameStore((s) => s.actions);
  const report = useGameStore((s) => s.currentReport);
  const outcome = useGameStore((s) => s.lastDecisionOutcome);

  if (!report) return null;

  const handleClose = () => {
    actions.setReport(null as any);
    actions.setLastDecisionOutcome(null);
  };

  const netQuarterChange = report.revenue - report.expenses;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      {/* Background cyber ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      
      <Card className="max-w-2xl w-full cyber-glass border-slate-800/80 text-white relative shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden my-8">
        {/* Neon top border border-glow */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        <div className="cyber-sweep-overlay opacity-30" />

        <CardHeader className="border-b border-slate-900 pb-4 relative z-10">
          <CardTitle className="flex items-center justify-between">
            <span className="font-space text-sm font-bold tracking-widest text-cyan-400 text-glow-cyan flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400 animate-pulse" />
              XGBOOST REVENUE & PRODUCTIVITY PREDICTOR
            </span>
            <span className="text-[10px] font-space font-semibold bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
              Q{report.quarter} {report.year}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6 relative z-10 max-h-[80vh] overflow-y-auto">
          
          {/* SECTION 1: DECISION CONSEQUENCES */}
          {outcome && (
            <div className="space-y-3">
              <h3 className="text-xs font-space font-bold text-slate-400 tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                DECISION CONSEQUENCES: {outcome.title}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                
                {/* Cost impact */}
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/60 flex flex-col justify-between hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-space">
                    <span>CAPITAL EXPENDITURE</span>
                    <Coins className="h-3.5 w-3.5 text-rose-400" />
                  </div>
                  <p className="text-sm font-bold font-space text-rose-400 mt-1">
                    -${outcome.cost.toLocaleString()}
                  </p>
                </div>

                {/* ROI impact */}
                <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/60 flex flex-col justify-between hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-space">
                    <span>ROI SHIFT</span>
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                  </div>
                  <p className="text-sm font-bold font-space text-emerald-400 mt-1">
                    +{outcome.roiImpact}%
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* SECTION 2: QUARTER PERFORMANCE SUMMARY */}
          <div className="space-y-3">
            <h3 className="text-xs font-space font-bold text-slate-400 tracking-wider flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              QUARTERLY FISCAL PERFORMANCE
            </h3>
            
            <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-4 rounded-lg border border-slate-900">
              
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both">
                <span className="text-[10px] text-slate-500 font-space block">REVENUE GENERATED</span>
                <p className="text-sm font-bold font-space text-emerald-400 mt-0.5 animate-pulse">
                  +${report.revenue.toLocaleString()}
                </p>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 fill-mode-both">
                <span className="text-[10px] text-slate-500 font-space block">OPERATING EXPENSES</span>
                <p className="text-sm font-bold font-space text-rose-400 mt-0.5">
                  -${report.expenses.toLocaleString()}
                </p>
              </div>

              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300 fill-mode-both">
                <span className="text-[10px] text-slate-500 font-space block">NET YIELD FLOW</span>
                <p className={cn(
                  "text-sm font-bold font-space mt-0.5 shadow-sm",
                  netQuarterChange >= 0 ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]"
                )}>
                  {netQuarterChange >= 0 ? '+' : '-'}${Math.abs(netQuarterChange).toLocaleString()}
                </p>
              </div>

            </div>
          </div>

          {/* SECTION 3: BOARD INTELLIGENCE FEED */}
          <div className="space-y-4">
            <div className="bg-slate-950/40 border border-slate-800/80 p-4 rounded-lg space-y-2">
              <span className="text-[9px] font-space font-bold text-cyan-400 tracking-wider">// AI_BOARD_INTELLIGENCE_SUMMARY_</span>
              <p className="text-xs text-slate-300 leading-relaxed font-space">
                {report.summary}
              </p>
            </div>

            {/* Recommendations & Risks Row */}
            <div className="grid md:grid-cols-2 gap-4">
              
              {/* Recommendations */}
              {report.recommendations && report.recommendations.length > 0 && (
                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/50 space-y-2.5">
                  <h4 className="font-space font-bold text-[10px] text-emerald-400 tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="h-3.5 w-3.5 text-emerald-400" />
                    RECOMMENDED STABILIZERS_
                  </h4>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 list-none pl-0">
                    {report.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-normal">
                        <ArrowRight className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Risks */}
              {report.risks && report.risks.length > 0 && (
                <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800/50 space-y-2.5">
                  <h4 className="font-space font-bold text-[10px] text-rose-400 tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                    IDENTIFIED RISK VECTORS_
                  </h4>
                  <ul className="text-[11px] text-slate-400 space-y-1.5 list-none pl-0">
                    {report.risks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-1.5 leading-normal">
                        <ArrowRight className="h-3 w-3 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{risk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>

          <Button 
            className="w-full mt-2 py-5 font-space font-black text-xs tracking-widest bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)] transition-all" 
            onClick={handleClose}
          >
            ACKNOWLEDGE & CLOSE ANALYSIS //
          </Button>

        </CardContent>
      </Card>
    </div>
  );
};
export default AIReportModal;
