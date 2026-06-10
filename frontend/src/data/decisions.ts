export interface GameDecision {
  id: string;
  title: string;
  description: string;
  cost: number;
  roiImpact: number;
  moraleImpact: number;
  employeeGain: number;
  aiMaturityGain: number;
  automationGain: number;
  trainingGain: number;
  deploymentGain: number;
  requiredLevel: number;
  riskLevel: 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_RISK';
}

export const DECISIONS: GameDecision[] = [
  // LEVEL 1: Basics
  {
    id: 'hire-ai-engineers',
    title: 'HIRE_AI_ENGINEERS',
    description: 'Recruit top-tier ML engineers to build internal AI capability.',
    cost: 150000,
    roiImpact: 5,
    moraleImpact: 10,
    employeeGain: 5,
    aiMaturityGain: 5,
    automationGain: 2,
    trainingGain: 0,
    deploymentGain: 1,
    requiredLevel: 1,
    riskLevel: 'LOW_RISK'
  },
  {
    id: 'employee-training',
    title: 'EMPLOYEE_UPSKILL_PROGRAM',
    description: 'Mandatory company-wide AI training to increase adoption and reduce resistance.',
    cost: 50000,
    roiImpact: 8,
    moraleImpact: 15,
    employeeGain: 0,
    aiMaturityGain: 2,
    automationGain: 0,
    trainingGain: 40,
    deploymentGain: 0,
    requiredLevel: 1,
    riskLevel: 'LOW_RISK'
  },
  {
    id: 'cloud-migration',
    title: 'CLOUD_INFRASTRUCTURE_MIGRATION',
    description: 'Move legacy systems to the cloud to prepare for AI integrations.',
    cost: 100000,
    roiImpact: 4,
    moraleImpact: -5,
    employeeGain: 0,
    aiMaturityGain: 4,
    automationGain: 5,
    trainingGain: 0,
    deploymentGain: 0,
    requiredLevel: 1,
    riskLevel: 'LOW_RISK'
  },
  {
    id: 'data-lake',
    title: 'BUILD_ENTERPRISE_DATA_LAKE',
    description: 'Centralize fragmented company data to feed future AI models.',
    cost: 200000,
    roiImpact: 3,
    moraleImpact: 0,
    employeeGain: 2,
    aiMaturityGain: 8,
    automationGain: 0,
    trainingGain: 0,
    deploymentGain: 1,
    requiredLevel: 1,
    riskLevel: 'MEDIUM_RISK'
  },

  // LEVEL 2: Intermediate
  {
    id: 'buy-gpus',
    title: 'ACQUIRE_GPU_CLUSTER',
    description: 'Purchase dedicated H100 hardware for faster internal model training.',
    cost: 1500000,
    roiImpact: -2,
    moraleImpact: 5,
    employeeGain: 2,
    aiMaturityGain: 12,
    automationGain: 5,
    trainingGain: 0,
    deploymentGain: 2,
    requiredLevel: 2,
    riskLevel: 'HIGH_RISK'
  },
  {
    id: 'automate-hr',
    title: 'AUTOMATE_HR_AND_OPS',
    description: 'Deploy RPA and LLMs to automate internal operations and payroll.',
    cost: 500000,
    roiImpact: 15,
    moraleImpact: -20,
    employeeGain: -12,
    aiMaturityGain: 6,
    automationGain: 20,
    trainingGain: 0,
    deploymentGain: 3,
    requiredLevel: 2,
    riskLevel: 'MEDIUM_RISK'
  },
  {
    id: 'ai-marketing',
    title: 'AI_DRIVEN_MARKETING',
    description: 'Deploy predictive AI to optimize ad spend and personalize campaigns.',
    cost: 800000,
    roiImpact: 35,
    moraleImpact: 5,
    employeeGain: 0,
    aiMaturityGain: 5,
    automationGain: 10,
    trainingGain: 0,
    deploymentGain: 2,
    requiredLevel: 2,
    riskLevel: 'MEDIUM_RISK'
  },
  {
    id: 'customer-support-bot',
    title: 'LAUNCH_SUPPORT_CHATBOT',
    description: 'Replace Tier 1 support with a fine-tuned LLM agent.',
    cost: 400000,
    roiImpact: 20,
    moraleImpact: -15,
    employeeGain: -20,
    aiMaturityGain: 10,
    automationGain: 25,
    trainingGain: 0,
    deploymentGain: 4,
    requiredLevel: 2,
    riskLevel: 'HIGH_RISK'
  },

  // LEVEL 3: Advanced
  {
    id: 'launch-ai-search',
    title: 'LAUNCH_AI_PRODUCT_FEATURE',
    description: 'Integrate Generative AI natively into your core product offering.',
    cost: 2500000,
    roiImpact: 60,
    moraleImpact: 20,
    employeeGain: 15,
    aiMaturityGain: 15,
    automationGain: 5,
    trainingGain: 0,
    deploymentGain: 5,
    requiredLevel: 3,
    riskLevel: 'HIGH_RISK'
  },
  {
    id: 'autonomous-agents',
    title: 'DEPLOY_AUTONOMOUS_AGENTS',
    description: 'Unleash AI agents that autonomously execute workflows without human input.',
    cost: 3000000,
    roiImpact: 80,
    moraleImpact: -40, // Fear of replacement
    employeeGain: -45,
    aiMaturityGain: 25,
    automationGain: 40,
    trainingGain: 0,
    deploymentGain: 10,
    requiredLevel: 3,
    riskLevel: 'HIGH_RISK'
  },
  {
    id: 'acquire-ai-startup',
    title: 'ACQUIRE_AI_STARTUP',
    description: 'Buy out a smaller AI lab to absorb their IP and engineering talent instantly.',
    cost: 5000000,
    roiImpact: 45,
    moraleImpact: 15,
    employeeGain: 60,
    aiMaturityGain: 25,
    automationGain: 15,
    trainingGain: 50,
    deploymentGain: 8,
    requiredLevel: 3,
    riskLevel: 'MEDIUM_RISK'
  },
  {
    id: 'ai-board-member',
    title: 'APPOINT_AI_BOARD_MEMBER',
    description: 'Give voting rights to an advanced predictive AI model.',
    cost: 500000,
    roiImpact: 50,
    moraleImpact: -60,
    employeeGain: 0,
    aiMaturityGain: 30,
    automationGain: 10,
    trainingGain: 0,
    deploymentGain: 1,
    requiredLevel: 4, // Max level
    riskLevel: 'HIGH_RISK'
  }
];

