import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl z-10 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-800 text-sm font-medium text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
          <Zap className="w-4 h-4" />
          <span>Enterprise AI Strategy Advisor</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
          AI Investment Copilot
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Make data-driven AI investment decisions. Predict ROI, analyze risks, and get actionable strategy recommendations powered by advanced machine learning.
        </p>
        
        <div className="pt-8">
          <button 
            onClick={() => navigate('/form')}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Start Analysis
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <FeatureCard 
            icon={<TrendingUp className="w-6 h-6 text-blue-400" />}
            title="Predictive ROI"
            desc="Forecast cost savings and revenue impacts based on your industry and maturity."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
            title="Risk Assessment"
            desc="Evaluate implementation risks and readiness before committing budget."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-purple-400" />}
            title="AI Strategy Copilot"
            desc="Interactive LLM advisor to guide your digital transformation journey."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl backdrop-blur-sm hover:bg-slate-900 transition-colors">
    <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-100 mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default LandingPage;
