import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, TrendingUp, DollarSign, Activity, AlertTriangle, CheckCircle, Zap } from 'lucide-react';
import CopilotChat from '../components/CopilotChat';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
const formatPercent = (val) => `${val.toFixed(1)}%`;

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!location.state) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-50 flex-col">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Analysis Data Found</h2>
        <p className="text-slate-400 mb-6">Please complete the company profile first.</p>
        <button onClick={() => navigate('/form')} className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700">Back to Form</button>
      </div>
    );
  }

  const { input, results } = location.state;
  
  const { roi, cost_savings, revenue_impact, productivity_gain, risk, readiness_score } = results;

  // Mock forecast data for charts based on the predictions
  const forecastData = [
    { year: input.year, cost: cost_savings * 0.2, rev: revenue_impact * 0.1 },
    { year: input.year + 1, cost: cost_savings * 0.5, rev: revenue_impact * 0.4 },
    { year: input.year + 2, cost: cost_savings * 0.8, rev: revenue_impact * 0.7 },
    { year: input.year + 3, cost: cost_savings, rev: revenue_impact },
  ];

  const budgetAllocation = [
    { name: 'Predictive Analytics', value: 40 },
    { name: 'Automation', value: 35 },
    { name: 'Employee Training', value: 25 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-12 font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/form')} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Executive Dashboard</h1>
          </div>
          <div className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm border border-blue-500/20">
            {input.industry} • {input.country}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard title="Predicted ROI" value={formatPercent(roi)} icon={<TrendingUp className="w-6 h-6 text-green-400" />} trend="+2.4% vs industry" />
          <KpiCard title="Cost Savings" value={formatCurrency(cost_savings)} icon={<DollarSign className="w-6 h-6 text-blue-400" />} />
          <KpiCard title="Revenue Impact" value={formatCurrency(revenue_impact)} icon={<Zap className="w-6 h-6 text-purple-400" />} />
          <KpiCard title="Productivity Gain" value={formatPercent(productivity_gain * 100)} icon={<Activity className="w-6 h-6 text-emerald-400" />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-6">Impact Forecast</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                      formatter={(val) => formatCurrency(val)}
                    />
                    <Line type="monotone" dataKey="cost" name="Cost Savings" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                    <Line type="monotone" dataKey="rev" name="Revenue Impact" stroke="#8b5cf6" strokeWidth={3} dot={{r: 4}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations & Secondary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Risk & Readiness</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">Risk Level</span>
                      <span className={`font-semibold ${risk === 'High' ? 'text-red-400' : risk === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{risk}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className={`h-2 rounded-full ${risk === 'High' ? 'bg-red-400 w-full' : risk === 'Medium' ? 'bg-yellow-400 w-2/3' : 'bg-green-400 w-1/3'}`}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-400">AI Readiness</span>
                      <span className="font-semibold">{readiness_score} / 100</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${readiness_score}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-2 self-start">Budget Allocation</h3>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={budgetAllocation} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                        {budgetAllocation.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 text-xs text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Analytics</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Automation</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Training</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copilot Sidebar */}
          <div className="lg:col-span-1 h-[800px]">
            <CopilotChat context={{...input, ...results}} />
          </div>
        </div>
      </main>
    </div>
  );
};

const KpiCard = ({ title, value, icon, trend }) => (
  <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between hover:bg-slate-800/50 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-slate-400 font-medium">{title}</h3>
      <div className="p-2 bg-slate-800/80 rounded-lg">{icon}</div>
    </div>
    <div>
      <div className="text-3xl font-bold text-slate-100">{value}</div>
      {trend && <div className="text-sm text-green-400 mt-2 flex items-center gap-1"><CheckCircle className="w-3 h-3"/> {trend}</div>}
    </div>
  </div>
);

export default Dashboard;