export const EVENTS = [
  {
    id: 'competitor-launch',
    title: '🔥 COMPETITOR LAUNCHES AI',
    description: 'A major rival just released an AI Copilot. The board is nervous, and market share is slipping.',
    impact: { morale: -20, roi: -15, budget: -500000, revenue: -1500000 }
  },
  {
    id: 'gpu-shortage',
    title: '⚡ GLOBAL GPU SHORTAGE',
    description: 'Hardware prices spiked 300%. Compute resources are limited, halting R&D.',
    impact: { morale: -10, roi: -10, budget: -1000000, revenue: 0 }
  },
  {
    id: 'open-source-release',
    title: '🤖 OPEN SOURCE BREAKTHROUGH',
    description: 'A massive open-source model was released for free, radically reducing R&D compute costs.',
    impact: { morale: 25, roi: 30, budget: 1500000, revenue: 500000 }
  },
  {
    id: 'regulation',
    title: '🏛 NEW EU AI ACT ENFORCED',
    description: 'Strict new data privacy laws demand massive compliance overhauls across all data lakes.',
    impact: { morale: -15, roi: -5, budget: -2000000, revenue: -500000 }
  },
  {
    id: 'data-breach',
    title: '🛡 CYBERATTACK DETECTED',
    description: 'Hackers targeted your autonomous agent API. Emergency protocols engaged. Brand damage is severe.',
    impact: { morale: -35, roi: -25, budget: -3000000, revenue: -4000000 }
  },
  {
    id: 'viral-marketing',
    title: '📈 AI PRODUCT GOES VIRAL',
    description: 'Your recent generative AI product went viral on social media! Massive influx of enterprise contracts.',
    impact: { morale: 40, roi: 50, budget: 2500000, revenue: 8000000 }
  },
  {
    id: 'union-strike',
    title: '✊ WORKFORCE STRIKE',
    description: 'Employees are protesting rapid automation. Operations have ground to a halt.',
    impact: { morale: -50, roi: -20, budget: -500000, revenue: -2000000 }
  },
  {
    id: 'megacorp-partnership',
    title: '🤝 MEGACORP PARTNERSHIP',
    description: 'A trillion-dollar tech giant agreed to co-develop models with your team.',
    impact: { morale: 30, roi: 40, budget: 5000000, revenue: 3000000 }
  }
];
