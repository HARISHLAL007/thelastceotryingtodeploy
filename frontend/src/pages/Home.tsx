import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useGameStore } from '@/store/gameStore';
import type { CompanyProfile } from '@/types';
import { BrainCircuit } from 'lucide-react';
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
    startingBudget: 1500000,
    country: 'United States',
    aiAdoptionLevel: 3.5,
    aiInvestment: 500000,
    automationRate: 45.0,
    trainingHours: 120,
    aiMaturityScore: 75,
    deploymentCount: 10,
    founderClass: 'engineer'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white relative scanlines overflow-y-auto">
      <div className="cyber-sweep-overlay" />

      <div className="container py-12 px-6 mx-auto max-w-6xl relative z-10 space-y-12">
        <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="font-space text-xs font-bold tracking-widest text-cyan-400 bg-cyan-500/5 border border-cyan-500/20 px-3 py-1 rounded-full text-glow-cyan">
            AI STRATEGY SIMULATOR V2.0
          </span>
          <h1 className="text-5xl font-black font-space tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-rose-400">
            THE LAST CEO
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-space">
            Input founder profile metrics, set your baseline AI parameters, and choose a capital tier. Lead your company to success using XGBoost-powered predictive modeling.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
          
          {/* Left: General Info Inputs */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
            <Card className="cyber-glass border-slate-800 shadow-[0_0_30px_rgba(6,182,212,0.05)] flex-1 transition-all hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] hover:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-space font-bold text-cyan-400 tracking-wider mb-2">PROFILE PARAMETERS</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName" className="font-space text-[10px] tracking-wider text-slate-400">COMPANY NAME</Label>
                    <Input id="companyName" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="founderName" className="font-space text-[10px] tracking-wider text-slate-400">FOUNDER NAME</Label>
                    <Input id="founderName" value={formData.founderName} onChange={(e) => setFormData({ ...formData, founderName: e.target.value })} required className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="industry" className="font-space text-[10px] tracking-wider text-slate-400">INDUSTRY CLASS</Label>
                    <select id="industry" value={formData.industry} onChange={(e) => setFormData({ ...formData, industry: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-slate-950 border-slate-800 text-white font-space text-xs focus:ring-cyan-500">
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Education">Education</option>
                      <option value="Energy">Energy</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country" className="font-space text-[10px] tracking-wider text-slate-400">COUNTRY</Label>
                    <select id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-slate-950 border-slate-800 text-white font-space text-xs focus:ring-cyan-500">
                      <option value="United States">United States</option>
                      <option value="Germany">Germany</option>
                      <option value="China">China</option>
                      <option value="India">India</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Japan">Japan</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="font-space text-[10px] tracking-wider text-slate-400">MISSION DESCRIPTION</Label>
                    <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required className="bg-slate-950 border-slate-800 text-white text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="foundedYear" className="font-space text-[10px] tracking-wider text-slate-400">START YEAR</Label>
                    <Input id="foundedYear" type="number" value={formData.foundedYear} onChange={(e) => setFormData({ ...formData, foundedYear: parseInt(e.target.value) || 2026 })} className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                </div>
              </CardContent>
            </Card>


          </div>

          {/* Right: ML AI Parameters */}
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
            <Card className="cyber-glass border-slate-800 shadow-[0_0_30px_rgba(244,63,94,0.05)] flex-1 transition-all hover:shadow-[0_0_40px_rgba(244,63,94,0.1)] hover:border-slate-700">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-sm font-space font-bold text-rose-400 tracking-wider mb-2 flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4" /> ML INFERENCE PARAMETERS
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="aiInvestment" className="font-space text-[10px] tracking-wider text-slate-400">AI INVESTMENT (USD)</Label>
                    <Input id="aiInvestment" type="number" value={formData.aiInvestment} onChange={(e) => setFormData({ ...formData, aiInvestment: parseFloat(e.target.value) || 0 })} className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="aiMaturityScore" className="font-space text-[10px] tracking-wider text-slate-400">AI MATURITY SCORE (0-100)</Label>
                    <Input id="aiMaturityScore" type="number" value={formData.aiMaturityScore} onChange={(e) => setFormData({ ...formData, aiMaturityScore: parseFloat(e.target.value) || 0 })} className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="automationRate" className="font-space text-[10px] tracking-wider text-slate-400">AUTOMATION RATE (%)</Label>
                    <Input id="automationRate" type="number" value={formData.automationRate} onChange={(e) => setFormData({ ...formData, automationRate: parseFloat(e.target.value) || 0 })} className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="aiAdoptionLevel" className="font-space text-[10px] tracking-wider text-slate-400">AI ADOPTION LEVEL (0-5)</Label>
                    <Input id="aiAdoptionLevel" type="number" value={formData.aiAdoptionLevel} onChange={(e) => setFormData({ ...formData, aiAdoptionLevel: parseFloat(e.target.value) || 0 })} className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="trainingHours" className="font-space text-[10px] tracking-wider text-slate-400">TRAINING HOURS</Label>
                    <Input id="trainingHours" type="number" value={formData.trainingHours} onChange={(e) => setFormData({ ...formData, trainingHours: parseFloat(e.target.value) || 0 })} className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="deploymentCount" className="font-space text-[10px] tracking-wider text-slate-400">DEPLOYMENT COUNT</Label>
                    <Input id="deploymentCount" type="number" value={formData.deploymentCount} onChange={(e) => setFormData({ ...formData, deploymentCount: parseInt(e.target.value) || 0 })} className="bg-slate-950 border-slate-800 text-white font-space text-xs" />
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
            <Card className="cyber-glass border-slate-800 shadow-xl transition-all hover:border-slate-700">
              <CardContent className="p-6">
                <h2 className="text-sm font-space font-bold text-cyan-400 tracking-wider mb-4">SELECT STARTING RUNWAY</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {fundingTiers.map((tier) => {
                    const isSelected = formData.startingBudget === tier.amount;
                    return (
                      <div key={tier.id} onClick={() => setFormData({ ...formData, startingBudget: tier.amount })} className={cn("cyber-glass p-4 rounded-xl cursor-pointer transition-all border relative overflow-hidden", isSelected ? "border-cyan-400 bg-slate-950/90 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-2 ring-cyan-500/30" : cn("border-slate-800/60", tier.glowClass))}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={cn("text-[9px] font-space font-bold border px-1.5 py-0.5 rounded", tier.difficultyColor)}>{tier.difficulty.replace('_', ' ')}</span>
                          <span className={cn("text-xs font-bold transition-colors", isSelected ? "text-cyan-400" : "text-yellow-400")}>${tier.amount.toLocaleString()}</span>
                        </div>
                        <h3 className="font-space font-bold text-xs text-slate-100 tracking-wider mb-1">{tier.title.replace('_', ' ')}</h3>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            <Button type="submit" className="w-full py-4 text-xs font-space font-bold tracking-widest bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
              START SIMULATION
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
