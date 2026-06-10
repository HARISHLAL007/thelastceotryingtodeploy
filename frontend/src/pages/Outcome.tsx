import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Trophy, 
  XCircle, 
  ArrowLeft, 
  Lock, 
  Unlock, 
  Coins, 
  Users, 
  TrendingUp, 
  Heart,
  Zap,
  Activity,
  Terminal,
  Skull,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import { ALL_ENDINGS, getAchievedEnding } from '@/lib/endings';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="cyber-glass cyber-border-cyan p-3 rounded-lg text-[10px] font-space text-white space-y-1">
        <p className="text-slate-500 font-bold border-b border-slate-800 pb-1 mb-1">// YEAR: {label}</p>
        {payload.map((p: any, idx: number) => (
          <p key={idx} style={{ color: p.color }} className="font-black">
            {p.name.toUpperCase()}: {p.name === 'budget' || p.name === 'revenue' ? `$${p.value.toLocaleString()}` : p.name === 'roi' || p.name === 'morale' ? `${p.value}%` : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Outcome = () => {
  const state = useGameStore((s) => s.state);
  const company = useGameStore((s) => s.company);
  const actions = useGameStore((s) => s.actions);

  const isVictory = state.gameResult === 'victory';

  // State for animations
  const [valTicker, setValTicker] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [activeTab, setActiveTab] = useState<'capital' | 'roi' | 'vitality' | 'workforce'>('capital');

  const achievedEnding = getAchievedEnding(state, company);
  const achievedEndingId = achievedEnding.id;

  // Calculate corporate valuation metric
  const calculateValuation = () => {
    if (state.gameResult === 'victory') {
      return state.budget * 1.8 + (state.employees * 125000) * (1 + (state.roi / 100));
    }
    return 0;
  };
  const valuation = calculateValuation();

  const handleDownloadReport = () => {
    const today = new Date().toLocaleDateString();
    
    // Dynamic generation logic
    const swot = {
      strengths: [
        company?.aiMaturityScore >= 80 ? '✓ Industry-leading AI Maturity' : '✓ Developing ML capabilities',
        company?.automationRate >= 80 ? '✓ High Operational Automation' : '✓ Expanding autonomous processes',
        state.budget > 100000000 ? '✓ Massive Capital Reserves ($100M+)' : `✓ Stable Budget ($${(state.budget/1000000).toFixed(1)}M)`
      ],
      weaknesses: [
        state.employees === 0 ? '• Total workforce elimination (0 humans)' : state.employees < 10 ? '• Dangerously low human workforce' : '• Workforce transition friction',
        state.morale < 50 ? '• Critical morale deficiencies' : '• High reliance on continuous AI compute',
        company?.aiInvestment > state.budget ? '• Outpaced R&D investment' : '• Internal pushback on AI initiatives'
      ],
      opportunities: [
        state.employees <= 10 && company?.automationRate >= 90 ? '• Post-Human autonomous operations' : '• Potential for public market IPO',
        '• Expansion into GenAI product lines',
        '• Strategic acquisition by Megacorp'
      ],
      threats: [
        '• Impending EU AI Regulation',
        '• Cyberattack vulnerabilities scaling with automation',
        '• Market saturation of LLM solutions'
      ]
    };

    const ceoCommentary = `The enterprise aggressively invested in automation and AI maturity during the evaluation period. ` +
      `By ${state.currentYear}, AI handled ${company?.automationRate.toFixed(1)}% of core operations. ` +
      `${state.employees === 0 ? 'The human workforce was entirely eliminated in favor of autonomous agents, creating a perfect zero-friction operational loop. ' : 'The workforce transitioned to AI-augmented roles. '}` +
      `The resulting productivity gains and $${(state.budget/1000000).toFixed(1)}M capital reserves attracted massive interest from global technology firms.`;

    const boardVerdict = isVictory 
      ? (achievedEnding.id === 'ai_singularity' ? 'The board has been dismissed. Neural Core has assumed total executive control.' : 'The board unanimously approves the resulting strategic outcome.')
      : 'The board has initiated Chapter 11 proceedings and terminated executive leadership.';

    const enterpriseStatus = achievedEnding.id === 'ai_singularity' ? 'POST-HUMAN ORGANIZATION' :
                             achievedEnding.id === 'megacorp_acquisition' ? 'ACQUIRED BY GLOBAL CONGLOMERATE (Strategic Buyout)' :
                             achievedEnding.id === 'ipo_success' ? 'PUBLICLY LISTED ENTITY (NYSE)' :
                             achievedEnding.id === 'unicorn_exit' ? 'DECA-CORN PRIVATE STATUS' : 
                             isVictory ? 'PROFITABLE ENTERPRISE' : 'LIQUIDATED / TERMINATED';

    const renderBar = (val: number, color: string = '#000') => {
      const pct = Math.min(Math.max(val, 0), 100);
      return `<div style="width: 100%; background: #e2e8f0; height: 12px; margin-top: 5px;">
                <div style="width: ${pct}%; background: ${color}; height: 100%;"></div>
              </div>`;
    };

    const historyRows = state.history.map(h => `
      <tr>
        <td class="highlight">${h.year === 2024 ? '2024 - Founded' : h.year === 2028 ? '2028 - AI Integrated' : h.year === 2035 ? '2035 - Exit' : `Year ${h.year}`}</td>
        <td>$${(h.budget/1000000).toFixed(1)}M</td>
        <td>$${(h.revenue/1000000).toFixed(1)}M</td>
        <td>${h.roi}%</td>
        <td>${h.morale === 0 && h.year >= 2024 ? 'N/A' : h.morale}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Corporate Report</title>
      <style>
        body { font-family: 'Helvetica Neue', 'Arial', sans-serif; color: #1a1a1a; line-height: 1.6; background: #ffffff; }
        .cover { text-align: center; margin-top: 150px; margin-bottom: 200px; page-break-after: always; }
        .cover h1 { font-size: 38pt; color: #0f172a; margin-bottom: 10px; font-weight: 900; letter-spacing: 2px; }
        .cover .logo { font-size: 24pt; font-weight: 900; color: #06b6d4; margin-bottom: 40px; letter-spacing: 5px; }
        .cover .divider { border-top: 2px solid #000; width: 60%; margin: 20px auto; }
        .confidential { color: #d93025; font-weight: bold; font-size: 12pt; text-transform: uppercase; margin-top: 80px; letter-spacing: 4px; }
        
        .section-title { font-size: 20pt; color: #000; border-bottom: 2px solid #000; padding-bottom: 5px; margin-top: 50px; font-weight: 700; text-transform: uppercase; }
        
        .dashboard { width: 100%; border: 3px solid #0f172a; border-collapse: collapse; margin-top: 20px; }
        .dashboard td { padding: 20px; text-align: center; border: 1px solid #cbd5e1; width: 20%; vertical-align: top; }
        .dash-label { font-size: 10pt; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 10px; }
        .dash-val { font-size: 24pt; font-weight: 900; color: #0f172a; }
        
        table.data-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 30px; }
        table.data-table th { background-color: #0f172a; color: #fff; padding: 12px; font-size: 11pt; text-align: left; text-transform: uppercase; }
        table.data-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 11pt; color: #334155; }
        table.data-table tr:nth-child(even) { background-color: #f8fafc; }
        .highlight { font-weight: 700; color: #0f172a; }
        
        .swot-grid { display: table; width: 100%; margin: 20px 0; border-collapse: collapse; }
        .swot-cell { display: table-cell; width: 50%; padding: 20px; border: 1px solid #e2e8f0; vertical-align: top; }
        .swot-title { font-weight: 900; font-size: 14pt; color: #0f172a; margin-bottom: 15px; text-transform: uppercase; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
        .swot-list { margin: 0; padding-left: 20px; color: #475569; }
        .swot-list li { margin-bottom: 8px; }

        .scorecard { display: table; width: 100%; margin-bottom: 15px; }
        .scorecard-label { display: table-cell; width: 30%; font-weight: bold; }
        .scorecard-bar { display: table-cell; width: 50%; vertical-align: middle; }
        .scorecard-val { display: table-cell; width: 20%; text-align: right; font-weight: bold; }

        .conclusion-box { background: #0f172a; color: #fff; padding: 40px; margin-top: 60px; }
        .conclusion-title { font-size: 20pt; font-weight: bold; margin-bottom: 20px; color: #38bdf8; text-transform: uppercase; border-bottom: 1px solid #334155; padding-bottom: 10px; }
        .conclusion-text { font-size: 14pt; line-height: 1.8; color: #f8fafc; }
      </style>
      </head>
      <body>
        <!-- Cover Page -->
        <div class="cover">
          <div class="divider"></div>
          <div class="logo">NEURALFORGE AI</div>
          <h1>AI TRANSFORMATION REPORT</h1>
          <h2>2035 BOARD REVIEW</h2>
          <div class="divider"></div>
          <br/><br/><br/>
          <p>Subject: ${company?.name || 'Company'} (${company?.industry})</p>
          <p>Generated by: NeuralForge Copilot Engine v4.2</p>
          <div class="confidential">Strictly Confidential</div>
        </div>

        <h1 class="section-title">Executive Summary</h1>
        <p style="font-size: 14pt; line-height: 1.8; color: #334155;">
          ${ceoCommentary}
        </p>

        <h1 class="section-title">KPI Dashboard</h1>
        <table class="dashboard">
          <tr>
            <td><div class="dash-label">Enterprise Value</div><div class="dash-val">$${(valuation/1000000).toFixed(1)}M</div></td>
            <td><div class="dash-label">Available Budget</div><div class="dash-val">$${(state.budget/1000000).toFixed(1)}M</div></td>
            <td><div class="dash-label">Peak ROI</div><div class="dash-val">${state.roi}%</div></td>
            <td><div class="dash-label">AI Maturity</div><div class="dash-val">${company?.aiMaturityScore.toFixed(0)}/100</div></td>
            <td><div class="dash-label">Automation</div><div class="dash-val">${company?.automationRate.toFixed(0)}%</div></td>
          </tr>
        </table>
        
        <p style="text-align: right; font-size: 10pt; color: #64748b; font-weight: bold;">
          AI Prediction Confidence: 93% ${renderBar(93, '#06b6d4')}
        </p>

        <h1 class="section-title">Strategic Milestones & Financial Timeline</h1>
        <p>The following table tracks revenue scaling and compute budget deployment year-over-year.</p>
        <table class="data-table">
          <tr>
            <th>Fiscal Year</th>
            <th>Available Budget</th>
            <th>Generated Revenue</th>
            <th>ROI (%)</th>
            <th>Human / Machine Ratio (Morale)</th>
          </tr>
          ${historyRows}
        </table>

        <!-- Scorecards embedded as charts -->
        <h1 class="section-title">Operational Scorecards</h1>
        <div class="scorecard">
          <div class="scorecard-label">Innovation Capability</div>
          <div class="scorecard-bar">${renderBar(company?.aiMaturityScore, '#8b5cf6')}</div>
          <div class="scorecard-val">${company?.aiMaturityScore.toFixed(0)} / 100</div>
        </div>
        <div class="scorecard">
          <div class="scorecard-label">Efficiency / Automation</div>
          <div class="scorecard-bar">${renderBar(company?.automationRate, '#10b981')}</div>
          <div class="scorecard-val">${company?.automationRate.toFixed(0)} / 100</div>
        </div>
        <div class="scorecard">
          <div class="scorecard-label">Enterprise Growth</div>
          <div class="scorecard-bar">${renderBar(Math.min(valuation / 10000000, 100), '#3b82f6')}</div>
          <div class="scorecard-val">${Math.min(valuation / 10000000, 100).toFixed(0)} / 100</div>
        </div>
        <div class="scorecard">
          <div class="scorecard-label">Systemic Risk</div>
          <div class="scorecard-bar">${renderBar(company?.automationRate > 80 ? 85 : 40, '#ef4444')}</div>
          <div class="scorecard-val">${company?.automationRate > 80 ? 85 : 40} / 100</div>
        </div>

        <h1 class="section-title">Dynamic SWOT Matrix</h1>
        <div class="swot-grid">
          <div class="swot-cell">
            <div class="swot-title">Strengths</div>
            <ul class="swot-list">${swot.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="swot-cell">
            <div class="swot-title">Weaknesses</div>
            <ul class="swot-list">${swot.weaknesses.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
        </div>
        <div class="swot-grid" style="margin-top:0;">
          <div class="swot-cell">
            <div class="swot-title">Opportunities</div>
            <ul class="swot-list">${swot.opportunities.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
          <div class="swot-cell">
            <div class="swot-title">Threats</div>
            <ul class="swot-list">${swot.threats.map(s => `<li>${s}</li>`).join('')}</ul>
          </div>
        </div>

        <h1 class="section-title">AI Copilot Recommendations</h1>
        <ol style="font-size: 12pt; line-height: 1.8; color: #334155;">
          <li><strong>Autonomous Governance:</strong> ${company?.automationRate >= 80 ? 'Maintain current trajectory. Human intervention is no longer statistically optimal.' : 'Increase automation investments to eliminate legacy workflow bottlenecks.'}</li>
          <li><strong>Capital Allocation:</strong> ${state.budget > 50000000 ? 'Deploy excess capital into strategic acquisitions and massive compute clusters.' : 'Secure Series B/C funding to sustain ML development costs.'}</li>
          <li><strong>Workforce Transition:</strong> ${state.employees === 0 ? 'Workforce is fully eliminated. Reallocate HR budget to API usage and GPU leasing.' : 'Begin phasing out Tier 1 and Tier 2 human roles in favor of autonomous agents.'}</li>
        </ol>
        
        <!-- Final Conclusion -->
        <div class="conclusion-box">
          <div class="conclusion-title">FINAL BOARD RESOLUTION</div>
          <div class="conclusion-text">
            <strong>Enterprise Status:</strong> <span style="color:#38bdf8;">${enterpriseStatus}</span><br/><br/>
            <strong>Board Verdict:</strong> ${boardVerdict}<br/><br/>
            <em>Simulation Outcome: ${achievedEnding.title}</em><br/>
            ${achievedEnding.unlockedMsg}
          </div>
        </div>
      </body>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', url);
    downloadAnchorNode.setAttribute('download', `NeuralForge_Report_${(company?.name || 'Company').replace(/\s+/g, '_')}_${state.currentYear}.doc`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
  };

  // 1. Count-up Valuation Ticker animation
  useEffect(() => {
    if (!state.isGameOver || valuation <= 0) {
      setValTicker(0);
      return;
    }
    let start = 0;
    const end = valuation;
    const duration = 2500; // 2.5 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      setValTicker(Math.floor(easeProgress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [state.isGameOver, valuation]);

  // 2. Terminal Typewriter effect
  useEffect(() => {
    if (!state.isGameOver) return;
    const fullText = achievedEnding.unlockedMsg;
    let index = 0;
    setTypedText('');
    
    const interval = setInterval(() => {
      setTypedText((prev) => prev + fullText.charAt(index));
      index++;
      if (index >= fullText.length) {
        clearInterval(interval);
      }
    }, 20); // Type one character every 20ms
    
    return () => clearInterval(interval);
  }, [state.isGameOver, achievedEnding.unlockedMsg]);

  if (!state.isGameOver) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#060814] text-white font-space">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 text-rose-500 animate-spin mx-auto" />
          <p className="text-sm text-slate-400">DATA FLUX: SIMULATION IN PROGRESS</p>
          <Link to="/engine">
            <Button className="mt-4 text-xs">Return to Console</Button>
          </Link>
        </div>
      </div>
    );
  }

  const chartData = state.history.map((entry) => ({
    year: entry.year,
    roi: entry.roi,
    budget: entry.budget,
    revenue: entry.revenue,
    morale: entry.morale,
    employees: entry.employees || state.employees,
  }));

  const handleRestart = () => {
    actions.resetGame();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden py-12 px-6">
      
      {/* INJECTED CUSTOM IN-FILE ANIMATIONS & SMOOTH TRANSITIONS */}
      <style>{`
        /* Staggered entrance animations */
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(24px);
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .delay-50  { animation-delay: 50ms; }
        .delay-100 { animation-delay: 100ms; }
        .delay-150 { animation-delay: 150ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Ambient panning cybergrid background */
        @keyframes grid-pan {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
        .animated-grid-bg {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(6, 182, 212, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: grid-pan 12s linear infinite;
          pointer-events: none;
          z-index: 1;
        }

        /* Screen scanning overlay sweep */
        @keyframes scanline-sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        .scanline-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 140px;
          background: linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.07), transparent);
          animation: scanline-sweep 6s linear infinite;
          pointer-events: none;
          z-index: 999;
        }

        /* Card Shimmer / Glint Reflection Effect */
        .shimmer-card {
          position: relative;
          overflow: hidden;
          transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease;
        }
        .shimmer-card::after {
          content: '';
          position: absolute;
          top: 0; left: -150%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), rgba(6, 182, 212, 0.08), transparent);
          transform: skewX(-25deg);
          transition: none;
          pointer-events: none;
        }
        .shimmer-card:hover {
          transform: translateY(-4px) scale(1.01);
        }
        .shimmer-card:hover::after {
          left: 150%;
          transition: all 1.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Custom pulsing glows */
        @keyframes pulse-cyan-shadow {
          0%, 100% { box-shadow: 0 0 10px rgba(6, 182, 212, 0.15); }
          50% { box-shadow: 0 0 25px rgba(6, 182, 212, 0.4); }
        }
        @keyframes pulse-gold-shadow {
          0%, 100% { box-shadow: 0 0 12px rgba(234, 179, 8, 0.15); }
          50% { box-shadow: 0 0 30px rgba(234, 179, 8, 0.45); }
        }
        @keyframes error-red-flash {
          0%, 100% { border-color: rgba(244, 63, 94, 0.4); box-shadow: 0 0 12px rgba(244, 63, 94, 0.1); }
          50% { border-color: rgba(244, 63, 94, 0.85); box-shadow: 0 0 25px rgba(244, 63, 94, 0.35); }
        }

        /* Staggered Matrix Text Entry */
        .neon-glitch-text {
          text-shadow: 0 0 5px rgba(255,255,255,0.7), 0 0 10px rgba(6,182,212,0.6);
          transition: text-shadow 0.3s ease;
        }
        .shimmer-card:hover .neon-glitch-text {
          text-shadow: 0 0 8px rgba(255,255,255,0.9), 0 0 18px rgba(6,182,212,0.95), 0 0 30px rgba(168,85,247,0.7);
        }
      `}</style>

      {/* Cyber Grid Overlay */}
      {/* <div className="scanline-bar" /> removed as per user request */}
      <div className="animated-grid-bg" />

      {/* Massive diagonal background watermark (smooth scale-in entrance) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none z-0">
        <span className="font-space font-black text-[12vw] tracking-[3vw] text-slate-900/10 uppercase -rotate-12 whitespace-nowrap transition-transform duration-1000 scale-[0.9] animate-[fadeInUp_1.5s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          {isVictory ? "SYSTEM // SECURED" : "SYS // TERMINATED"}
        </span>
      </div>

      <div className="container max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER: TERMINAL STATUS HUD */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-900 pb-5 gap-4 animate-fade-in-up delay-50">
          <div className="flex items-center space-x-3">
            <Terminal className="h-6 w-6 text-cyan-400 animate-pulse" />
            <span className="font-space text-sm font-black tracking-widest text-cyan-400 text-glow-cyan">
              // ARCHIVE MEMORY MODULE LOADED // SECURE_LOG.BIN
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/40 px-3 py-1.5 rounded border border-slate-800">
            <span className={cn(
              "h-2.5 w-2.5 rounded-full animate-ping",
              isVictory ? "bg-yellow-400" : "bg-rose-500"
            )} />
            <span className={cn(
              "font-space text-[10px] font-black uppercase tracking-wider",
              isVictory ? "text-yellow-400 text-glow-gold" : "text-rose-500 text-glow-magenta"
            )}>
              {isVictory ? "SIMULATION COMPLETE" : "SYSTEM FAILURE DIAGNOSIS"}
            </span>
          </div>
        </div>

        {/* TOP PANEL: COOPERATIVE HIGHLIGHT PANEL */}
        <div className={cn(
          "shimmer-card p-8 rounded-xl border relative flex flex-col md:flex-row justify-between items-center gap-8 group animate-fade-in-up delay-100",
          isVictory 
            ? "border-yellow-500/50 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.15)] animate-[pulse-gold-shadow_3s_infinite_alternate]" 
            : "border-rose-500/50 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.15)] animate-[error-red-flash_2.5s_infinite_alternate]"
        )}>
          {/* Internal gradient ray */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.06),transparent_50%)] pointer-events-none" />
          
          <div className="space-y-4 text-center md:text-left relative z-10 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="font-space text-[10px] font-black tracking-widest text-slate-300 bg-slate-950 px-3.5 py-1 rounded border border-slate-800/80 flex items-center gap-1.5 uppercase transition-colors group-hover:border-slate-700">
                <Trophy className={cn("h-3.5 w-3.5", achievedEnding.textColor)} />
                {achievedEnding.badge}
              </span>
              {!isVictory && (
                <span className="font-space text-[10px] font-black tracking-widest text-rose-400 bg-rose-500/5 px-3.5 py-1 rounded border border-rose-500/20 uppercase animate-pulse">
                  CRITICAL SHUTDOWN
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black font-space tracking-wider text-slate-100 neon-glitch-text">
              {achievedEnding.title}
            </h1>
            
            {/* Live typewriter output prompt */}
            <div className="min-h-[40px] bg-slate-950/80 p-4 rounded border border-slate-900 font-mono text-xs text-slate-400 leading-relaxed text-left flex items-start gap-2 group-hover:border-slate-800 transition-colors">
              <span className="text-cyan-400 animate-pulse flex-shrink-0">&gt;_</span>
              <span>
                {typedText}
                <span className="h-4 w-2 bg-slate-300 inline-block animate-pulse ml-0.5" />
              </span>
            </div>
          </div>

          {/* VALUATION CONSOLE */}
          <div className="text-center md:text-right font-space bg-slate-950/90 p-6 rounded-lg border border-slate-850 shadow-[0_0_25px_rgba(0,0,0,0.6)] min-w-[280px] relative overflow-hidden group/val hover:border-slate-700 transition-colors duration-300">
            <div className="absolute -right-12 -top-12 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block transition-colors group-hover/val:text-slate-300">
              {isVictory ? "ENTERPRISE VALUATION" : "LIQUIDATION VALUE"}
            </span>
            
            <span className="text-4xl font-black block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-200 to-orange-400 tracking-wider transition-transform duration-300 group-hover/val:scale-105">
              {valuation > 0 ? `$${valTicker.toLocaleString()}` : "$0.00"}
            </span>

            <span className="text-[8px] text-slate-500 block mt-2 tracking-widest border-t border-slate-900 pt-2 uppercase">
              {valuation > 0 ? "MARKET CAPITALIZATION" : "CHAPTER 11 CORP TERMINATION"}
            </span>
          </div>
        </div>

        {/* VITALS & TRAJECTORY SPLIT PANEL */}
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* Core Vitals Card */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-up delay-200">
            <Card className="shimmer-card cyber-glass border-slate-900/90 hover:border-slate-850 bg-slate-900/10 hover:bg-slate-900/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all h-full flex flex-col justify-between overflow-hidden">
              <div className="absolute -left-12 -bottom-12 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
              
              <CardHeader className="border-b border-slate-900/80 pb-3">
                <CardTitle className="font-space text-xs font-black text-cyan-400 tracking-widest flex items-center justify-between">
                  <span>// OPERATIONS METRIC LOG_</span>
                  <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-around">
                
                {/* Reserves */}
                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3 hover:translate-x-1 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.1)]">
                      <Coins className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-space uppercase tracking-wider">NET RESERVES</p>
                      <p className="text-lg font-black font-space text-slate-100">
                        ${state.budget.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ROI */}
                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3 hover:translate-x-1 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.1)]">
                      <TrendingUp className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-space uppercase tracking-wider">CUMULATIVE ROI</p>
                      <p className="text-lg font-black font-space text-cyan-400">
                        {state.roi}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Employees */}
                <div className="flex items-center justify-between border-b border-slate-900/60 pb-3 hover:translate-x-1 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.1)]">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-space uppercase tracking-wider">WORKFORCE CAPACITY</p>
                      <p className="text-lg font-black font-space text-purple-400">
                        {state.employees} Staff
                      </p>
                    </div>
                  </div>
                </div>

                {/* Morale */}
                <div className="flex items-center justify-between hover:translate-x-1 transition-transform duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-850 text-pink-400 shadow-[0_0_8px_rgba(244,63,94,0.1)]">
                      <Heart className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-500 font-space uppercase tracking-wider">VITALITY MORALE</p>
                      <p className="text-lg font-black font-space text-pink-400">
                        {state.morale}%
                      </p>
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Executive Summary Card */}
          <div className="lg:col-span-3 space-y-4 animate-fade-in-up delay-250">
            <Card className="shimmer-card cyber-glass border-slate-900/90 hover:border-slate-850 bg-slate-900/10 hover:bg-slate-900/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)] transition-all h-full flex flex-col justify-between overflow-hidden">
              <CardHeader className="border-b border-slate-900/80 pb-3">
                <CardTitle className="font-space text-xs font-black text-emerald-400 tracking-widest flex items-center justify-between">
                  <span>// EXECUTIVE SUMMARY_</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-5 flex-1 flex flex-col">
                <div className="font-mono text-sm text-slate-300 leading-relaxed flex-1 space-y-2">
                  <p className="border-b border-slate-800 pb-2 mb-2"><span className="text-slate-500">// ORG_NAME:</span> <span className="text-white font-bold">{company?.name || 'Unknown'}</span></p>
                  <p><span className="text-slate-500">// SECTOR:</span> <span className="text-white">{company?.industry}</span></p>
                  <p><span className="text-slate-500">// AI_MATURITY:</span> <span className="text-cyan-400 font-bold">{company?.aiMaturityScore?.toFixed(1) || 0} / 100</span></p>
                  <p><span className="text-slate-500">// AUTOMATION_RATE:</span> <span className="text-cyan-400 font-bold">{company?.automationRate?.toFixed(1) || 0}%</span></p>
                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded mt-4">
                    <p className="text-xs text-slate-400 italic">"The board of directors has reviewed the strategic trajectory and concluded the final evaluation phase. A comprehensive audit has been generated."</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900/80 mt-auto">
                  <Button 
                    onClick={handleDownloadReport}
                    className="w-full py-6 font-space font-bold text-xs tracking-wider bg-cyan-950/40 hover:bg-cyan-900 border border-cyan-800 text-cyan-400 hover:text-white flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  >
                    <Download className="h-4 w-4" />
                    DOWNLOAD FULL EXECUTIVE REPORT (.DOC)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Interactive Analytics Panel */}
          <div className="lg:col-span-5 animate-fade-in-up delay-300 space-y-4">
            <div className="flex flex-wrap gap-2 mb-4 bg-slate-900/40 p-1.5 rounded-lg border border-slate-800/80 w-fit mx-auto md:mx-0 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
              {['capital', 'roi', 'vitality', 'workforce'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={cn(
                    "px-4 py-2 font-space text-[10px] font-black tracking-widest rounded uppercase transition-all duration-300",
                    activeTab === tab 
                      ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
                  )}
                >
                  {tab === 'capital' ? 'Budget & Revenue' : tab === 'vitality' ? 'Morale & Risk' : tab}
                </button>
              ))}
            </div>

            <Card className="shimmer-card cyber-glass border-slate-900/95 hover:border-slate-855 bg-slate-900/10 hover:bg-slate-900/20 transition-all">
              <CardHeader className="border-b border-slate-900 pb-3">
                <CardTitle className="font-space text-xs font-black text-cyan-400 tracking-widest flex items-center justify-between">
                  <span>
                    // ANALYTICS_FEED_
                    {activeTab === 'capital' && 'CAPITAL_TRAJECTORY'}
                    {activeTab === 'roi' && 'ROI_EXPLOSION'}
                    {activeTab === 'vitality' && 'VITALITY_INDEX'}
                    {activeTab === 'workforce' && 'WORKFORCE_SCALING'}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.03),transparent_70%)] pointer-events-none" />
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer>
                    {activeTab === 'capital' ? (
                      <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#12172a" vertical={false} />
                        <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} />
                        <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: '#1e293b' }} />
                        <Area type="monotone" dataKey="budget" name="budget" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorBudget)" />
                        <Area type="monotone" dataKey="revenue" name="revenue" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    ) : activeTab === 'roi' ? (
                      <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRoi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#12172a" vertical={false} />
                        <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: '#1e293b' }} />
                        <Area type="monotone" dataKey="roi" name="roi" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRoi)" />
                      </AreaChart>
                    ) : activeTab === 'vitality' ? (
                      <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorMorale" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#12172a" vertical={false} />
                        <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} domain={[0, 100]} />
                        <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: '#1e293b' }} />
                        <Area type="monotone" dataKey="morale" name="morale" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorMorale)" />
                      </AreaChart>
                    ) : (
                      <AreaChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorEmp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#12172a" vertical={false} />
                        <XAxis dataKey="year" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <RechartsTooltip content={<ChartTooltip />} cursor={{ stroke: '#1e293b' }} />
                        <Area type="stepAfter" dataKey="employees" name="employees" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorEmp)" />
                      </AreaChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

        </div>

        {/* BOTTOM: STAGGERED MATRIX LOGS */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-3 gap-2 animate-fade-in-up delay-400">
            <h2 className="font-space font-black text-sm tracking-widest text-slate-300 uppercase flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              // OUTCOME ARCHIVAL MATRIX // PROTOCOLS INDEXED
            </h2>
            <span className="text-[10px] font-space text-slate-500 font-bold bg-slate-950 px-2 py-0.5 border border-slate-800 rounded">
              COMPILATION STABLE // {ALL_ENDINGS.filter(e => e.id === achievedEndingId).length}/8 UNLOCKED
            </span>
          </div>

          {/* Outcome Grid Badges (Staggered Entrance Animation) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ALL_ENDINGS.map((ending, index) => {
              const isUnlocked = ending.id === achievedEndingId;
              const EndingIcon = ending.icon;

              return (
                <div 
                  key={ending.id}
                  style={{ animationDelay: `${(index * 100) + 400}ms` }}
                  className={cn(
                    "animate-fade-in-up shimmer-card p-5 rounded-xl border flex flex-col justify-between min-h-[170px] group cursor-default",
                    isUnlocked 
                      ? `${ending.glowClass} ${ending.hoverGlowClass} scale-[1.02] ring-2 ring-cyan-500/15` 
                      : "border-slate-900 bg-slate-950/40 opacity-40 hover:opacity-75 hover:border-slate-800/80 hover:bg-slate-950/60"
                  )}
                >
                  {/* Floating lock/unlock badge icons */}
                  <div className="absolute top-4 right-4 transition-transform duration-300 group-hover:scale-110">
                    {isUnlocked ? (
                      <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-sm animate-ping" />
                        <Unlock className={cn("h-4 w-4 relative z-10", ending.textColor)} />
                      </div>
                    ) : (
                      <Lock className="h-4 w-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
                    )}
                  </div>

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center space-x-2">
                      <EndingIcon className={cn("h-4.5 w-4.5 transition-transform duration-300 group-hover:rotate-12", isUnlocked ? ending.textColor : "text-slate-600")} />
                      <span className={cn(
                        "text-[9px] font-space font-black border px-2 py-0.5 rounded tracking-wide transition-colors", 
                        isUnlocked 
                          ? `${ending.textColor} border-slate-800/80 group-hover:border-slate-700` 
                          : "text-slate-600 border-slate-900/80"
                      )}>
                        {ending.badge}
                      </span>
                    </div>

                    <h3 className={cn(
                      "font-space font-black text-xs tracking-wider transition-colors", 
                      isUnlocked ? "text-slate-100" : "text-slate-600 group-hover:text-slate-400"
                    )}>
                      {ending.title}
                    </h3>
                    
                    <p className="text-[10px] text-slate-400 font-space leading-relaxed transition-colors group-hover:text-slate-300">
                      {isUnlocked ? ending.unlockedMsg : (
                        <div className="mt-1 flex flex-col gap-1.5">
                          <span className="text-slate-500 line-clamp-1">{ending.description}</span>
                          
                          {(() => {
                            let progress = 0;
                            let reqText = '';
                            if (ending.id === 'ai_singularity') {
                              progress = company?.automationRate || 0;
                              reqText = '100% Automation & 100 AI Maturity';
                            } else if (ending.id === 'unicorn_exit') {
                              progress = Math.min(Math.max((state.budget / 3000000) * 100, (state.roi / 150) * 100), 100);
                              reqText = '$3M Budget or 150% ROI';
                            } else if (ending.id === 'ipo_success') {
                              const empProg = Math.min((state.employees / 30) * 100, 100);
                              const budProg = Math.min((state.budget / 2000000) * 100, 100);
                              progress = (empProg + budProg) / 2;
                              reqText = '30+ Employees & $2M Budget';
                            } else if (ending.id === 'megacorp_acquisition') {
                              progress = Math.min(((company?.aiMaturityScore || 0) / 80) * 100, 100);
                              reqText = '80% AI Maturity';
                            } else {
                              progress = ((state.currentYear - 2024) / 11) * 100;
                              reqText = 'Survive till 2035';
                            }

                            return (
                              <div className="flex flex-col gap-1 mt-1 w-full max-w-[80%]">
                                <span className="text-yellow-500/80 font-bold bg-yellow-500/10 px-1 py-0.5 w-fit rounded text-[8px] uppercase tracking-widest">
                                  {`REQ: ${reqText}`}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 h-1 bg-slate-900 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-cyan-500/70 rounded-full transition-all duration-1000"
                                      style={{ width: `${Math.max(progress, 0)}%` }}
                                    />
                                  </div>
                                  <span className="text-cyan-500/70 text-[9px] font-bold">
                                    {Math.max(Math.floor(progress), 0)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })()}

                        </div>
                      )}
                    </p>
                  </div>

                  {isUnlocked && (
                    <div className={cn(
                      "text-[8px] font-space font-black text-right tracking-widest mt-3 uppercase animate-pulse", 
                      ending.textColor
                    )}>
                      [ LOG UNLOCKED ]
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BOTTOM REDIRECT PROTOCOL ACTIONS */}
        <div className="flex justify-center pt-6 border-t border-slate-900 animate-fade-in-up delay-600">
          <Link to="/">
            <Button 
              size="lg" 
              onClick={handleRestart}
              className="py-6 px-10 font-space font-black text-xs tracking-widest bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
            >
              <ArrowLeft className="mr-2.5 h-4.5 w-4.5" />
              TERMINATE TERMINAL // INITIALIZE NEW DECK
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Outcome;
