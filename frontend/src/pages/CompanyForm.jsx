import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, Globe2, Calendar, DollarSign, BrainCircuit, Cog, GraduationCap, Server, ArrowRight, Loader2 } from 'lucide-react';

const CompanyForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    industry: 'Manufacturing',
    country: 'United States',
    year: 2026,
    ai_investment_usd: 2000000,
    ai_adoption_level: 0.5,
    automation_rate: 0.4,
    employee_ai_training_hours: 40,
    ai_maturity_score: 6.5,
    deployment_count: 15
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, URL should be env var
      const response = await axios.post('/api/predict', formData);
      navigate('/dashboard', { state: { input: formData, results: response.data } });
    } catch (error) {
      console.error('Prediction failed:', error);
      alert('Failed to get prediction from server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClasses = "block text-sm font-medium text-slate-400 mb-2";

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans text-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">Company Profile</h1>
          <p className="text-slate-400">Provide your organizational details for AI investment analysis.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-md shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Industry */}
            <div>
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><Building2 className="w-4 h-4 text-blue-400"/> Industry</div>
              </label>
              <select name="industry" value={formData.industry} onChange={handleChange} className={inputClasses}>
                {['Manufacturing', 'Financial Services', 'Technology', 'Healthcare', 'Retail', 'Logistics', 'Agriculture', 'Energy', 'Telecom', 'Education'].map(ind => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div>
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><Globe2 className="w-4 h-4 text-emerald-400"/> Region / Country</div>
              </label>
              <select name="country" value={formData.country} onChange={handleChange} className={inputClasses}>
                {['United States', 'China', 'Germany', 'United Kingdom', 'Japan', 'India', 'France', 'South Korea', 'Brazil', 'Canada', 'Australia', 'Singapore', 'Netherlands', 'Sweden', 'UAE'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* AI Investment */}
            <div>
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-green-400"/> AI Investment Budget (USD)</div>
              </label>
              <input type="number" name="ai_investment_usd" value={formData.ai_investment_usd} onChange={handleChange} className={inputClasses} min="0" step="100000" />
            </div>

            {/* Year */}
            <div>
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><Calendar className="w-4 h-4 text-orange-400"/> Planning Year</div>
              </label>
              <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClasses} min="2020" max="2035" />
            </div>

            {/* Maturity Score */}
            <div>
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><BrainCircuit className="w-4 h-4 text-purple-400"/> AI Maturity Score (0-10)</div>
                <div className="text-xs text-slate-500 font-normal">Current value: {formData.ai_maturity_score}</div>
              </label>
              <input type="range" name="ai_maturity_score" value={formData.ai_maturity_score} onChange={handleChange} min="0" max="10" step="0.1" className="w-full accent-blue-500 mt-3" />
            </div>

            {/* Adoption Level */}
            <div>
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><Cog className="w-4 h-4 text-cyan-400"/> Adoption Level (0-1)</div>
                <div className="text-xs text-slate-500 font-normal">Current value: {formData.ai_adoption_level}</div>
              </label>
              <input type="range" name="ai_adoption_level" value={formData.ai_adoption_level} onChange={handleChange} min="0" max="1" step="0.01" className="w-full accent-blue-500 mt-3" />
            </div>

            {/* Automation Rate */}
            <div>
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><Cog className="w-4 h-4 text-pink-400"/> Automation Rate (0-1)</div>
                <div className="text-xs text-slate-500 font-normal">Current value: {formData.automation_rate}</div>
              </label>
              <input type="range" name="automation_rate" value={formData.automation_rate} onChange={handleChange} min="0" max="1" step="0.01" className="w-full accent-blue-500 mt-3" />
            </div>

            {/* Training Hours */}
            <div>
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><GraduationCap className="w-4 h-4 text-yellow-400"/> Employee Training Hours/Yr</div>
              </label>
              <input type="number" name="employee_ai_training_hours" value={formData.employee_ai_training_hours} onChange={handleChange} className={inputClasses} min="0" max="500" />
            </div>

            {/* Deployment Count */}
            <div className="md:col-span-2">
              <label className={labelClasses}>
                <div className="flex items-center gap-2 mb-1"><Server className="w-4 h-4 text-red-400"/> Deployment Count</div>
              </label>
              <input type="number" name="deployment_count" value={formData.deployment_count} onChange={handleChange} className={inputClasses} min="0" max="200" />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
              ) : (
                <><BrainCircuit className="w-5 h-5" /> Analyze Investment Strategy <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyForm;
