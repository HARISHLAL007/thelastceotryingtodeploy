import { useGameStore } from '@/store/gameStore';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Trophy, AlertOctagon, RotateCcw, ArrowRight, BarChart2, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAchievedEnding } from '@/lib/endings';

export const GameOverModal = () => {
  const state = useGameStore((s) => s.state);
  const company = useGameStore((s) => s.company);
  const actions = useGameStore((s) => s.actions);
  const navigate = useNavigate();

  if (!state.isGameOver) return null;

  const isVictory = state.gameResult === 'victory';
  const achievedEnding = getAchievedEnding(state, company);
  const EndingIcon = achievedEnding.icon;

  const handleRestart = () => {
    actions.resetGame();
    navigate('/');
  };

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
            <td><div class="dash-label">Enterprise Value</div><div class="dash-val">$${(calculateValuation()/1000000).toFixed(1)}M</div></td>
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
          <div class="scorecard-bar">${renderBar(Math.min(calculateValuation() / 10000000, 100), '#3b82f6')}</div>
          <div class="scorecard-val">${Math.min(calculateValuation() / 10000000, 100).toFixed(0)} / 100</div>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      {/* Background neon pulse glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
        isVictory ? 'bg-yellow-500/10 animate-pulse' : 'bg-rose-500/10 animate-pulse'
      }`} />

      {/* Cyber ambient scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

      <Card className={`max-w-xl w-full cyber-glass relative shadow-2xl overflow-hidden ${
        isVictory 
          ? 'cyber-border-gold shadow-[0_0_50px_rgba(234,179,8,0.2)]' 
          : 'cyber-border-magenta shadow-[0_0_50px_rgba(244,63,94,0.2)]'
      }`}>
        {/* Dynamic flashing top edge line */}
        <div className={`absolute inset-x-0 top-0 h-[3px] ${
          isVictory ? 'bg-gradient-to-r from-transparent via-yellow-400 to-transparent' : 'bg-gradient-to-r from-transparent via-rose-500 to-transparent'
        }`} />

        <CardContent className="p-8 text-center space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="relative inline-block">
              <div className={`absolute inset-0 rounded-full blur-md ${isVictory ? 'bg-yellow-500/20 animate-ping' : 'bg-rose-500/20 animate-pulse'}`} />
              <EndingIcon className={`h-20 w-20 mx-auto ${achievedEnding.textColor} drop-shadow-[0_0_15px_currentColor]`} />
            </div>
            <h1 className={`text-4xl font-black font-space tracking-wider uppercase text-transparent bg-clip-text ${
              isVictory 
                ? 'bg-gradient-to-r from-yellow-400 via-amber-200 to-orange-400 text-glow-gold' 
                : 'bg-gradient-to-r from-rose-500 via-pink-400 to-red-600 text-glow-magenta'
            }`}>
              {achievedEnding.title}
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-space">
              <span className={`font-bold font-space mr-2 ${achievedEnding.textColor}`}>{achievedEnding.badge}</span>
              {achievedEnding.unlockedMsg}
            </p>
          </div>

          {/* Vitals summary HUD grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 font-space">
            
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-900 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">FINAL BUDGET</span>
              <p className={`text-sm font-bold mt-1 ${isVictory ? 'text-green-400' : 'text-rose-400'}`}>
                ${state.budget.toLocaleString()}
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-900 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">FINAL ROI</span>
              <p className="text-sm font-bold text-cyan-400 mt-1">
                {state.roi}%
              </p>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-900 flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 uppercase tracking-widest block">EMPLOYEES</span>
              <p className="text-sm font-bold text-purple-400 mt-1">
                {state.employees}
              </p>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full justify-center flex-wrap">
            
            <Button
              onClick={handleRestart}
              className="py-5 px-6 font-space font-bold text-xs tracking-wider bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-200 hover:text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition-all flex-1"
            >
              <RotateCcw className="h-4 w-4" />
              NEW FOUNDER TICKET //
            </Button>

            <Button
              onClick={() => {
                navigate('/outcome');
              }}
              className={`py-5 px-6 font-space font-black text-xs tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all flex-1 ${
                isVictory 
                  ? 'bg-yellow-500 text-slate-950 hover:bg-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.3)]' 
                  : 'bg-rose-500 text-slate-950 hover:bg-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              }`}
            >
              <BarChart2 className="h-4 w-4" />
              VIEW ANALYTICS GRAPH
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <Button
              onClick={handleDownloadReport}
              className="py-5 px-6 font-space font-bold text-xs tracking-wider bg-cyan-950/50 hover:bg-cyan-900 border border-cyan-800 text-cyan-200 hover:text-white flex items-center justify-center gap-2 hover:scale-[1.02] transition-all sm:col-span-2 w-full"
            >
              <Download className="h-4 w-4" />
              DOWNLOAD REPORT 
            </Button>

          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default GameOverModal;
