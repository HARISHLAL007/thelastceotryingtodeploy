import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useGameStore } from '@/store/gameStore';
import type { CompanyProfile } from '@/types';
import { Building2, Users, TrendingUp, Shield, HelpCircle, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Home = () => {
  const navigate = useNavigate();
  const actions = useGameStore((s) => s.actions);
  const [formData, setFormData] = useState<CompanyProfile>({
    name: '',
    industry: 'Technology',
    description: '',
    foundedYear: 2024,
    founderName: '',
    startingBudget: 1500000, // Default to Venture Backed
  });

  const fundingTiers = [
    {
      id: 'bootstrap',
      title: 'BOOTSTRAPPER',
      amount: 100000,
      difficulty: 'HARD MODE',
      difficultyColor: 'text-rose-400 border-rose-500/20 bg-rose-500/5',
      glowClass: 'cyber-border-magenta',
      desc: 'Minimal external funds. High operational pressure, low error margin.',
    },
    {
      id: 'seed',
      title: 'SEED_ROUND',
      amount: 500000,
      difficulty: 'MEDIUM MODE',
      difficultyColor: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5',
      glowClass: 'cyber-border-gold',
      desc: 'Balanced starting capital. Allows team creation and minor campaigns.',
    },
    {
      id: 'vc',
      title: 'VENTURE_BACKED',
      amount: 1500000,
      difficulty: 'NORMAL MODE',
      difficultyColor: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/5',
      glowClass: 'cyber-border-cyan',
      desc: 'Substantial starting credit runway. Higher targets, comfortable cash flow.',
    },
    {
      id: 'enterprise',
      title: 'ENTERPRISE_SCALE',
      amount: 5000000,
      difficulty: 'EASY PLAYGROUND',
      difficultyColor: 'text-purple-400 border-purple-500/20 bg-purple-500/5',
      glowClass: 'cyber-border-purple',
      desc: 'Ultimate resource pool. Focus entirely on ROI yields and long term expansion.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    actions.initializeGame(formData);
    navigate('/engine');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative scanlines">
      {/* Scanline and grid overlays */}
      <div className="cyber-sweep-overlay" />

      <div className="container py-12 px-6 mx-auto max-w-6xl relative z-10 space-y-12">
        {/* Title HUD */}
        <div className="text-center space-y-4">
          <span className="font-orbitron text-xs font-black tracking-widest text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-3 py-1 rounded-full text-glow-cyan">
            RPG BUSINESS SIMULATION V1.0
          </span>
          <h1 className="text-5xl font-black font-orbitron tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-rose-400">
            BUILD YOUR STARTUP TO 2035
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-space">
            Input founder profile metrics, choose starting capital tier, and make strategic operational choices quarterly. Lead your company to success or face liquidity bankruptcy.
          </p>
        </div>

        {/* Feature widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Building2, title: 'Define Sector', sub: 'Tech, Finance, or Health' },
            { icon: Coins, title: 'Choose Runway', sub: 'Bootstrap to VC scale' },
            { icon: TrendingUp, title: 'Maximize ROI', sub: 'Balance yield & morale' },
            { icon: Shield, title: 'Mitigate Threats', sub: 'Mitigate risk vectors' },
          ].map((feat, idx) => (
            <Card key={idx} className="cyber-glass border-slate-800/80">
              <CardContent className="p-4 text-center space-y-1">
                <feat.icon className="h-6 w-6 text-cyan-400 mx-auto" />
                <h3 className="font-orbitron font-bold text-xs tracking-wider">{feat.title}</h3>
                <p className="text-[10px] text-slate-500">{feat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Setup Config Panel */}
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-8">
          
          {/* Left: General Info Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="cyber-glass border-slate-800 shadow-xl h-full">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-orbitron font-black text-cyan-400 tracking-wider mb-2">// PROFILE PARAMETERS</h2>
                
                <div className="space-y-1.5">
                  <Label htmlFor="founderName" className="font-orbitron text-[10px] tracking-wider text-slate-400">FOUNDER NAME_</Label>
                  <Input
                    id="founderName"
                    value={formData.founderName}
                    onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                    placeholder="Enter founder name"
                    required
                    className="bg-slate-950 border-slate-800 text-white font-orbitron text-xs focus-visible:ring-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="companyName" className="font-orbitron text-[10px] tracking-wider text-slate-400">COMPANY NAME_</Label>
                  <Input
                    id="companyName"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter company name"
                    required
                    className="bg-slate-950 border-slate-800 text-white font-orbitron text-xs focus-visible:ring-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="industry" className="font-orbitron text-[10px] tracking-wider text-slate-400">INDUSTRY CLASS_</Label>
                  <select
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md bg-slate-950 border-slate-800 text-white font-orbitron text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="font-orbitron text-[10px] tracking-wider text-slate-400">MISSION DESCRIPTION_</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. AI-driven logistics platform"
                    required
                    className="bg-slate-950 border-slate-800 text-white text-xs focus-visible:ring-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="foundedYear" className="font-orbitron text-[10px] tracking-wider text-slate-400">FOUNDED YEAR_</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value) || 2024 })}
                    min="2020"
                    max="2024"
                    className="bg-slate-950 border-slate-800 text-white font-orbitron text-xs focus-visible:ring-cyan-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Funding Class Selection */}
          <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
            <Card className="cyber-glass border-slate-800 shadow-xl flex-1 mb-4">
              <CardContent className="p-6">
                <h2 className="text-sm font-orbitron font-black text-cyan-400 tracking-wider mb-4">// SELECT STARTING RUNWAY</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fundingTiers.map((tier) => {
                    const isSelected = formData.startingBudget === tier.amount;
                    return (
                      <div
                        key={tier.id}
                        onClick={() => setFormData({ ...formData, startingBudget: tier.amount })}
                        className={cn(
                          "cyber-glass p-4 rounded-xl cursor-pointer transition-all duration-200 border hover:scale-[1.015] relative overflow-hidden",
                          isSelected
                            ? "border-cyan-400 bg-slate-950/90 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-2 ring-cyan-500/30"
                            : cn("border-slate-800/60", tier.glowClass)
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={cn("text-[9px] font-orbitron font-bold border px-1.5 py-0.5 rounded", tier.difficultyColor)}>
                            {tier.difficulty}
                          </span>
                          <div className="flex items-center space-x-1.5 font-orbitron">
                            {isSelected && (
                              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                            )}
                            <span className={cn("text-xs font-bold transition-colors", isSelected ? "text-cyan-400 text-glow-cyan" : "text-yellow-400")}>
                              ${tier.amount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-orbitron font-black text-xs text-slate-100 tracking-wider mb-1">{tier.title}</h3>
                        <p className="text-[10px] text-slate-400 leading-normal">{tier.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full py-4 text-xs font-orbitron font-black tracking-widest bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
              INITIALIZE SIMULATION // START RUNWAY
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Home;
