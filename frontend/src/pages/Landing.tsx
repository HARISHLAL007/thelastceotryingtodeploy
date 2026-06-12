import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit, Database, LineChart, Target, Server, Cpu, Activity, ShieldAlert,
  BarChart, Network, ChevronRight, Terminal
} from 'lucide-react';

const FloatingIcons = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-[15%] left-[10%] opacity-[0.04] animate-[bounce_10s_infinite]"><BrainCircuit className="w-24 h-24 text-cyan-400" /></div>
    <div className="absolute top-[25%] right-[15%] opacity-[0.04] animate-[pulse_8s_infinite]"><Database className="w-32 h-32 text-indigo-400" /></div>
    <div className="absolute bottom-[20%] left-[20%] opacity-[0.04] animate-[spin_20s_infinite_linear]"><Cpu className="w-20 h-20 text-purple-400" /></div>
    <div className="absolute bottom-[30%] right-[10%] opacity-[0.04] animate-[bounce_12s_infinite]"><Network className="w-28 h-28 text-emerald-400" /></div>
    <div className="absolute top-[45%] left-[45%] opacity-[0.03] animate-[pulse_15s_infinite]"><Activity className="w-40 h-40 text-rose-400" /></div>
    <div className="absolute top-[65%] left-[25%] opacity-[0.04] animate-[bounce_14s_infinite]"><BarChart className="w-16 h-16 text-yellow-400" /></div>
    <div className="absolute top-[75%] right-[35%] opacity-[0.04] animate-[spin_25s_infinite_linear]"><ShieldAlert className="w-24 h-24 text-slate-400" /></div>
  </div>
);

// HUD corner brackets for that command-console framing
const Corners = ({ color = 'rgba(34,211,238,0.5)' }: { color?: string }) => (
  <>
    <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 rounded-tl-md" style={{ borderColor: color }} />
    <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 rounded-tr-md" style={{ borderColor: color }} />
    <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 rounded-bl-md" style={{ borderColor: color }} />
    <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 rounded-br-md" style={{ borderColor: color }} />
  </>
);

const FEATURES = [
  { icon: Target, color: 'text-cyan-400', glow: 'rgba(6,182,212,0.35)', title: 'Simulate Strategy', body: 'Allocate quarterly budget across AI infrastructure, upskilling, and enterprise integrations.' },
  { icon: Cpu, color: 'text-indigo-400', glow: 'rgba(99,102,241,0.35)', title: 'Dynamic Decisions', body: 'Build your tech stack with real-world AI plays, from basic RPA to autonomous agent swarms.' },
  { icon: Database, color: 'text-rose-400', glow: 'rgba(244,63,94,0.35)', title: 'Immutable Database', body: 'Every prediction and decision is logged to a local SQLite ledger for historical analysis.' },
];

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 md:p-8 bg-[#040610] overflow-hidden scanlines">
      {/* Animated grid + glow + icons */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05] z-0"
        style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)', backgroundSize: '34px 34px' }}
      />
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(6,182,212,0.10), transparent 55%)' }} />
      <FloatingIcons />
      <div className="absolute inset-0 bg-gradient-to-t from-[#040610] via-transparent to-[#040610] z-0" />

      {/* Top HUD status strip */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-5 md:px-8 py-3 text-[10px] font-mono tracking-[0.25em] uppercase border-b border-slate-800/60">
        <span className="text-slate-500">The Last CEO <span className="text-slate-700">//</span> Enterprise Edition</span>
        <span className="flex items-center gap-2 text-emerald-400/80">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse" />
          System Online <span className="text-slate-700">//</span> v2.0
        </span>
      </div>

      <div className="max-w-5xl w-full z-10 space-y-10 my-16">
        {/* Hero */}
        <div className="space-y-5 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="relative inline-flex items-center justify-center p-5 mb-1">
            <Corners />
            <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.25)] hover:scale-110 transition-transform duration-500">
              <BrainCircuit className="w-12 h-12 text-cyan-300" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-space font-black tracking-tighter text-white uppercase text-glow-cyan">
            The Last <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400">CEO</span>
          </h1>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto font-space leading-relaxed">
            Enterprise AI Strategy Simulator. Lead a company through the AI revolution and run real-time financial projections on a live <span className="text-cyan-400">XGBoost</span> predictive engine.
          </p>
        </div>

        {/* Live inference engine HUD panel */}
        <div className="relative cyber-glass cyber-border-cyan rounded-2xl p-6 overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-both">
          <Corners />
          <div className="cyber-sweep-overlay opacity-30" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-space font-bold text-cyan-400 text-xs tracking-[0.25em] uppercase flex items-center justify-center md:justify-start gap-2 text-glow-cyan">
                <Server className="w-4 h-4" /> Live Inference Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-space max-w-md">
                Powered by Python FastAPI + XGBoost. Forecasts revenue impact, productivity gains, and risk from real corporate AI-adoption datasets.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {[
                { label: 'Revenue', dot: 'bg-emerald-400' },
                { label: 'Productivity', dot: 'bg-purple-400' },
                { label: 'Risk', dot: 'bg-rose-400' },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2 bg-slate-950/60 px-3 py-2 rounded-lg border border-slate-800">
                  <div className={`h-2 w-2 rounded-full ${s.dot} animate-pulse`} />
                  <span className="text-[10px] text-slate-300 font-mono uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-5 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 fill-mode-both">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 hover:-translate-y-1.5 transition-all duration-500 cursor-default overflow-hidden"
              style={{ boxShadow: 'none' }}
            >
              <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: f.glow }} />
              <Corners color="rgba(148,163,184,0.25)" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <f.icon className={`w-6 h-6 ${f.color} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`} />
                  <span className="text-[10px] font-mono text-slate-600 tracking-widest">0{i + 1}</span>
                </div>
                <h3 className="text-md font-space font-bold text-white mb-2 tracking-wide">{f.title}</h3>
                <p className="text-xs text-slate-400 font-space leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
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
            <LineChart className="w-3 h-3" /> XGBoost Inference Core <span className="text-slate-700">//</span> Survive to 2035
          </p>
        </div>
      </div>
    </div>
  );
};
