import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Database, LineChart, Target, Server, Cpu, Activity, ShieldAlert,
  BarChart, Network, ChevronRight, Terminal, Gauge, Layers
} from 'lucide-react';

// HUD corner brackets for that command-console framing
const Corners = ({ color = 'rgba(34,211,238,0.5)' }: { color?: string }) => (
  <>
    <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-md" style={{ borderColor: color }} />
    <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-md" style={{ borderColor: color }} />
    <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-md" style={{ borderColor: color }} />
    <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-md" style={{ borderColor: color }} />
  </>
);

const FloatingIcons = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[14%] left-[8%] opacity-[0.05] animate-[bounce_10s_infinite]"><BrainCircuit className="w-24 h-24 text-cyan-400" /></div>
    <div className="absolute top-[20%] right-[11%] opacity-[0.05] animate-[pulse_8s_infinite]"><Database className="w-32 h-32 text-indigo-400" /></div>
    <div className="absolute bottom-[26%] left-[14%] opacity-[0.05] animate-[spin_24s_infinite_linear]"><Cpu className="w-20 h-20 text-purple-400" /></div>
    <div className="absolute bottom-[34%] right-[8%] opacity-[0.05] animate-[bounce_12s_infinite]"><Network className="w-28 h-28 text-emerald-400" /></div>
    <div className="absolute top-[58%] left-[24%] opacity-[0.04] animate-[bounce_14s_infinite]"><BarChart className="w-16 h-16 text-yellow-400" /></div>
    <div className="absolute top-[68%] right-[28%] opacity-[0.05] animate-[spin_28s_infinite_linear]"><ShieldAlert className="w-24 h-24 text-slate-400" /></div>
  </div>
);

// Cyberpunk perspective grid floor (the game-board horizon)
const GridFloor = () => (
  <div className="absolute bottom-0 inset-x-0 h-[42vh] z-0 pointer-events-none overflow-hidden" style={{ perspective: '320px' }}>
    <div
      className="absolute inset-x-[-50%] bottom-0 h-[200%] origin-bottom"
      style={{
        transform: 'rotateX(74deg)',
        backgroundImage:
          'linear-gradient(rgba(6,182,212,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.45) 1px, transparent 1px)',
        backgroundSize: '46px 46px',
        maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 75%)',
        WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 75%)',
        animation: 'grid-pan 6s linear infinite',
      }}
    />
    <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#040610] to-transparent" />
  </div>
);

const FEATURES = [
  { icon: Target, color: 'text-cyan-400', glow: 'rgba(6,182,212,0.35)', code: 'MOD.01', title: 'Simulate Strategy', body: 'Allocate quarterly budget across AI infrastructure, upskilling, and enterprise integrations.' },
  { icon: Cpu, color: 'text-indigo-400', glow: 'rgba(99,102,241,0.35)', code: 'MOD.02', title: 'Dynamic Decisions', body: 'Build your tech stack with real-world AI plays, from basic RPA to autonomous agent swarms.' },
  { icon: Database, color: 'text-rose-400', glow: 'rgba(244,63,94,0.35)', code: 'MOD.03', title: 'Immutable Ledger', body: 'Every prediction and decision is logged to a local SQLite ledger for historical analysis.' },
];

// Live telemetry shown in the inference panel — values drift slightly to feel "alive".
const TELEMETRY = [
  { key: 'REVENUE', dot: 'bg-emerald-400', bar: 'from-emerald-500 to-emerald-300', base: 78 },
  { key: 'PRODUCTIVITY', dot: 'bg-purple-400', bar: 'from-purple-500 to-purple-300', base: 64 },
  { key: 'RISK', dot: 'bg-rose-400', bar: 'from-rose-500 to-rose-300', base: 41 },
];

const BOOT_LOG = [
  '> initializing inference core ........ OK',
  '> loading revenue_model.joblib ....... OK',
  '> binding FastAPI :: XGBoost 3.x ..... OK',
  '> board uplink established ........... READY',
];

