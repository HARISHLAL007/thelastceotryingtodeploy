import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Trophy, 
  XCircle, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Coins, 
  Users, 
  TrendingUp, 
  Heart,
  Zap,
  Activity,
  Terminal,
  Skull
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Ending {
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

const ALL_ENDINGS: Ending[] = [
  {
    id: 'unicorn',
    title: 'THE UNICORN EXIT',
    description: 'Survive to 2035 with a budget > $3M or ROI > 150%.',
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
    description: 'Survive to 2035 with a budget > $1.5M or ROI > 100%.',
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
    description: 'Survive in Technology sector with an ROI > 200%.',
    badge: '🤖 AI SINGULARITY',
    unlockedMsg: 'Your automation routines achieved self-awareness. Humans are now corporate relics.',
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

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="cyber-glass cyber-border-cyan p-3 rounded-lg text-[10px] font-orbitron text-white space-y-1">
        <p className="text-slate-500 font-bold border-b border-slate-800 pb-1 mb-1">// YEAR: {label}</p>
        <p className="text-cyan-400 font-black">ROI: +{payload[0].value}%</p>
        <p className="text-yellow-400 font-black">BUDGET: ${payload[1].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export const Outcome = () => {
  const state = useGameStore((s) => s.state);
  const company = useGameStore((s) => s.company);
  const actions = useGameStore((s) => s.actions);

  const isVictory = state.gameResult === 'victory';

  // State for animations
  const [valTicker, setValTicker] = useState(0);
  const [typedText, setTypedText] = useState('');

  // Determine achieved ending
  const getAchievedEndingId = (): string => {
    if (state.gameResult === 'victory') {
      if (company?.industry?.toLowerCase() === 'technology' && state.roi > 200) {
        return 'rogue_ai';
      }
      if (company?.startingBudget === 100000) {
        return 'bootstrap_legend';
      }
      if (state.budget > 3000000 || state.roi > 150) {
        return 'unicorn';
      }
      if (state.employees >= 30 && state.budget >= 2000000) {
        return 'ipo';
      }
      if (state.budget > 1500000 || state.roi > 100) {
        return 'acquisition';
      }
      return 'lifestyle';
    } else {
      if (state.roi > 50 || state.morale > 80) {
        return 'talent_acquired';
      }
      return 'crash_burn';
    }
  };

  const achievedEndingId = getAchievedEndingId();
  const achievedEnding = ALL_ENDINGS.find(e => e.id === achievedEndingId) || ALL_ENDINGS[7];

  // Calculate corporate valuation metric
  const calculateValuation = () => {
    if (state.gameResult === 'victory') {
      return state.budget * 1.8 + (state.employees * 125000) * (1 + (state.roi / 100));
    }
    return 0;
  };
  const valuation = calculateValuation();

  // 1. Count-up Valuation Ticker animation
  useEffect(() => {
    if (!state.isGameOver || valuation <= 0) {
      setValTicker(0);
      return;
    }
    let start = 0;
    const end = valuation;
    const duration = 2500; // 2.5 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setValTicker(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [state.isGameOver, valuation]);

  // 2. Terminal Typewriter effect
  useEffect(() => {
    if (!state.isGameOver) return;
    const fullText = achievedEnding.unlockedMsg;
    let index = 0;
    setTypedText('');
    
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 20); // Type one character every 20ms
    
    return () => clearInterval(interval);
  }, [state.isGameOver, achievedEnding.unlockedMsg]);

  if (!state.isGameOver) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#060814] text-white font-orbitron">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 text-rose-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">DATA FLUX: SIMULATION IN PROGRESS</p>
          <Link to="/engine">
            <Button className="mt-4 text-xs">Return to Console</Button>
          </Link>
        </div>
      </div>
    );
  }

  const chartData = state.history.map((entry) => ({
    year: entry.year,
    roi: entry.roi,
    budget: entry.budget,
  }));

  const handleRestart = () => {
    actions.resetGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden py-12 px-6">
      
      {/* INJECTED CUSTOM IN-FILE ANIMATIONS & SMOOTH TRANSITIONS */}
      <style>{`
        /* Staggered entrance animations */
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-50  { animation-delay: 50ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Ambient panning cybergrid background */
        @keyframes grid-pan {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
        .animated-grid-bg {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(6, 182, 212, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-pan 12s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        /* Screen scanning overlay sweep */
        @keyframes scanline-sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 140px;
          background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.07), transparent);
          animation: scanline-sweep 6s linear infinite;
          pointer-events: none;
          z-index: 999;
        }

        /* Card Shimmer / Glint Reflection Effect */
        .shimmer-card {
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease;
        }
        .shimmer-card::after {
          content: '';
          position: absolute;
          top: 0; left: -150%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), rgba(6, 182, 212, 0.08), transparent);
          transform: skewX(-25deg);
          transition: none;
          pointer-events: none;
        }
        .shimmer-card:hover {
          transform: translateY(-4px) scale(1.01);
        }
        .shimmer-card:hover::after {
          left: 150%;
          transition: all 1.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Custom pulsing glows */
        @keyframes pulse-cyan-shadow {
          0%, 100% { box-shadow: 0 0 10px rgba(6, 182, 212, 0.15); }
          50% { box-shadow: 0 0 25px rgba(6, 182, 212, 0.4); }
        }
        @keyframes pulse-gold-shadow {
          0%, 100% { box-shadow: 0 0 12px rgba(234, 179, 8, 0.15); }
          50% { box-shadow: 0 0 30px rgba(234, 179, 8, 0.45); }
        }
        @keyframes error-red-flash {
          0%, 100% { border-color: rgba(244, 63, 94, 0.4); box-shadow: 0 0 12px rgba(244, 63, 94, 0.1); }
          50% { border-color: rgba(244, 63, 94, 0.85); box-shadow: 0 0 25px rgba(244, 63, 94, 0.35); }
        }

        /* Staggered Matrix Text Entry */
        .neon-glitch-text {
          text-shadow: 0 0 5px rgba(255,255,255,0.7), 0 0 10px rgba(6,182,212,0.6);
          transition: text-shadow 0.3s ease;
        }
        .shimmer-card:hover .neon-glitch-text {
          text-shadow: 0 0 8px rgba(255,255,255,0.9), 0 0 18px rgba(6,182,212,0.95), 0 0 30px rgba(168,85,247,0.7);
        }
      `}</style>

      {/* Cyber Grid/Sweep Overlay */}
      <div className="scanline-bar" />
      <div className="animated-grid-bg" />

      {/* Massive diagonal background watermark (smooth scale-in entrance) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
        <span className="font-orbitron font-black text-[12vw] tracking-[3vw] text-slate-900/10 uppercase -rotate-12 whitespace-nowrap transition-transform duration-1000 scale-[0.9] animate-[fadeInUp_1.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          {isVictory ? "SYSTEM // SECURED" : "SYS // TERMINATED"}
        </span>
      </div>

      <div className="container max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER: TERMINAL STATUS HUD */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-900 pb-5 gap-4 animate-fade-in-up delay-50">
          <div className="flex items-center space-x-3">
            <Terminal className="h-6 w-6 text-cyan-400 animate-pulse" />
            <span className="font-orbitron text-sm font-black tracking-widest text-cyan-400 text-glow-cyan">
              // ARCHIVE MEMORY MODULE LOADED // SECURE_LOG.BIN
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/40 px-3 py-1.5 rounded border border-slate-800">
            <span className={cn(
              "h-2.5 w-2.5 rounded-full animate-ping",
              isVictory ? "bg-yellow-400" : "bg-rose-500"
            )} />
            <span className={cn(
              "font-orbitron text-[10px] font-black uppercase tracking-wider",
              isVictory ? "text-yellow-400 text-glow-gold" : "text-rose-500 text-glow-magenta"
            )}>
              {isVictory ? "SIMULATION COMPLETE" : "SYSTEM FAILURE DIAGNOSIS"}
            </span>
          </div>
        </div>

        {/* TOP PANEL: COOPERATIVE HIGHLIGHT PANEL */}
        <div className={cn(
          "shimmer-card p-8 rounded-xl border relative flex flex-col md:flex-row justify-between items-center gap-8 group animate-fade-in-up delay-100",
          isVictory 
            ? "border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.15)] animate-[pulse-gold-shadow_3s_infinite_alternate]" 
            : "border-rose-500/50 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-[error-red-flash_2.5s_infinite_alternate]"
        )}>
          {/* Internal gradient ray */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.06),transparent_50%)] pointer-events-none" />
          
          <div className="space-y-4 text-center md:text-left relative z-10 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="font-orbitron text-[10px] font-black tracking-widest text-slate-300 bg-slate-950 px-3.5 py-1 rounded border border-slate-800/80 flex items-center gap-1.5 uppercase transition-colors group-hover:border-slate-700">
                <Trophy className={cn("h-3.5 w-3.5", achievedEnding.textColor)} />
                {achievedEnding.badge}
              </span>
              {!isVictory && (
                <span className="font-orbitron text-[10px] font-black tracking-widest text-rose-400 bg-rose-500/5 px-3.5 py-1 rounded border border-rose-500/20 uppercase animate-pulse">
                  CRITICAL SHUTDOWN
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-orbitron tracking-wider text-slate-100 neon-glitch-text">
              {achievedEnding.title}
            </h1>
            
            {/* Live typewriter output prompt */}
            <div className="min-h-[40px] bg-slate-950/80 p-4 rounded border border-slate-900 font-mono text-xs text-slate-400 leading-relaxed text-left flex items-start gap-2 group-hover:border-slate-800 transition-colors">
              <span className="text-cyan-400 animate-pulse flex-shrink-0">&gt;_</span>
              <span>
                {typedText}
                <span className="h-4 w-2 bg-slate-300 inline-block animate-pulse ml-0.5" />
              </span>
            </div>
          </div>

          {/* VALUATION CONSOLE */}
          <div className="text-center md:text-right font-orbitron bg-slate-950/90 p-6 rounded-lg border border-slate-850 shadow-[0_0_25px_rgba(0,0,0,0.6)] min-w-[280px] relative overflow-hidden group/val hover:border-slate-700 transition-colors duration-300">
            <div className="absolute -right-12 -top-12 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block transition-colors group-hover/val:text-slate-300">
              {isVictory ? "CAPITAL LIQUIDATION RATE" : "REMAINING SCRAP VALUE"}
            </span>
            
            <span className="text-4xl font-black block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-orange-400 tracking-wider transition-transform duration-300 group-hover/val:scale-105">
              {valuation > 0 ? `$${valTicker.toLocaleString()}` : "$0.00"}
            </span>

            <span className="text-[8px] text-slate-500 block mt-2 tracking-widest border-t border-slate-900 pt-2 uppercase">
              {valuation > 0 ? "LEDGER CONVERTED VALUE" : "CHAPTER 11 CORP TERMINATION"}
            </span>
          </div>
        </div>

        {/* VITALS & TRAJECTORY SPLIT PANEL */}
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Core Vitals Card */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-up delay-200">
            <Card className="shimmer-card cyber-glass border-slate-900/90 hover:border-slate-850 bg-slate-900/10 hover:bg-slate-900/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all h-full flex flex-col justify-between overflow-hidden">
              <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <CardHeader className="border-b border-slate-900/80 pb-3">
                <CardTitle className="font-orbitron text-xs font-black text-cyan-400 tracking-widest flex items-center justify-between">
                  <span>// OPERATIONS METRIC LOG_</span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-around">
                
                {/* Reserves */}
                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3 hover:translate-x-1 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.1)]">
                      <Coins className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-orbitron uppercase tracking-wider">NET RESERVES</p>
                      <p className="text-lg font-black font-orbitron text-slate-100">
                        ${state.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ROI */}
                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3 hover:translate-x-1 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.1)]">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-orbitron uppercase tracking-wider">CUMULATIVE ROI</p>
                      <p className="text-lg font-black font-orbitron text-cyan-400">
                        {state.roi}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Employees */}
                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3 hover:translate-x-1 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.1)]">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-orbitron uppercase tracking-wider">WORKFORCE CAPACITY</p>
                      <p className="text-lg font-black font-orbitron text-purple-400">
                        {state.employees} Staff
                      </p>
                    </div>
                  </div>
                </div>

                {/* Morale */}
                <div className="flex items-center justify-between hover:translate-x-1 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]">
                      <Heart className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-orbitron uppercase tracking-wider">VITALITY MORALE</p>
                      <p className="text-lg font-black font-orbitron text-pink-400">
                        {state.morale}%
                      </p>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Trajectory telemetry graph */}
          <div className="lg:col-span-3 animate-fade-in-up delay-300">
            <Card className="shimmer-card cyber-glass border-slate-900/95 hover:border-slate-855 bg-slate-900/10 hover:bg-slate-900/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all">
              <CardHeader className="border-b border-slate-900 pb-3">
                <CardTitle className="font-orbitron text-xs font-black text-cyan-400 tracking-widest flex items-center justify-between">
                  <span>// TRAJECTORY TELEMETRY DIAGNOSTICS //</span>
                  <span className="text-[8px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-500 font-mono">LIVE_PLOT.TSX</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <div style={{ width: '100%', height: 250 }} className="relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent_60%)] pointer-events-none" />
                  
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#06b6d4" floodOpacity="0.85" />
                          </filter>
                          <filter id="glow-yellow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#eab308" floodOpacity="0.85" />
                          </filter>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#12172a" vertical={false} />
                        <XAxis 
                          dataKey="year" 
                          stroke="#475569" 
                          tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }}
                          tickLine={{ stroke: '#1e293b' }}
                        />
                        <YAxis 
                          stroke="#475569"
                          tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }}
                          tickLine={{ stroke: '#1e293b' }}
                        />
                        <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#1e293b', strokeWidth: 1 }} />
                        
                        <Line 
                          type="monotone" 
                          dataKey="roi" 
                          stroke="#06b6d4" 
                          strokeWidth={3.5}
                          dot={{ fill: "#06b6d4", stroke: "#040610", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: "#fff" }}
                          filter="url(#glow-cyan)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="budget" 
                          stroke="#eab308" 
                          strokeWidth={2.5}
                          dot={{ fill: "#eab308", stroke: "#040610", strokeWidth: 1.5, r: 4 }}
                          activeDot={{ r: 6, fill: "#fff" }}
                          filter="url(#glow-yellow)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-slate-500 font-orbitron">
                      NO HISTORICAL TELEMETRY GENERATED
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* BOTTOM: STAGGERED MATRIX LOGS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-3 gap-2 animate-fade-in-up delay-400">
            <h2 className="font-orbitron font-black text-sm tracking-widest text-slate-300 uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              // OUTCOME ARCHIVAL MATRIX // PROTOCOLS INDEXED
            </h2>
            <span className="text-[10px] font-orbitron text-slate-500 font-bold bg-slate-950 px-2 py-0.5 border border-slate-800 rounded">
              COMPILATION STABLE // {ALL_ENDINGS.filter(e => e.id === achievedEndingId).length}/8 UNLOCKED
            </span>
          </div>

          {/* Outcome Grid Badges (Staggered Entrance Animation) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_ENDINGS.map((ending, index) => {
              const isUnlocked = ending.id === achievedEndingId;
              const EndingIcon = ending.icon;

              return (
                <div 
                  key={ending.id}
                  style={{ animationDelay: `${(index * 100) + 400}ms` }}
                  className={cn(
                    "animate-fade-in-up shimmer-card p-5 rounded-xl border flex flex-col justify-between min-h-[170px] group cursor-default",
                    isUnlocked 
                      ? `${ending.glowClass} ${ending.hoverGlowClass} scale-[1.02] ring-2 ring-cyan-500/15` 
                      : "border-slate-900 bg-slate-950/40 opacity-40 hover:opacity-75 hover:border-slate-800/80 hover:bg-slate-950/60"
                  )}
                >
                  {/* Floating lock/unlock badge icons */}
                  <div className="absolute top-4 right-4 transition-transform duration-300 group-hover:scale-110">
                    {isUnlocked ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-sm animate-ping" />
                        <Unlock className={cn("h-4 w-4 relative z-10", ending.textColor)} />
                      </div>
                    ) : (
                      <Lock className="h-4 w-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
                    )}
                  </div>

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center space-x-2">
                      <EndingIcon className={cn("h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-12", isUnlocked ? ending.textColor : "text-slate-600")} />
                      <span className={cn(
                        "text-[9px] font-orbitron font-black border px-2 py-0.5 rounded tracking-wide transition-colors", 
                        isUnlocked 
                          ? `${ending.textColor} border-slate-800/80 group-hover:border-slate-700` 
                          : "text-slate-600 border-slate-900/80"
                      )}>
                        {ending.badge}
                      </span>
                    </div>

                    <h3 className={cn(
                      "font-orbitron font-black text-xs tracking-wider transition-colors", 
                      isUnlocked ? "text-slate-100" : "text-slate-600 group-hover:text-slate-400"
                    )}>
                      {ending.title}
                    </h3>
                    
                    <p className="text-[10px] text-slate-400 font-space leading-relaxed transition-colors group-hover:text-slate-300">
                      {isUnlocked ? ending.unlockedMsg : ending.description}
                    </p>
                  </div>

                  {isUnlocked && (
                    <div className={cn(
                      "text-[8px] font-orbitron font-black text-right tracking-widest mt-3 uppercase animate-pulse", 
                      ending.textColor
                    )}>
                      [ LOG UNLOCKED ]
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM REDIRECT PROTOCOL ACTIONS */}
        <div className="flex justify-center pt-6 border-t border-slate-900 animate-fade-in-up delay-600">
          <Link to="/">
            <Button 
              size="lg" 
              onClick={handleRestart}
              className="py-6 px-10 font-orbitron font-black text-xs tracking-widest bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <ArrowLeft className="mr-2.5 h-4.5 w-4.5" />
              TERMINATE TERMINAL // INITIALIZE NEW DECK
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Outcome;
