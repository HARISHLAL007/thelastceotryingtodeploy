import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/store/gameStore';
import { 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  Coins, 
  TrendingUp, 
  Smile
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const QuarterlyDecision = () => {
  const state = useGameStore((s) => s.state);
  const { isLoading, makeQuarterDecision, error } = useGameLoop();
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const decisions = [
    {
      id: 'hire-employees',
      title: 'HIRE_5_EMPLOYEES',
      description: 'Expand your team size. Accelerates core capability & throughput capacity.',
      cost: 50000,
      roiImpact: 10,
      moraleImpact: 8,
      riskLevel: 'low' as const,
    },
    {
      id: 'marketing-campaign',
      title: 'LAUNCH_CAMPAIGN',
      description: 'Invest in multi-channel advertising. Fast tracks brand equity & market size.',
      cost: 75000,
      roiImpact: 20,
      moraleImpact: 2,
      riskLevel: 'medium' as const,
    },
    {
      id: 'product-development',
      title: 'DEVELOP_NEW_PRODUCT',
      description: 'Perform advanced R&D for next-gen products. High payoff potential.',
      cost: 120000,
      roiImpact: 35,
      moraleImpact: 5,
      riskLevel: 'high' as const,
    },
  ];

  const handleDecision = async (decisionId: string) => {
    setSelectedDecision(decisionId);
    try {
      await makeQuarterDecision(decisionId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="cyber-glass border-slate-800 shadow-xl overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40 animate-pulse" />
      <div className="cyber-sweep-overlay" />

      <CardHeader className="border-b border-slate-900 pb-4 relative z-10">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="font-orbitron text-sm font-black tracking-widest text-cyan-400 text-glow-cyan">
            // DECISION ENGINE v1.0 //
          </span>
          <span className="text-xs font-orbitron font-semibold bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-purple-400">
            QUARTER: Q{state.currentQuarter} <span className="text-slate-600">//</span> YEAR: {state.currentYear}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 relative z-10">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg flex items-center gap-3 text-xs font-mono">
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <span>ERROR_CODE: {error}</span>
          </div>
        )}

        <div className="grid gap-6">
          {decisions.map((decision) => {
            const isSelected = selectedDecision === decision.id;
            const isHigh = decision.riskLevel === 'high';
            const isMedium = decision.riskLevel === 'medium';
            
            let cardStyle = "cyber-border-cyan hover:border-cyan-400/80";
            let riskGlow = "text-cyan-400";
            if (isHigh) {
              cardStyle = "cyber-border-magenta hover:border-rose-400/80";
              riskGlow = "text-rose-400";
            } else if (isMedium) {
              cardStyle = "cyber-border-gold hover:border-yellow-400/80";
              riskGlow = "text-yellow-400";
            }

            return (
              <div
                key={decision.id}
                className={cn(
                  "cyber-glass p-5 rounded-xl transition-all duration-300 hover:scale-[1.015] relative group overflow-hidden cursor-pointer",
                  cardStyle,
                  isSelected && "bg-slate-950/90 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                )}
                onClick={() => setSelectedDecision(decision.id)}
              >
                {/* Visual scanner bar inside card */}
                <div className="cyber-sweep-overlay" />

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center space-x-2">
                      {/* Blinking cyber status node */}
                      <span className="relative flex h-2 w-2">
                        <span className={cn(
                          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", 
                          isHigh ? "bg-rose-400" : isMedium ? "bg-yellow-400" : "bg-cyan-400"
                        )}></span>
                        <span className={cn(
                          "relative inline-flex rounded-full h-2 w-2", 
                          isHigh ? "bg-rose-500" : isMedium ? "bg-yellow-500" : "bg-cyan-500"
                        )}></span>
                      </span>

                      <span className={cn("text-[10px] font-orbitron font-black uppercase tracking-widest", riskGlow)}>
                        [{decision.riskLevel.toUpperCase()}_RISK]
                      </span>
                      <span className="text-[10px] text-slate-600 font-orbitron font-bold">ID::{decision.id.toUpperCase()}</span>
                    </div>

                    <h3 className="text-sm font-orbitron font-black text-slate-100 group-hover:text-cyan-300 transition-colors tracking-wide">
                      {decision.title}
                    </h3>
                    
                    <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                      {decision.description}
                    </p>

                    {/* Stats impact grid */}
                    <div className="grid grid-cols-3 gap-3 bg-slate-950/80 p-3 rounded-lg border border-slate-900/80 mt-4 text-[10px] font-orbitron">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-3.5 w-3.5 text-rose-400" />
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest">COST</span>
                          <span className="font-bold text-slate-200">-${decision.cost.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest">ROI</span>
                          <span className="font-bold text-emerald-400">+{decision.roiImpact}%</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Smile className="h-3.5 w-3.5 text-purple-400" />
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 uppercase tracking-widest">MORALE</span>
                          <span className="font-bold text-purple-400">+{decision.moraleImpact}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <div className="flex sm:flex-col justify-end items-center sm:self-center gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecision(decision.id);
                      }}
                      disabled={isLoading}
                      variant={isSelected ? 'default' : 'outline'}
                      className={cn(
                        "font-orbitron font-black text-xs tracking-widest border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 min-w-[120px] transition-all",
                        isSelected && "bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)] border-none"
                      )}
                    >
                      {isLoading && selectedDecision === decision.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      ) : isSelected ? (
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      ) : null}
                      {isLoading && selectedDecision === decision.id ? "SYNCING..." : isSelected ? "EXECUTE" : "SELECT ACTION"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