const TITLE = 'THE LAST CEO';

export const Landing = () => {
  const navigate = useNavigate();
  const [vals, setVals] = useState(TELEMETRY.map((t) => t.base));
  const [logCount, setLogCount] = useState(0);
  const [uptime, setUptime] = useState(0);
  const [typed, setTyped] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const startedAt = useRef(Date.now());

  // Drift telemetry values + tick uptime clock for the live-system feel.
  useEffect(() => {
    const id = setInterval(() => {
      setVals((prev) => prev.map((v, i) => {
        const next = v + (Math.random() - 0.5) * 6;
        return Math.max(20, Math.min(96, Math.round(next * 10) / 10 || TELEMETRY[i].base));
      }));
      setUptime(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 1400);
    return () => clearInterval(id);
  }, []);

  // Type out the title, then reveal the boot log line by line.
  useEffect(() => {
    if (typed >= TITLE.length) return;
    const id = setTimeout(() => setTyped((c) => c + 1), 90);
    return () => clearTimeout(id);
  }, [typed]);

  useEffect(() => {
    if (typed < TITLE.length || logCount >= BOOT_LOG.length) return;
    const id = setTimeout(() => setLogCount((c) => c + 1), 350 + logCount * 220);
    return () => clearTimeout(id);
  }, [logCount, typed]);

  // Subtle mouse parallax on the whole console.
  const onMouseMove = (e: React.MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    setTilt({ x: x * 4, y: y * 4 });
  };

  const clock = `${String(Math.floor(uptime / 60)).padStart(2, '0')}:${String(uptime % 60).padStart(2, '0')}`;
  const titleDone = typed >= TITLE.length;

  return (
    <div
      className="min-h-screen flex items-center justify-center relative p-6 md:p-8 bg-[#040610] overflow-hidden scanlines"
      onMouseMove={onMouseMove}
    >
      {/* Cinematic city backdrop (matches the boardroom screens) */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.18]"
        style={{ backgroundImage: "url('/cyberpunk_city.png')" }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
        style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)', backgroundSize: '34px 34px' }}
      />
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 26%, rgba(6,182,212,0.14), transparent 55%)' }} />
      <GridFloor />
      <FloatingIcons />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040610] via-[#040610]/40 to-[#040610] z-0" />

      {/* Top HUD status strip */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 md:px-8 py-3 text-[10px] font-mono tracking-[0.25em] uppercase border-b border-slate-800/60 bg-slate-950/30 backdrop-blur-sm">
        <span className="text-slate-500">The Last CEO <span className="text-slate-700">//</span> Enterprise Edition</span>
        <span className="hidden md:flex items-center gap-2 text-cyan-400/70">
          <Gauge className="w-3 h-3" /> Uptime {clock}
        </span>
        <span className="flex items-center gap-2 text-emerald-400/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse" />
          System Online <span className="text-slate-700">//</span> v2.0
        </span>
      </div>

      <div
        className="max-w-5xl w-full z-10 space-y-8 my-16 transition-transform duration-300 ease-out"
        style={{ transform: `translate(${tilt.x}px, ${tilt.y}px)` }}
      >
        {/* Hero */}
        <div className="space-y-5 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          {/* Holographic core: rotating rings around the brain (matches Home's holo-core) */}
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-1">
            <span className="absolute inset-0 rounded-full border border-cyan-500/20 animate-[spin_16s_linear_infinite]" />
            <span className="absolute inset-2 rounded-full border border-indigo-500/20 animate-[spin_10s_linear_infinite_reverse]" />
            <span className="absolute inset-4 rounded-full border-t-2 border-cyan-400/40 animate-[spin_4s_linear_infinite]" />
            <span className="absolute inset-0 rounded-full blur-2xl bg-cyan-500/15" />
            <div className="relative p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-110 transition-transform duration-500">
              <BrainCircuit className="w-12 h-12 text-cyan-300" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-[10px] font-mono uppercase tracking-[0.4em] text-cyan-400/60">
            <span className="h-px w-8 bg-cyan-500/30" /> AI Strategy Simulator <span className="h-px w-8 bg-cyan-500/30" />
          </div>

          {/* Typed title with blinking cursor */}
          <h1 className="text-5xl md:text-7xl font-space font-black tracking-tighter text-white uppercase text-glow-cyan min-h-[1.1em]">
            {titleDone ? (
              <>The Last <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">CEO</span></>
            ) : (
              <span>{TITLE.slice(0, typed)}<span className="text-cyan-400 animate-pulse">_</span></span>
            )}
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-space leading-relaxed">
            Lead a company through the AI revolution and run real-time financial projections on a live <span className="text-cyan-400">XGBoost</span> predictive engine. Every directive reshapes your trajectory to 2035.
          </p>
        </div>

        {/* Live inference engine HUD panel with animated telemetry */}
        <div className="relative cyber-glass cyber-border-cyan rounded-2xl p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-both">
          <Corners />
          <div className="cyber-sweep-overlay opacity-30" />
          <div className="relative z-10 grid md:grid-cols-[1.1fr,1fr] gap-6 items-center">
            {/* Boot log */}
            <div className="space-y-3">
              <h3 className="font-space font-bold text-cyan-400 text-xs tracking-[0.25em] uppercase flex items-center gap-2 text-glow-cyan">
                <Server className="w-4 h-4" /> Live Inference Engine
              </h3>
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 font-mono text-[11px] leading-relaxed min-h-[104px]">
                {BOOT_LOG.slice(0, logCount).map((line, i) => (
                  <div key={i} className="text-slate-400 animate-in fade-in slide-in-from-left-2 duration-300">
                    {line.replace(/(OK|READY)$/, '')}
                    <span className="text-emerald-400">{(line.match(/(OK|READY)$/) || [''])[0]}</span>
                  </div>
                ))}
                {logCount >= BOOT_LOG.length && <div className="text-cyan-400/80 typing-cursor">_</div>}
              </div>
            </div>

            {/* Telemetry bars */}
            <div className="space-y-3">
              {TELEMETRY.map((t, i) => (
                <div key={t.key} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className={`h-2 w-2 rounded-full ${t.dot} animate-pulse`} /> {t.key}
                    </span>
                    <span className="text-slate-400 tabular-nums">{vals[i].toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${t.bar} transition-[width] duration-1000 ease-out`}
                      style={{ width: `${vals[i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 hover:-translate-y-1.5 hover:border-slate-600/80 transition-all duration-500 cursor-default overflow-hidden"
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: f.glow }} />
              <Corners color="rgba(148,163,184,0.25)" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <f.icon className={`w-6 h-6 ${f.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`} />
                  <span className="text-[10px] font-mono text-slate-600 tracking-widest">{f.code}</span>
                </div>
                <h3 className="text-md font-space font-bold text-white mb-2 tracking-wide">{f.title}</h3>
                <p className="text-xs text-slate-400 font-space leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 pt-2 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <button
            onClick={() => navigate('/enter')}
            className="group relative px-10 py-5 font-space font-black text-sm tracking-[0.25em] uppercase text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_rgba(6,182,212,0.85)] hover:scale-105 transition-all duration-300 flex items-center gap-3 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Terminal className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Enter Simulation Environment</span>
            <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-[10px] font-mono text-slate-600 tracking-[0.3em] uppercase flex items-center gap-2">
            <Layers className="w-3 h-3" /> XGBoost Inference Core
            <span className="text-slate-700">//</span>
            <LineChart className="w-3 h-3" /> Survive to 2035
            <span className="text-slate-700">//</span>
            <Activity className="w-3 h-3" /> {clock}
          </p>
        </div>
      </div>
    </div>
  );
};
