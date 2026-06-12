import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGameLoop } from '@/hooks/useGameLoop';
import { useGameStore } from '@/store/gameStore';
import { DECISIONS } from '@/data/decisions';
import CEOModel from '@/components/CEOModel';
import { Joystick } from './Joystick';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Coins,
  TrendingUp,
  Smile,
  AlertTriangle,
  Terminal,
  Brain,
  Radio,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Rotating, escalating boardroom story beats so no two quarters feel the same.
const BOARD_BRIEFINGS = [
  { tag: 'CHAIRMAN', text: 'The boardroom dims. "Every quarter you hesitate, a rival ships. The market is watching, CEO — what is our move?"' },
  { tag: 'CFO', text: 'A tablet slides across the obsidian table. "Capital is finite. Spend it like the future depends on it — because it does."' },
  { tag: 'CTO', text: 'Your CTO bursts in, eyes wild. "The models are starving for compute. Feed them now, or we fall behind the curve forever."' },
  { tag: 'TRADING FLOOR', text: 'Static crackles over the comms. "Word from the street: the analysts are shorting every adopter who moves too slow."' },
  { tag: 'CHRO', text: 'The CHRO lowers her voice. "The workforce is restless. Whispers of automation are spreading through every floor below us."' },
  { tag: 'WAR ROOM', text: 'Red light pulses across the glass walls. "A competitor just demoed an autonomous agent. The clock is ticking."' },
  { tag: 'CRO', text: 'The Risk Officer steeples his fingers. "Bold bets win headlines. Reckless ones write obituaries. Choose with open eyes."' },
  { tag: 'CHAIRMAN', text: '"History remembers the bold and forgets the cautious," the Chairman says. "Which legacy will you leave?"' },
  { tag: 'ENCRYPTED', text: 'A memo decrypts on your private channel. "The singularity is not a question of if, but when. Put us at the front of it."' },
  { tag: 'CITY DESK', text: 'Neon rain streaks the windows of the 100th floor. A new quarter dawns over the skyline, and the board awaits your directive.' },
  { tag: 'CTO', text: '"Our last deployment is already paying for itself," your CTO grins. "Imagine what the next one does. Press the advantage."' },
  { tag: 'CFO', text: '"Shareholders convene in ninety days," the CFO warns. "Give them a number that silences the doubters."' },
];

const DIRECTIVE_PROMPTS = [
  'Walk the floor and decide where to strike next.',
  'Three initiatives await your signature. Choose your battlefield.',
  'The board defers to you. Approach a station to issue your order.',
  'Your move shapes the quarter. Step up to a console to begin.',
  'Power is leverage applied at the right moment. Pick yours.',
];

