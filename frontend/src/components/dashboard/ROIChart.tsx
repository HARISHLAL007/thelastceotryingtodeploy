import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useGameStore } from '@/store/gameStore';
import { BrainCircuit } from 'lucide-react';

// Custom HUD Style Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="cyber-glass cyber-border-cyan p-3 rounded-lg text-[10px] font-orbitron text-white space-y-1">
        <p className="text-slate-500 font-bold border-b border-slate-800 pb-1 mb-1">// {label}</p>
        <p className="text-cyan-400 font-black">ROI: +{payload[0].value}%</p>
        {payload[0].payload.revenue !== undefined && (
          <p className="text-yellow-400 font-black">REV: ${payload[0].payload.revenue.toLocaleString()}</p>
        )}
      </div>
    );
  }
  return null;
};

type Analysis = { verdict: string; tone: 'good' | 'warn' | 'bad' | 'neutral'; text: string };

// Rule-based "AI analyst" — reads the actual ROI series and explains the trend.
const analyzeRoi = (data: { label: string; roi: number; revenue: number }[]): Analysis => {
  if (data.length < 2) {
    return {
      verdict: 'AWAITING DATA',
      tone: 'neutral',
      text: 'Telemetry stream initializing. Play your first quarter and I will surface the ROI trend, flag inflection points, and recommend your next move.',
    };
  }

  const rois = data.map((d) => d.roi);
  const labels = data.map((d) => d.label);
  const last = rois[rois.length - 1];
  const first = rois[0];
  const prev = rois[rois.length - 2];

  let peak = rois[0], peakLabel = labels[0], low = rois[0], lowLabel = labels[0];
  rois.forEach((r, i) => {
    if (r > peak) { peak = r; peakLabel = labels[i]; }
    if (r < low) { low = r; lowLabel = labels[i]; }
  });

  const recentDelta = Math.round(last - prev);
  const overallDelta = Math.round(last - first);
  const sign = (n: number) => (n >= 0 ? '+' : '');

  const parts: string[] = [];

  // 1) Overall trajectory
  if (last >= peak - 1 && overallDelta > 0) {
    parts.push(`ROI sits at its high-water mark of ${Math.round(last)}% and has climbed steadily since ${labels[0]} — clear evidence your AI bets are compounding.`);
  } else if (peak > last + 5) {
    parts.push(`ROI spiked to a peak of ${Math.round(peak)}% in ${peakLabel}, then cooled to ${Math.round(last)}%. That curve is textbook: early automation wins are now being offset by rising operating costs and the lag on heavier investments.`);
  } else if (overallDelta < -1) {
    parts.push(`ROI has slid from ${Math.round(first)}% to ${Math.round(last)}% across the run — returns are being outpaced by spend, and the board is noticing.`);
  } else {
    parts.push(`ROI is holding near ${Math.round(last)}%, broadly flat since ${labels[0]}. Stable footing, but no breakout yet.`);
  }

  // 2) Most recent quarter's direction
  if (recentDelta > 2) {
    parts.push(`The latest quarter accelerated (${sign(recentDelta)}${recentDelta} pts) — whatever you just funded is working.`);
  } else if (recentDelta < -2) {
    parts.push(`The latest quarter dipped (${recentDelta} pts); watch your burn rate before committing more capital.`);
  } else {
    parts.push(`The most recent move barely shifted the needle (${sign(recentDelta)}${recentDelta} pts).`);
  }

  if (low < 0) {
    parts.push(`Note the trough of ${Math.round(low)}% in ${lowLabel} — that drawdown is dragging your cumulative return.`);
  }

  // 3) Verdict + prescription
  let verdict: string, tone: Analysis['tone'];
  if (last >= 100) {
    verdict = 'EXCEPTIONAL'; tone = 'good';
    parts.push('Verdict: press the advantage with bold, high-ROI initiatives while momentum is on your side.');
  } else if (last >= 30) {
    verdict = 'HEALTHY'; tone = 'good';
    parts.push('Verdict: solid trajectory — keep balancing growth plays against maturity and morale.');
  } else if (last >= 0) {
    verdict = 'MARGINAL'; tone = 'warn';
    parts.push('Verdict: returns are thin. Favor efficient, lower-cost moves until momentum rebuilds.');
  } else {
    verdict = 'UNDERWATER'; tone = 'bad';
    parts.push('Verdict: costs are outrunning returns. Stabilize automation efficiency and morale before scaling spend.');
  }

  return { verdict, tone, text: parts.join(' ') };
};

// Typewriter that re-types whenever the analysis text changes (i.e. each new quarter).
const useTypewriter = (text: string, speed = 14) => {
  const [shown, setShown] = useState('');
  const ref = useRef<number | undefined>(undefined);
  useEffect(() => {
    setShown('');
    let i = 0;
    if (ref.current) window.clearInterval(ref.current);
    ref.current = window.setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length && ref.current) window.clearInterval(ref.current);
    }, speed);
    return () => { if (ref.current) window.clearInterval(ref.current); };
  }, [text, speed]);
  return shown;
};

const toneStyles: Record<Analysis['tone'], { badge: string; dot: string }> = {
  good: { badge: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10', dot: 'bg-emerald-400' },
  warn: { badge: 'text-amber-300 border-amber-500/40 bg-amber-500/10', dot: 'bg-amber-400' },
  bad: { badge: 'text-rose-300 border-rose-500/40 bg-rose-500/10', dot: 'bg-rose-400' },
  neutral: { badge: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10', dot: 'bg-cyan-400' },
};

export const ROIChart = () => {
  const state = useGameStore((s) => s.state);

  const data = state.history.map((entry) => ({
    label: entry.quarter ? `Q${entry.quarter} '${String(entry.year).slice(-2)}` : `'${String(entry.year).slice(-2)}`,
    roi: entry.roi,
    revenue: entry.revenue,
  }));

  const analysis = analyzeRoi(data);
  const typed = useTypewriter(analysis.text);
  const tone = toneStyles[analysis.tone];

  return (
    <Card className="cyber-glass cyber-border-cyan overflow-hidden relative">
      {/* Scanner laser overlay sweep */}
      <div className="cyber-sweep-overlay" />

      <CardHeader className="border-b border-slate-900 pb-4">
        <CardTitle className="font-orbitron text-sm font-black tracking-widest text-cyan-400 text-glow-cyan">
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
                dataKey="label"
                stroke="#475569"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'Orbitron' }}
                tickLine={{ stroke: '#1e293b' }}
                interval="preserveStartEnd"
                minTickGap={18}
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

        {/* AI Analyst — explains the curve in plain language, regenerated each quarter */}
        <div className="mt-5 rounded-xl border border-cyan-500/20 bg-slate-950/60 p-4 relative overflow-hidden">
          <div className="absolute inset-0 cyber-sweep-overlay opacity-20" />
          <div className="flex items-center justify-between mb-2 relative z-10">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-400/80 uppercase">
                Neural Analyst <span className="text-slate-600">//</span> Live Readout
              </span>
            </div>
            <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${tone.badge} flex items-center gap-1.5`}>
              <span className={`w-1.5 h-1.5 rounded-full ${tone.dot} animate-pulse`} />
              {analysis.verdict}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-space relative z-10 min-h-[3rem]">
            {typed}
            <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-cyan-400/80 align-middle animate-pulse" />
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
