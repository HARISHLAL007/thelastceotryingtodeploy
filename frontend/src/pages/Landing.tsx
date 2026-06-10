import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { BrainCircuit, Database, LineChart, Target, Server, Cpu, Activity, ShieldAlert, BarChart, Network } from 'lucide-react';

const FloatingIcons = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute top-[15%] left-[10%] opacity-[0.03] animate-[bounce_10s_infinite]"><BrainCircuit className="w-24 h-24 text-cyan-400" /></div>
      <div className="absolute top-[25%] right-[15%] opacity-[0.03] animate-[pulse_8s_infinite]"><Database className="w-32 h-32 text-indigo-400" /></div>
      <div className="absolute bottom-[20%] left-[20%] opacity-[0.03] animate-[spin_20s_infinite_linear]"><Cpu className="w-20 h-20 text-purple-400" /></div>
      <div className="absolute bottom-[30%] right-[10%] opacity-[0.03] animate-[bounce_12s_infinite]"><Network className="w-28 h-28 text-emerald-400" /></div>
      <div className="absolute top-[45%] left-[45%] opacity-[0.03] animate-[pulse_15s_infinite]"><Activity className="w-40 h-40 text-rose-400" /></div>
      <div className="absolute top-[65%] left-[25%] opacity-[0.03] animate-[bounce_14s_infinite]"><BarChart className="w-16 h-16 text-yellow-400" /></div>
      <div className="absolute top-[75%] right-[35%] opacity-[0.03] animate-[spin_25s_infinite_linear]"><ShieldAlert className="w-24 h-24 text-slate-400" /></div>
    </div>
  );
};

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative p-8 bg-[#040610] overflow-hidden">
      <FloatingIcons />
      
      {/* Background overlay to ensure text is readable */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-0"></div>
      
      <div className="max-w-5xl w-full z-10 space-y-12 my-12">
        <div className="space-y-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center justify-center p-4 bg-cyan-500/10 rounded-3xl border border-cyan-500/20 mb-2 hover:scale-110 transition-transform duration-500">
            <BrainCircuit className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-space font-black tracking-tighter text-white drop-shadow-2xl uppercase">
            The Last <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">CEO</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-space font-medium leading-relaxed">
            Enterprise AI Strategy Simulator. Run real-time financial projections using our XGBoost Predictive Engine.
          </p>
        </div>

        {/* Model Specs Section */}
        <div className="bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.3)] transition-all duration-500 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 fill-mode-both">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="font-space font-bold text-cyan-400 text-sm tracking-widest uppercase flex items-center justify-center md:justify-start gap-2">
                <Server className="w-4 h-4" /> Live Inference Engine
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-space max-w-md">
                Powered by Python FastAPI and XGBoost. Predicts Revenue Impact, Productivity Gains, and Risk based on real corporate AI adoption datasets.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-300 font-space uppercase">Revenue</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/50 px-3 py-2 rounded-lg border border-slate-800">
                <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                <span className="text-[10px] text-slate-300 font-space uppercase">Productivity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400 fill-mode-both">
          <div className="p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 hover:-translate-y-2 hover:border-cyan-500/50 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.3)] transition-all duration-500 cursor-pointer group">
            <Target className="w-6 h-6 text-cyan-400 mb-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
            <h3 className="text-md font-space font-bold text-white mb-2">Simulate Strategy</h3>
            <p className="text-xs text-slate-400 font-space">
              Allocate quarterly budget to AI infrastructure, upskilling, and enterprise integrations.
            </p>
          </div>
          <div className="p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 hover:-translate-y-2 hover:border-indigo-500/50 hover:shadow-[0_10px_40px_-10px_rgba(99,102,241,0.3)] transition-all duration-500 cursor-pointer group">
            <Cpu className="w-6 h-6 text-indigo-400 mb-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
            <h3 className="text-md font-space font-bold text-white mb-2">Dynamic Decisions</h3>
            <p className="text-xs text-slate-400 font-space">
              Flesh out your tech stack with real-world AI strategies, from basic RPA to autonomous agent swarms.
            </p>
          </div>
          <div className="p-6 bg-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-800/80 hover:-translate-y-2 hover:border-rose-500/50 hover:shadow-[0_10px_40px_-10px_rgba(244,63,94,0.3)] transition-all duration-500 cursor-pointer group">
            <Database className="w-6 h-6 text-rose-400 mb-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
            <h3 className="text-md font-space font-bold text-white mb-2">Immutable Database</h3>
            <p className="text-xs text-slate-400 font-space">
              All predictions and decisions are logged persistently to a local SQLite database for historical analysis.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
          <Button 
            onClick={() => navigate('/enter')}
            className="px-10 py-7 text-sm font-space font-black tracking-widest bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_40px_rgba(6,182,212,0.8)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 rounded-xl"
          >
            ENTER SIMULATION ENVIRONMENT
          </Button>
        </div>
      </div>
    </div>
  );
};
