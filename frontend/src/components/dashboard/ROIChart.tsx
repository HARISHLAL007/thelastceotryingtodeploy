import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';

// Custom HUD Style Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="cyber-glass cyber-border-cyan p-3 rounded-lg text-[10px] font-space text-white space-y-1">
        <p className="text-slate-500 font-bold border-b border-slate-800 pb-1 mb-1">// YEAR: {label}</p>
        <p className="text-cyan-400 font-black">ROI: +{payload[0].value}%</p>
        {payload[0].payload.revenue !== undefined && (
          <p className="text-yellow-400 font-black">REV: ${payload[0].payload.revenue.toLocaleString()}</p>
        )}
      </div>
    );
  }
  return null;
};

export const ROIChart = () => {
  const state = useGameStore((s) => s.state);

  const data = state.history.map((entry) => ({
    year: entry.year,
    roi: entry.roi,
    revenue: entry.revenue,
  }));

  return (
    <Card className="cyber-glass cyber-border-cyan overflow-hidden relative">
      {/* Scanner laser overlay sweep */}
      <div className="cyber-sweep-overlay" />
      
      <CardHeader className="border-b border-slate-900 pb-4">
        <CardTitle className="font-space text-sm font-black tracking-widest text-cyan-400 text-glow-cyan">
          // ROI_TELEMETRY_STREAM_
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              {/* Define glowing drop shadow filters */}
              <defs>
                <filter id="neon-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.8" />
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#12172a" vertical={false} />
              
              <XAxis 
                dataKey="year" 
                stroke="#475569" 
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }}
                tickLine={{ stroke: '#1e293b' }}
              />
              
              <YAxis 
                stroke="#475569"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }}
                tickLine={{ stroke: '#1e293b' }}
              />
              
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#1e293b', strokeWidth: 1 }} />
              
              <Line 
                type="monotone" 
                dataKey="roi" 
                stroke="#06b6d4" 
                strokeWidth={3}
                dot={{ fill: "#06b6d4", stroke: "#040610", strokeWidth: 1.5, r: 4 }}
                activeDot={{ fill: "#06b6d4", stroke: "#fff", strokeWidth: 2, r: 6 }}
                filter="url(#neon-glow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
