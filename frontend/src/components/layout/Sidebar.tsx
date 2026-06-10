import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart3, Trophy, Database, Target, BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore } from '@/store/gameStore';

export const Sidebar = () => {
  const location = useLocation();
  const company = useGameStore((s) => s.company);

  const navItems = [
    { path: '/', icon: Home, label: 'Home Overview' },
    { path: '/enter', icon: Target, label: 'Corporate Game' },
    { path: '/engine', icon: BarChart3, label: 'Active Dashboard' },
    { path: '/outcome', icon: Trophy, label: 'Simulation Results' },
    { path: '/database', icon: Database, label: 'Prediction Database' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/50 flex flex-col z-50 shadow-2xl relative">
      <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
        <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
          <BrainCircuit className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="font-space font-bold text-sm text-slate-100 tracking-wider">THE LAST CEO</h1>
          <p className="text-[10px] font-space text-slate-500">Enterprise Edition</p>
        </div>
      </div>

      <div className="flex-1 py-6 px-4">
        <h2 className="px-2 mb-4 font-space font-semibold text-[10px] text-slate-500 uppercase tracking-widest">
          Navigation
        </h2>
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-space font-medium transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.05)]" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {company && (
        <div className="p-6 border-t border-slate-800/50 bg-slate-950/50">
          <h2 className="mb-4 font-space font-semibold text-[10px] text-slate-500 uppercase tracking-widest">
            Active Profile
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/50">
              <span className="text-[10px] text-slate-400 font-space uppercase">Company</span>
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{company.name || 'Unnamed'}</span>
            </div>
            <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/50">
              <span className="text-[10px] text-slate-400 font-space uppercase">Industry</span>
              <span className="text-xs font-semibold text-cyan-400">{company.industry}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
