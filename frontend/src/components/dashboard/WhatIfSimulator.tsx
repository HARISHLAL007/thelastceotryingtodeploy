import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { api } from '@/lib/apiClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { SlidersHorizontal, TrendingUp, Gauge, ShieldAlert, Cpu, RotateCcw, Loader2, BrainCircuit, Lightbulb, MessageSquare, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AnimatedMetric = ({ 
  value, 
  format, 
  trendMode 
}: { 
  value: number | null; 
  format: (v: number) => string; 
  trendMode: 'higher-is-better' | 'lower-is-better';
}) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [trend, setTrend] = useState<'up' | 'down' | 'none'>('none');
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value === null) {
      setDisplayValue(null);
      setTrend('none');
      prevValueRef.current = null;
      return;
    }

    if (prevValueRef.current === null) {
      setDisplayValue(value);
      prevValueRef.current = value;
      return;
    }

    if (value === prevValueRef.current) return;

    const startValue = displayValue !== null ? displayValue : prevValueRef.current;
    const endValue = value;

    if (endValue > prevValueRef.current) setTrend('up');
    else if (endValue < prevValueRef.current) setTrend('down');

    prevValueRef.current = value;

    const duration = 1500;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setDisplayValue(startValue + (endValue - startValue) * ease);

      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayValue(endValue);
    };

    requestAnimationFrame(animate);
  }, [value]);

  if (displayValue === null) return <span>—</span>;

  let isGood = true;
  if (trendMode === 'higher-is-better') isGood = trend === 'up';
  else if (trendMode === 'lower-is-better') isGood = trend === 'down';

  const trendColor = isGood ? 'text-emerald-400' : 'text-rose-400';

  return (
    <span className="flex items-center">
      {format(displayValue)}
      {trend === 'up' && <ArrowUpRight className={`ml-1.5 w-5 h-5 ${trendColor}`} />}
      {trend === 'down' && <ArrowDownRight className={`ml-1.5 w-5 h-5 ${trendColor}`} />}
    </span>
  );
};

// Plain-English phrasing + whether the player can change it with a slider.
const PHRASES: Record<string, { text: string; controllable: boolean }> = {
  'AI Investment': { text: 'your AI investment', controllable: true },
  'AI Adoption': { text: 'your AI adoption level', controllable: true },
  'Automation': { text: 'your automation rate', controllable: true },
  'AI Maturity': { text: 'your AI maturity', controllable: true },
  'Training Hours': { text: 'employee training', controllable: true },
  'Deployments': { text: 'your number of deployments', controllable: true },
  'Industry': { text: 'your industry', controllable: false },
  'Country': { text: 'your market', controllable: false },
  'Year': { text: 'the time period', controllable: false },
};
const phraseOf = (f: string) => PHRASES[f]?.text ?? `"${f}"`;
const isControllable = (f: string) => PHRASES[f]?.controllable ?? false;
const money = (v: number) => `$${Math.abs(v / 1000).toFixed(0)}k`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Lever {
  key: string;
  label: string;
  field: keyof Defaults;
  min: number;
  max: number;
  step: number;
  fmt: (v: number) => string;
}

interface Defaults {
  ai_investment_usd: number;
  ai_adoption_level: number;
  automation_rate: number;
  ai_maturity_score: number;
  employee_ai_training_hours: number;
  deployment_count: number;
}

const LEVERS: Lever[] = [
  { key: 'inv', label: 'AI Investment', field: 'ai_investment_usd', min: 100000, max: 20000000, step: 100000, fmt: (v) => `$${(v / 1000000).toFixed(1)}M` },
  { key: 'adopt', label: 'AI Adoption', field: 'ai_adoption_level', min: 0, max: 5, step: 0.1, fmt: (v) => v.toFixed(1) },
  { key: 'auto', label: 'Automation Rate', field: 'automation_rate', min: 0, max: 100, step: 1, fmt: (v) => `${v.toFixed(0)}%` },
  { key: 'mat', label: 'AI Maturity', field: 'ai_maturity_score', min: 0, max: 100, step: 1, fmt: (v) => `${v.toFixed(0)}` },
  { key: 'train', label: 'Training Hours', field: 'employee_ai_training_hours', min: 0, max: 200, step: 5, fmt: (v) => `${v.toFixed(0)}h` },
  { key: 'dep', label: 'Deployments', field: 'deployment_count', min: 0, max: 40, step: 1, fmt: (v) => `${v.toFixed(0)}` },
];

