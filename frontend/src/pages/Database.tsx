import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Database as DbIcon, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/apiClient';

export const Database = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDb = async () => {
      try {
        const res = await api.getPredictions();
        setPredictions(res.data.predictions);
      } catch (e) {
        console.error("Failed to fetch predictions", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDb();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <div className="p-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
          <DbIcon className="w-6 h-6 text-rose-400" />
        </div>
        <div>
          <h1 className="text-2xl font-space font-bold text-slate-100">Historical Database</h1>
          <p className="text-sm text-slate-500 font-space">Enterprise AI Predictive Engine Logs</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-t-2 border-cyan-500 rounded-full animate-spin"></div>
        </div>
      ) : predictions.length === 0 ? (
        <div className="text-center p-12 text-slate-500 font-space bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
          No historical predictions found. Initialize a new simulation.
        </div>
      ) : (
        <div className="grid gap-4">
          {predictions.map((p, idx) => (
            <Card key={idx} className="bg-slate-900/60 border-slate-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all">
              <CardContent className="p-5 flex flex-col md:flex-row gap-6 justify-between items-center">
                <div className="space-y-1 w-full md:w-1/3">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-space mb-1">
                    <span>{new Date(p.timestamp).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-cyan-400">{p.industry}</span>
                  </div>
                  <h3 className="font-space font-bold text-slate-200">
                    Inv: ${(p.ai_investment_usd / 1000000).toFixed(2)}M
                  </h3>
                  <div className="flex gap-4 text-xs font-space mt-2">
                    <span className="text-slate-500">Maturity: <span className="text-slate-300">{p.ai_maturity_score}</span></span>
                    <span className="text-slate-500">Auto: <span className="text-slate-300">{p.automation_rate}%</span></span>
                  </div>
                </div>

                <div className="flex gap-6 w-full md:w-auto">
                  <div className="flex flex-col items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800/60 min-w-[100px]">
                    <TrendingUp className="w-4 h-4 text-cyan-400 mb-1" />
                    <span className="text-[10px] text-slate-500 font-space uppercase">Rev Impact</span>
                    <span className="font-bold text-cyan-400">${(p.revenue_prediction / 1000000).toFixed(2)}M</span>
                  </div>
                  
                  <div className="flex flex-col items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800/60 min-w-[100px]">
                    <Activity className="w-4 h-4 text-purple-400 mb-1" />
                    <span className="text-[10px] text-slate-500 font-space uppercase">Prod Gain</span>
                    <span className="font-bold text-purple-400">+{p.productivity_prediction.toFixed(1)}%</span>
                  </div>

                  <div className="flex flex-col items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800/60 min-w-[100px]">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mb-1" />
                    <span className="text-[10px] text-slate-500 font-space uppercase">Risk</span>
                    <span className="font-bold text-yellow-400">{p.risk_score.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
