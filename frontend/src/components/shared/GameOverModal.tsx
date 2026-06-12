import { useGameStore } from '@/store/gameStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, AlertOctagon, RotateCcw, ArrowRight, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const GameOverModal = () => {
  const state = useGameStore((s) => s.state);
  const company = useGameStore((s) => s.company);
  const actions = useGameStore((s) => s.actions);
  const navigate = useNavigate();

  if (!state.isGameOver) return null;

  const isVictory = state.gameResult === 'victory';

  const handleRestart = () => {
    actions.resetGame();
    navigate('/');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      {/* Background neon pulse glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
        isVictory ? 'bg-yellow-500/10 animate-pulse' : 'bg-rose-500/10 animate-pulse'
      }`} />

      {/* Cyber ambient scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

      <Card className={`max-w-xl w-full cyber-glass relative shadow-2xl overflow-hidden ${
        isVictory 
          ? 'cyber-border-gold shadow-[0_0_50px_rgba(234,179,8,0.2)]' 
          : 'cyber-border-magenta shadow-[0_0_50px_rgba(244,63,94,0.2)]'
      }`}>
        {/* Dynamic flashing top edge line */}
        <div className={`absolute inset-x-0 top-0 h-[3px] ${
          isVictory ? 'bg-gradient-to-r from-transparent via-yellow-400 to-transparent' : 'bg-gradient-to-r from-transparent via-rose-500 to-transparent'
        }`} />

        <CardContent className="p-8 text-center space-y-6 relative z-10">
          {isVictory ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-md animate-ping" />
                <Trophy className="h-20 w-20 text-yellow-400 mx-auto drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]" />
              </div>
              <h1 className="text-4xl font-black font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-orange-400 text-glow-gold">
                🎉 VICTORY ACHIEVED!
              </h1>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-space">
                Outstanding strategic leadership! You successfully scaled <span className="text-yellow-400 font-bold font-orbitron">{company?.name.toUpperCase()}</span> and navigated the corporation safely into the target milestone of <span className="text-cyan-400 font-bold font-orbitron">Year 2035</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-md animate-pulse" />
                <AlertOctagon className="h-20 w-20 text-rose-500 mx-auto drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]" />
              </div>
              <h1 className="text-4xl font-black font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-400 to-red-600 text-glow-magenta">
                💸 DEBT BANKRUPTCY
              </h1>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-space">
                Critical financial depletion! <span className="text-rose-400 font-bold font-orbitron">{company?.name.toUpperCase()}</span> has exhausted all operating capital reserves and filed for bankruptcy in <span className="text-rose-500 font-bold font-orbitron">Year {state.currentYear} // Quarter Q{state.currentQuarter}</span>.
              </p>
            </div>
          )}

          {/* Vitals summary HUD grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 font-orbitron">
            
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-900 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">FINAL BUDGET</span>
              <p className={`text-sm font-bold mt-1 ${isVictory ? 'text-green-400' : 'text-rose-400'}`}>
                ${state.budget.toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-900 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">FINAL ROI</span>
              <p className="text-sm font-bold text-cyan-400 mt-1">
                {state.roi}%
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-900 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">EMPLOYEES</span>
              <p className="text-sm font-bold text-purple-400 mt-1">
                {state.employees}
              </p>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full justify-center">
            
            <Button
              onClick={handleRestart}
              className="py-5 px-6 font-orbitron font-bold text-xs tracking-wider bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              NEW FOUNDER TICKET //
            </Button>

            <Button
              onClick={() => {
                // Keep the isGameOver state but hide the modal by navigating or closing?
                // The user says "add more pop ups where it is needed like that victory one".
                // We'll navigate to /outcome which displays the details report.
                navigate('/outcome');
              }}
              className={`py-5 px-6 font-orbitron font-black text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all ${
                isVictory 
                  ? 'bg-yellow-500 text-slate-950 hover:bg-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.3)]' 
                  : 'bg-rose-500 text-slate-950 hover:bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              VIEW ANALYTICS GRAPH
              <ArrowRight className="h-4 w-4" />
            </Button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};