export const WhatIfSimulator = () => {
  const company = useGameStore((s) => s.company);
  const state = useGameStore((s) => s.state);

  const baseline = (): Defaults => ({
    ai_investment_usd: company?.aiInvestment ?? 2000000,
    ai_adoption_level: company?.aiAdoptionLevel ?? 3.5,
    automation_rate: company?.automationRate ?? 45,
    ai_maturity_score: company?.aiMaturityScore ?? 60,
    employee_ai_training_hours: company?.trainingHours ?? 120,
    deployment_count: company?.deploymentCount ?? 10,
  });

  const [vals, setVals] = useState<Defaults>(baseline);
  const [result, setResult] = useState<any>(null);
  const [explain, setExplain] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced live prediction + SHAP explanation whenever a slider moves
  useEffect(() => {
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const payload = {
          industry: company?.industry || 'Technology',
          country: company?.country || 'United States',
          year: state.currentYear,
          quarter: state.currentQuarter,
          ...vals,
          save_to_db: false,
        };
        const [predRes, explRes] = await Promise.all([
          api.getQuarterReport(payload),
          api.explainPrediction(payload),
        ]);
        setResult(predRes.data);
        setExplain(explRes.data);
      } catch (e) {
        setResult(null);
        setExplain(null);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [vals]);

  const m = result?.metrics;
  const roi = m ? Math.round(m.roi) : null;
  const roiColor = roi === null ? 'text-slate-400' : roi >= 0 ? 'text-emerald-400' : 'text-rose-400';

  const metricTiles = [
    { icon: TrendingUp, label: 'Predicted Revenue', value: m ? m.revenue_impact : null, format: (v: number) => `$${(v / 1000000).toFixed(2)}M`, trendMode: 'higher-is-better' as const, color: 'text-cyan-400' },
    { icon: Gauge, label: 'Quarterly ROI', value: roi, format: (v: number) => `${Math.round(v)}%`, trendMode: 'higher-is-better' as const, color: roiColor },
    { icon: Cpu, label: 'Productivity Gain', value: m ? m.productivity_gain : null, format: (v: number) => `${v.toFixed(1)}%`, trendMode: 'higher-is-better' as const, color: 'text-purple-400' },
    { icon: ShieldAlert, label: 'Risk Score', value: m ? m.risk_score : null, format: (v: number) => `${v.toFixed(0)}%`, trendMode: 'lower-is-better' as const, color: 'text-amber-400' },
  ];

  return (
    <Card className="cyber-glass cyber-border-cyan relative overflow-hidden">
      <div className="cyber-sweep-overlay opacity-20" />
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-cyan-400 text-sm tracking-[0.2em] uppercase text-glow-cyan">
          <SlidersHorizontal className="w-4 h-4" /> ML Strategy Simulator
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-500/70" />}
        </CardTitle>
        <p className="text-[11px] text-slate-500 font-mono mt-1">
          Drag the levers — the live XGBoost model re-forecasts in real time. (Sandbox: does not affect your game.)
        </p>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Top row: sliders + live prediction */}
        <div className="grid md:grid-cols-2 gap-6">
        {/* Sliders */}
        <div className="space-y-4">
          {LEVERS.map((lv) => (
            <div key={lv.key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest">
                <span className="text-slate-400">{lv.label}</span>
                <span className="text-cyan-300 tabular-nums">{lv.fmt(vals[lv.field])}</span>
              </div>
              <input
                type="range"
                min={lv.min}
                max={lv.max}
                step={lv.step}
                value={vals[lv.field]}
                onChange={(e) => setVals((v) => ({ ...v, [lv.field]: Number(e.target.value) }))}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          ))}
          <button
            onClick={() => setVals(baseline())}
            className="mt-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-500 hover:text-cyan-400 transition-colors"
          >
            <RotateCcw className="w-3 h-3" /> Reset to current company
          </button>
        </div>

        {/* Live prediction */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {metricTiles.map((t) => (
              <div key={t.label} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-1">
                  <t.icon className="w-3 h-3" /> {t.label}
                </div>
                <div className={`text-xl font-black tracking-tight ${t.color} ${loading ? 'opacity-50' : ''}`}>
                  <AnimatedMetric value={t.value} format={t.format} trendMode={t.trendMode} />
                </div>
              </div>
            ))}
          </div>

          {/* Board verdict from the model */}
          <div className="rounded-lg border border-cyan-500/20 bg-cyan-950/20 p-3">
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-cyan-500/70 mb-1">
              <BrainCircuit className="w-3 h-3" /> Model Verdict
            </div>
            <div className="text-sm font-bold text-cyan-300">
              {m ? m.board_decision : '—'}
              {m && <span className="ml-2 text-[10px] font-mono text-slate-500">[{m.readiness_level} readiness]</span>}
            </div>
          </div>

          {/* A/B/C scenario ROI from the model */}
          {result?.scenarios && (
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-2">Investment Scenarios (model ROI)</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { k: 'A', label: 'Maintain' },
                  { k: 'B', label: '+20%' },
                  { k: 'C', label: '+50%' },
                ].map((s) => {
                  const sc = result.scenarios[s.k];
                  const r = Math.round(sc.roi);
                  return (
                    <div key={s.k} className="rounded border border-slate-800 bg-slate-900/50 py-1.5">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-slate-500">{s.label}</div>
                      <div className={`text-sm font-black ${r >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{r}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
        </div>

        {/* Explanation row — Plain English (left) + SHAP (right) */}
        {explain?.contributions?.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Plain-English interpretation (LEFT) */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-950/10 p-3">
            <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-amber-400/80 mb-2">
              <MessageSquare className="w-3 h-3" /> AI Advisor
            </div>
            <ul className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
              {explain.contributions.slice(0, 3).map((c: any) => (
                <li key={c.feature} className="flex gap-1.5">
                  <span className={c.impact >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{c.impact >= 0 ? '▲' : '▼'}</span>
                  <span>
                    {cap(phraseOf(c.feature))} is {c.impact >= 0 ? 'adding' : 'taking'} {money(c.impact)} {c.impact >= 0 ? 'to' : 'off'} the forecast.
                  </span>
                </li>
              ))}
            </ul>
            {(() => {
              const neg = explain.contributions.find((c: any) => c.impact < 0 && isControllable(c.feature));
              const pos = explain.contributions.find((c: any) => c.impact > 0 && isControllable(c.feature));
              if (neg) return <div className="mt-2 text-[11px] text-amber-300/90">💡 Raise {phraseOf(neg.feature)} to lift revenue — it's the biggest drag you control right now.</div>;
              if (pos) return <div className="mt-2 text-[11px] text-emerald-300/90">✅ {cap(phraseOf(pos.feature))} is your strongest lever — keep it high.</div>;
              return null;
            })()}
          </div>

          {/* SHAP explainability (RIGHT) */}
          {(() => {
            const maxAbs = Math.max(...explain.contributions.map((c: any) => Math.abs(c.impact)), 1);
            return (
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-500 mb-2">
                  <Lightbulb className="w-3 h-3 text-amber-400" /> Why this forecast? (SHAP)
                </div>
                <div className="space-y-1.5">
                  {explain.contributions.map((c: any) => {
                    const pos = c.impact >= 0;
                    const pct = (Math.abs(c.impact) / maxAbs) * 100;
                    return (
                      <div key={c.feature} className="flex items-center gap-2 text-[10px]">
                        <span className="w-32 shrink-0 text-slate-400 font-mono truncate" title={c.feature}>{c.feature}</span>
                        <div className="flex-1 h-2.5 bg-slate-900 rounded overflow-hidden">
                          <div className={`h-full rounded ${pos ? 'bg-emerald-500/70' : 'bg-rose-500/70'}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className={`w-14 text-right tabular-nums font-mono ${pos ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {pos ? '+' : '−'}${Math.abs(c.impact / 1000).toFixed(0)}k
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 text-[9px] font-mono text-slate-600">
                  Baseline ${(explain.base_value / 1e6).toFixed(2)}M → Forecast ${(explain.prediction / 1e6).toFixed(2)}M (per quarter)
                </div>
              </div>
            );
          })()}
        </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatIfSimulator;
