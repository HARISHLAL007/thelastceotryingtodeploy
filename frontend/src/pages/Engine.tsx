import { useGameStore } from '@/store/gameStore';

export const Engine = () => {
  const company = useGameStore((s) => s.company);

  if (!company) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#060814] text-white">
        <p className="text-muted-foreground font-orbitron">Please create a company first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060814] text-white flex flex-col items-center justify-center p-6 scanlines">
      <div className="cyber-glass cyber-border-cyan rounded-lg p-8 max-w-xl text-center space-y-6">
        <h1 className="text-3xl font-black font-orbitron tracking-wider text-cyan-400 text-glow-cyan animate-pulse">
          DASHBOARD INITIALIZED
        </h1>
        <p className="text-sm font-space text-slate-300">
          Simulation deck for <span className="font-bold text-white font-orbitron">{company.name.toUpperCase()}</span> loaded.
        </p>
        <div className="bg-slate-950 p-4 rounded border border-slate-900 font-mono text-xs text-slate-500">
          SYSTEM STATUS: CONSOLE HARDWARE ONLINE // SIMULATION COMPONENT LOOPS UNSTAGED
        </div>
      </div>
    </div>
  );
};

export default Engine;