export const QuarterlyDecision = () => {
  const state = useGameStore((s) => s.state);
  const company = useGameStore((s) => s.company);
  const currentEvent = useGameStore((s) => s.currentEvent);
  const { isLoading, makeQuarterDecision, error } = useGameLoop();
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showBoundaryMessage, setShowBoundaryMessage] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isMusicOn) {
        audioRef.current.play().catch(err => console.error("Audio playback failed", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicOn]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    const el = document.getElementById('game-container');
    if (!document.fullscreenElement && el) {
      el.requestFullscreen().catch(err => console.error(err));
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
    }
  };

  // Filter decisions based on current decisions hand
  const unlockedDecisions = DECISIONS.filter(d => state.currentDecisions.includes(d.id));

  // Monotonic quarter counter drives an escalating story so each turn reads fresh.
  const turn = state.currentYear * 4 + state.currentQuarter;
  const briefing = BOARD_BRIEFINGS[turn % BOARD_BRIEFINGS.length];
  const directivePrompt = DIRECTIVE_PROMPTS[turn % DIRECTIVE_PROMPTS.length];

  const handleDecision = async (decisionId: string) => {
    setSelectedDecision(decisionId);
    try {
      await makeQuarterDecision(decisionId);
      // We clear the selection so that when the player returns, the terminal asks to walk to a station
      setSelectedDecision(null);
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
          <span className="font-space text-sm font-black tracking-widest text-cyan-400 text-glow-cyan">
            // BOARD MEETING // STRATEGY DIRECTIVE
          </span>
          <span className="text-xs font-space font-semibold bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-purple-400">
            QUARTER: Q{state.currentQuarter} <span className="text-slate-600">//</span> YEAR: {state.currentYear}
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 relative z-10">
        {/* Story briefing — rotates and escalates each quarter */}
        <div className="mb-6 relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-r from-slate-950/90 via-slate-900/50 to-slate-950/90 p-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="absolute inset-0 cyber-sweep-overlay opacity-30" />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400/80 uppercase">
              Incoming Transmission <span className="text-slate-600">//</span> {briefing.tag}
            </span>
          </div>
          <p className="text-sm text-slate-300 font-space leading-relaxed italic relative z-10">
            {briefing.text}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg flex items-center gap-3 text-xs font-mono">
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0" />
            <span>ERROR_CODE: {error}</span>
          </div>
        )}

        {currentEvent && (
          <div className="mb-6 p-5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex flex-col gap-2 relative overflow-hidden animate-pulse">
             <div className="absolute inset-0 cyber-sweep-overlay opacity-50" />
             <div className="flex items-center gap-2 text-rose-400 relative z-10">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-space font-bold uppercase tracking-widest text-sm">{currentEvent.title}</h3>
             </div>
             <p className="text-xs text-rose-300 relative z-10 font-space">{currentEvent.description}</p>
          </div>
        )}

        {(() => {
          const actionCard = (
            <div className={`flex flex-col transition-all duration-300 ${isFullscreen ? 'absolute bottom-6 right-6 w-80 z-40 shadow-2xl' : ''}`}>
              <div className={`bg-slate-950/90 border border-slate-800 rounded-xl p-6 flex flex-col relative overflow-hidden cyber-glass shadow-xl ${isFullscreen ? 'max-h-[80vh] overflow-y-auto' : 'flex-1'}`}>
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-40" />
                
                <h3 className="text-sm font-space font-bold text-cyan-400 tracking-widest uppercase mb-6 flex items-center gap-2">
                  <Terminal className="w-4 h-4" />
                  Terminal Uplink
                </h3>

                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
                    <span className="text-cyan-400 font-space font-bold tracking-widest animate-pulse text-sm">IMPLEMENTING...</span>
                  </div>
                ) : !selectedDecision ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center animate-pulse">
                      <Brain className="w-8 h-8 text-slate-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-slate-300 font-space font-bold uppercase tracking-widest text-sm">Awaiting CEO Directive</p>
                      <p className="text-slate-500 text-xs font-mono">
                        {directivePrompt}<br/><br/>
                        <span className="text-emerald-400">← LEFT: {unlockedDecisions[0]?.title.replace(/_/g, ' ')}</span><br/>
                        <span className="text-yellow-400">↑ STRAIGHT: {unlockedDecisions[1]?.title.replace(/_/g, ' ')}</span><br/>
                        <span className="text-cyan-400">→ RIGHT: {unlockedDecisions[2]?.title.replace(/_/g, ' ')}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300">
                    {(() => {
                      const decision = unlockedDecisions.find(d => d.id === selectedDecision);
                      if (!decision) return null;
                      
                      return (
                        <>
                          <h4 className="text-xl font-space font-bold text-white mb-4 tracking-wide leading-tight">
                            {decision.title.replace(/_/g, ' ')}
                          </h4>
                          
                          <p className="text-sm text-slate-400 leading-relaxed font-space mb-6 flex-1">
                            {decision.description}
                          </p>

                          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Coins className="h-4 w-4 text-rose-400" />
                                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Cost</span>
                              </div>
                              <span className="font-bold text-rose-400 text-lg">-${decision.cost.toLocaleString()}</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => handleDecision(decision.id)}
                            className="w-full h-12 font-space font-black tracking-widest bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all uppercase"
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Confirm Action
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          );

          return (
            <div className={`grid gap-6 ${isFullscreen ? 'block' : 'lg:grid-cols-[2fr,1fr]'}`}>
              {/* Left side: 3D CEO Game */}
              <div id="game-container" className={`w-full relative rounded-xl overflow-hidden border border-slate-800 cyber-glass bg-[#020617] ${isFullscreen ? 'h-screen border-none rounded-none' : 'h-[500px]'}`}>
                
                {isLoading && (
                  <div className="absolute inset-0 z-30 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center">
                  </div>
                )}

                <Joystick />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMusicOn(!isMusicOn)}
                  className="absolute top-4 right-16 z-20 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-white"
                >
                  {isMusicOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="absolute top-4 right-4 z-20 bg-slate-900/50 hover:bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-white"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>

                {/* Hidden Audio Element */}
                <audio ref={audioRef} src="/gamesound.mp3" loop />

                <div className="absolute bottom-4 left-4 right-0 z-10 flex justify-start pointer-events-none">
                  <span className="bg-black/50 px-4 py-1 rounded text-[10px] text-white tracking-widest font-mono">USE ARROW KEYS TO WALK TO A STATION{isFullscreen ? ' (ESC TO EXIT FULLSCREEN)' : ''}</span>
                </div>

                {showBoundaryMessage && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/95 border border-rose-500 p-6 rounded-xl z-50 animate-in zoom-in-95 duration-200 text-center shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                    <AlertTriangle className="h-8 w-8 text-rose-500 mx-auto mb-3 animate-pulse" />
                    <p className="text-rose-400 font-bold font-orbitron tracking-widest text-sm mb-1 uppercase">Restricted Area</p>
                    <p className="text-slate-300 font-space text-xs">Hey CEO! Lot of work to do.</p>
                    <p className="text-slate-400 font-space text-[10px] mt-1">Go back and make this company big!</p>
                  </div>
                )}

                <CEOModel
                  playable={true}
                  archetype={company?.skin || 'researcher'}
                  selectedStation={selectedDecision ? 
                    (selectedDecision === unlockedDecisions[0]?.id ? 'hr' : 
                     selectedDecision === unlockedDecisions[1]?.id ? 'boardroom' : 
                     selectedDecision === unlockedDecisions[2]?.id ? 'ml' : 'none') 
                    : 'none'}
                  onStationChange={(station) => {
                    if (isLoading) return;
                    if (station === 'none') {
                      setSelectedDecision(null);
                      return;
                    }
                    if (station === 'boundary') {
                      if (!showBoundaryMessage) {
                        setShowBoundaryMessage(true);
                        setTimeout(() => setShowBoundaryMessage(false), 2500);
                      }
                      return;
                    }
                    
                    let dec = null;
                    if (station === 'hr' && unlockedDecisions[0]) dec = unlockedDecisions[0].id;
                    if (station === 'boardroom' && unlockedDecisions[1]) dec = unlockedDecisions[1].id;
                    if (station === 'ml' && unlockedDecisions[2]) dec = unlockedDecisions[2].id;
                    
                    if (dec !== selectedDecision) {
                      setSelectedDecision(dec);
                    }
                  }}
                />
                
                {/* Render action card overlay in fullscreen */}
                {isFullscreen && actionCard}
              </div>

              {/* Render normal side action card when not fullscreen */}
              {!isFullscreen && actionCard}
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
};

export default QuarterlyDecision;
