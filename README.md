<h1 align="center">The Last CEO</h1>
<h3 align="center">One CEO. Twenty Years. Infinite Consequences.</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Status-In%20Development-blue" alt="Status" />
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-61DAFB" alt="Frontend" />
  <img src="https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688" alt="Backend" />
  <img src="https://img.shields.io/badge/AI-XGBoost%20%7C%20Gemini-FF6F00" alt="AI" />
</p>

## 📖 Project Overview

**The Last CEO** is an AI-powered business strategy simulation game where players take on the role of a CEO and attempt to successfully lead their company through the AI revolution from 2015 to 2035.

Players make strategic business decisions every quarter, including AI investments, workforce training, automation initiatives, governance improvements, and hiring AI talent. Their decisions directly impact the company's growth, profitability, risk profile, workforce readiness, and long-term survival.

The game combines **Machine Learning**, **Business Simulation**, **Dynamic Event Generation**, and **Generative AI** to create a realistic and engaging boardroom experience where every decision has long-term consequences.

---

## 🎯 Problem Statement

As organizations increasingly adopt Artificial Intelligence, business leaders face complex decisions regarding investments, workforce transformation, automation, governance, and risk management. Poor decisions can result in financial losses, regulatory issues, employee resistance, and failed digital transformation initiatives.

Most existing business simulations either lack realistic AI adoption scenarios or fail to demonstrate the long-term impact of strategic AI decisions.

There is a need for an interactive platform that allows users to experience the challenges of AI transformation, understand the trade-offs involved, and learn how strategic decisions affect organizational success over time.

---

## 💡 Proposed Solution

The Last CEO provides an interactive simulation where players act as CEOs responsible for guiding their companies through AI transformation. The platform combines:

- 🧠 **Machine Learning Models:** Predict business outcomes using historical AI adoption data.
- ⚙️ **Business Rules Engine:** Simulate realistic financial and organizational impacts.
- 🌪️ **Dynamic Event Engine:** Introduce real-world uncertainties such as recessions, regulations, and talent shortages.
- 📊 **Generative AI Reports:** Deliver executive-level insights and recommendations after every quarter.

**Objective:** Successfully navigate technological disruption and survive until 2035 while maximizing company performance.

---

## ✨ Key Features

1. **🏢 Company Creation System:** Select industry, size, budget, and set initial AI maturity.
2. **📈 Executive Dashboard:** Track revenue, ROI, budget, AI maturity, workforce readiness, and risk indicators.
3. **🛠️ Strategic Decision Engine:** Manage AI engineering hires, training, deployment, automation, and governance.
4. **📅 Quarterly Simulation System:** Simulates company evolution quarter by quarter.
5. **🤖 Machine Learning Predictions:** Forecasting for revenue growth and productivity improvement.
6. **🎲 Dynamic Event Generation:** Random events like economic recessions, regulatory changes, and cyber incidents.
7. **⚙️ Business Rules Engine:** Updates budget, ROI, risk, AI maturity, and workforce readiness.
8. **❤️ Survival Score Calculator:** Measures long-term sustainability and company health.
9. **📝 AI-Powered Executive Reports:** Strategic recommendations, risk assessments, and future outlook via LLM.
10. **🏆 Multiple Endings:** AI Industry Leader, High Growth Innovator, Balanced Transformer, Legacy Enterprise, or Bankruptcy.

---

## 🧠 Machine Learning Component

- **Dataset:** Corporate AI Adoption and ROI Dataset (2015–2035)
- **Model:** XGBoost Regression
- **Inputs:** Industry, Company Size, Budget, Current Revenue, AI Maturity, Workforce Readiness, AI Investment, Training Investment, Automation Level, Governance Level, Number of AI Engineers, Current Year.
- **Predictions:** 
  1. Revenue Growth Percentage
  2. Productivity Gain Percentage

These predictions integrate with business rules to update company performance after each quarter.

---

## 🔄 System Workflow

1. **Company Creation:** Player sets up the initial company profile.
2. **Dashboard Initialization:** Displays current KPIs and financial health.
3. **Strategic Decisions:** Player selects AI-related actions for the current quarter.
4. **Feature Engineering:** Decisions and state are formatted for ML models.
5. **Dynamic Event Engine:** Random market and industry events are applied.
6. **Machine Learning Prediction:** XGBoost predicts revenue growth and productivity gain.
7. **Business Rules Processing:** Simulation updates KPIs, risks, and scores.
8. **Company State Update:** New state generated for the quarter.
9. **Survival Score Calculation:** Health and sustainability are assessed.
10. **Company Classification:** Company is categorized into one of several leader/laggard archetypes.
11. **AI Boardroom Report:** LLM generates strategic insights and recommendations.
12. **Dashboard Refresh:** Updated KPIs are visualized.
13. **Repeat Until 2035:** Cycle continues until the company reaches the end or fails.

---

## 🏗️ System Architecture

```mermaid
graph TD;
    A[Player] --> B[React Frontend]
    B --> C[Zustand State Management]
    C --> D[Axios API Call]
    D --> E[FastAPI Backend]
    E --> F[Feature Engineering]
    F --> G[Dynamic Event Engine]
    G --> H[XGBoost Models]
    H -->|Revenue Prediction| I[Business Rules Engine]
    H -->|Productivity Prediction| I
    I --> J[Updated Company State]
    J --> K[Survival Score Calculator]
    K --> L[Company Classification]
    L --> M[Gemini + LangChain Executive Report]
    M --> N[Dashboard Update]
    N --> O[Next Quarter Simulation]
```

---

## 💻 Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%2320232a.svg?style=for-the-badge&logo=react)
![Recharts](https://img.shields.io/badge/recharts-%2322b5bf.svg?style=for-the-badge&logo=recharts&logoColor=white)

### Backend
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

### Machine Learning
![XGBoost](https://img.shields.io/badge/xgboost-%232496ED.svg?style=for-the-badge)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)
![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white)

### Generative AI
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![LangChain](https://img.shields.io/badge/langchain-1C3C3C?style=for-the-badge)

### Deployment
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-%2346E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

---

## 🌟 Unique Selling Point

**The Last CEO** is not just a dashboard or prediction model. It combines **business simulation**, **machine learning forecasting**, **dynamic event generation**, **strategic decision-making**, and **AI-generated executive intelligence** into a single interactive experience that challenges players to successfully lead a company through the AI revolution and survive until 2035.
