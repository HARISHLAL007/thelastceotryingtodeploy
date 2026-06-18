from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import pandas as pd
import numpy as np
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from datetime import datetime, timezone

# Load backend/.env (e.g. GROQ_API_KEY) so the AI Advisor works without manual exports.
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env"))
except Exception:
    pass

# Database Setup
SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(os.path.dirname(os.path.abspath(__file__)), 'database.db')}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class PredictionRecord(Base):
    __tablename__ = "predictions"
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    industry = Column(String)
    country = Column(String)
    year = Column(Integer)
    quarter = Column(Integer, nullable=True)
    ai_adoption_level = Column(Float)
    ai_investment_usd = Column(Float)
    automation_rate = Column(Float)
    employee_ai_training_hours = Column(Float)
    ai_maturity_score = Column(Float)
    deployment_count = Column(Integer)
    
    revenue_prediction = Column(Float)
    productivity_prediction = Column(Float)
    roi = Column(Float)
    ai_transformation_score = Column(Float)
    risk_score = Column(Float)
    readiness_level = Column(String)
    board_decision = Column(String)
    recommendation = Column(String)
    player_decision = Column(String, nullable=True)
    player_result = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    # Wildcard origins are incompatible with credentialed requests per the CORS
    # spec, and this API uses no cookies/auth, so credentials stay disabled.
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

import urllib.request
import json

class AdvisorRequest(BaseModel):
    prompt: str

@app.post("/api/advisor")
def get_advisor_insights(req: AdvisorRequest):
    import os
    groq_api_key = os.environ.get("GROQ_API_KEY", "")
    url = "https://api.groq.com/openai/v1/chat/completions"
    data = json.dumps({
        "model": "llama-3.1-8b-instant",
        "messages": [{"role": "user", "content": req.prompt}]
    }).encode("utf-8")
    
    req_obj = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json",
        # Groq sits behind Cloudflare, which 403s the default Python urllib UA (error 1010).
        "User-Agent": "Mozilla/5.0"
    }, method="POST")
    
    try:
        with urllib.request.urlopen(req_obj, timeout=30) as response:
            response_body = response.read()
            return json.loads(response_body)
    except Exception as e:
        return {"error": str(e)}

# Load models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rev_model_path = os.path.join(BASE_DIR, 'models', 'revenue_model.joblib')
prod_model_path = os.path.join(BASE_DIR, 'models', 'productivity_model.joblib')

revenue_package = joblib.load(rev_model_path)
productivity_package = joblib.load(prod_model_path)

revenue_preprocessor = revenue_package['preprocessor']
revenue_model = revenue_package['model']
productivity_preprocessor = productivity_package['preprocessor']
productivity_model = productivity_package['model']

# We removed SHAP explainer to fit within Vercel's 500MB limit.
# Feature importance will be derived directly from the model instead.
# Human-readable labels for the model's features (raw + engineered).
FEATURE_LABELS = {
    "year": "Year",
    "ai_adoption_level": "AI Adoption",
    "ai_investment_usd": "AI Investment",
    "automation_rate": "Automation",
    "employee_ai_training_hours": "Training Hours",
    "ai_maturity_score": "AI Maturity",
    "deployment_count": "Deployments",
    "investment_per_deployment": "Investment / Deployment",
    "training_per_deployment": "Training / Deployment",
    "investment_maturity": "Investment x Maturity",
    "automation_maturity": "Automation x Maturity",
    "training_adoption": "Training x Adoption",
    "investment_training": "Investment x Training",
    "automation_investment": "Automation x Investment",
    "deployment_training": "Deployment x Training",
}

class PredictionRequest(BaseModel):
    industry: str = "Technology"
    country: str = "United States"
    year: int = 2026
    quarter: int = 1
    ai_adoption_level: float = 3.5
    ai_investment_usd: float = 5000000.0
    automation_rate: float = 45.0
    employee_ai_training_hours: float = 120.0
    ai_maturity_score: float = 75.0
    deployment_count: int = 10
    save_to_db: bool = False
    player_decision: Optional[str] = None
    player_result: Optional[str] = None

def engineer_features(df):
    df["investment_per_deployment"] = df["ai_investment_usd"] / (df["deployment_count"]+1)
    df["training_per_deployment"] = df["employee_ai_training_hours"] / (df["deployment_count"]+1)
    df["investment_maturity"] = df["ai_investment_usd"] * df["ai_maturity_score"]
    df["automation_maturity"] = df["automation_rate"] * df["ai_maturity_score"]
    df["training_adoption"] = df["employee_ai_training_hours"] * df["ai_adoption_level"]
    
    # New interaction features required by the tuned Revenue Model
    df["investment_training"] = df["ai_investment_usd"] * df["employee_ai_training_hours"]
    df["automation_investment"] = df["automation_rate"] * df["ai_investment_usd"]
    df["deployment_training"] = df["deployment_count"] * df["employee_ai_training_hours"]
    
    return df

def build_model_frame(sample_data, investment_multiplier=1.0):
    """Convert raw UI-scale inputs to the model's training distribution, then engineer features.

    The models were trained on a dataset that stores NORMALIZED values:
      ai_adoption_level : 0-1   (UI sends 0-5)
      automation_rate   : 0-1   (UI sends 0-100)
      ai_maturity_score : 0-10  (UI sends 0-100)
    Feeding the raw UI scales puts inputs far outside the training range and
    produces extrapolated (meaningless) predictions, so we rescale here before
    inference. These ratios mirror the normalization already used when the API
    appends rows back to the CSV.
    """
    df = pd.DataFrame([sample_data])
    df["ai_investment_usd"] = df["ai_investment_usd"] * investment_multiplier
    df["ai_adoption_level"] = df["ai_adoption_level"] / 5.0
    df["automation_rate"] = df["automation_rate"] / 100.0
    df["ai_maturity_score"] = df["ai_maturity_score"] / 10.0
    return engineer_features(df)

def predict_scenario(sample_data, investment_multiplier):
    df = build_model_frame(sample_data, investment_multiplier)

    X_rev = revenue_preprocessor.transform(df)
    raw_pred = revenue_model.predict(X_rev)[0]
    
    invest = sample_data['ai_investment_usd'] * investment_multiplier
    if invest <= 0:
        invest = 100000.0
        
    # Evaluate decision quality for realistic ROI
    maturity = sample_data['ai_maturity_score'] / 100.0
    automation = sample_data['automation_rate'] / 100.0
    adoption = sample_data['ai_adoption_level'] / 5.0
    training = min(1.0, sample_data['employee_ai_training_hours'] / 200.0)
    
    quality_score = (maturity * 0.3) + (automation * 0.3) + (adoption * 0.2) + (training * 0.2)
    
    if maturity > 0.5:
        quality_score += (investment_multiplier - 1.0) * 0.1
    else:
        quality_score -= (investment_multiplier - 1.0) * 0.1
        
    if quality_score > 0.75:
        roi = 45.0 + (quality_score - 0.75) * 140.0
    elif quality_score > 0.55:
        roi = 25.0 + (quality_score - 0.55) * 100.0
    elif quality_score > 0.35:
        roi = 10.0 + (quality_score - 0.35) * 75.0
    elif quality_score > 0.15:
        roi = 0.0 + (quality_score - 0.15) * 50.0
    else:
        roi = -25.0 + quality_score * 100.0
        
    # Use ML output to jitter the final result
    noise = (raw_pred % 15.0) - 7.5
    roi += noise
    
    roi = max(-50.0, min(85.0, roi))
    
    quarterly_rev = invest * (1.0 + (roi / 100.0))
    
    return float(quarterly_rev), float(roi)

def process_prediction(request: PredictionRequest):
    req_dict = request.dict()
    
    # Normalize to the training distribution (same as the revenue path) before inference.
    df_sample = build_model_frame(req_dict, 1.0)

    # Predict Productivity
    X_prod = productivity_preprocessor.transform(df_sample)
    prod_gain = float(productivity_model.predict(X_prod)[0]) * 100
    
    # Predict Scenarios
    rev_A, roi_A = predict_scenario(req_dict, 1.0)
    rev_B, roi_B = predict_scenario(req_dict, 1.2)
    rev_C, roi_C = predict_scenario(req_dict, 1.5)
    
    # Metrics calculation
    scaled_adoption = (request.ai_adoption_level / 5.0) * 100
    scaled_deployment = min(100.0, request.deployment_count * 2.0)
    scaled_training = min(100.0, request.employee_ai_training_hours / 2.0)
    
    transform_score = (0.30 * request.ai_maturity_score) + (0.25 * request.automation_rate) + (0.20 * scaled_adoption) + (0.15 * scaled_training) + (0.10 * scaled_deployment)
    transform_score = min(100.0, max(0.0, transform_score))
    
    if transform_score >= 71:
        readiness_level = "HIGH"
        risk_percentage = max(5.0, 100.0 - transform_score)
    elif transform_score >= 41:
        readiness_level = "MEDIUM"
        risk_percentage = 100.0 - transform_score
    else:
        readiness_level = "LOW"
        risk_percentage = min(95.0, 120.0 - transform_score)
        
    if roi_C > roi_A and roi_B > roi_A:
        recommendation = f"[{readiness_level} technical readiness] The organization demonstrates strong growth potential. Continue enterprise-wide deployment and invest heavily in advanced automation."
        board_decision = "AI READY (PROCEED)"
    elif roi_B > roi_A:
        recommendation = f"[{readiness_level} technical readiness] Moderate growth detected. Proceed with cautious expansion (+20%). Pushing to +50% shows diminishing returns."
        board_decision = "PROCEED WITH CAUTION"
    else:
        recommendation = f"[{readiness_level} technical readiness] Current financial indicators suggest delaying aggressive expansion until ROI stabilizes. Additional capital investment currently shows diminishing returns."
        if readiness_level == "HIGH":
            board_decision = "FINANCIALLY UNSTABLE"
        else:
            board_decision = "DELAY EXPANSION"
        
    return {
        "metrics": {
            "revenue_impact": rev_A,
            "productivity_gain": prod_gain,
            "roi": roi_A,
            "ai_transformation_score": transform_score,
            "risk_score": risk_percentage,
            "readiness_level": readiness_level,
            "board_decision": board_decision,
            "recommendation": recommendation
        },
        "scenarios": {
            "A": {"multiplier": 1.0, "revenue": rev_A, "roi": roi_A},
            "B": {"multiplier": 1.2, "revenue": rev_B, "roi": roi_B},
            "C": {"multiplier": 1.5, "revenue": rev_C, "roi": roi_C}
        }
    }

def explain_prediction(request: PredictionRequest, top_n: int = 7):
    """Per-prediction explanation using XGBoost global feature importances.

    Replaces the heavy SHAP dependency to keep the Vercel bundle < 500MB.
    Returns the top feature contributions (in quarterly $) so the UI can show
    *why* the model forecast what it did. One-hot industry/country columns are
    aggregated back into single "Industry"/"Country" buckets.
    """
    import scipy.sparse

    df = build_model_frame(request.dict(), 1.0)
    X = revenue_preprocessor.transform(df)
    X_dense = X.toarray() if scipy.sparse.issparse(X) else np.asarray(X)

    names = list(revenue_preprocessor.get_feature_names_out())
    annual_rev = float(revenue_model.predict(X_dense)[0])
    
    # Base value is approximately the average prediction of the model
    base_value = 10000000.0 
    diff = annual_rev - base_value
    
    # Use global feature importances from the XGBoost model
    importances = revenue_model.feature_importances_

    buckets = {}
    for name, imp, val in zip(names, importances, X_dense[0]):
        raw = name.split("__", 1)[-1]
        if raw.startswith("industry_"):
            label = "Industry"
        elif raw.startswith("country_"):
            label = "Country"
        else:
            label = FEATURE_LABELS.get(raw, raw)
            
        impact_score = imp * abs(val) if val != 0 else 0
        buckets[label] = buckets.get(label, 0.0) + impact_score

    total_score = sum(buckets.values())
    if total_score > 0:
        for k in buckets:
            buckets[k] = (buckets[k] / total_score) * diff
    else:
        buckets["AI Investment"] = diff
        
    contributions = [{"feature": k, "impact": round(v / 4.0, 2)} for k, v in buckets.items()]
    contributions.sort(key=lambda c: abs(c["impact"]), reverse=True)

    return {
        "base_value": round(base_value / 4.0, 2),
        "prediction": round(annual_rev / 4.0, 2),
        "contributions": contributions[:top_n],
    }

@app.post("/api/explain")
def explain(request: PredictionRequest):
    return explain_prediction(request)

@app.post("/api/predict")
def predict(request: PredictionRequest, db: Session = Depends(get_db)):
    result = process_prediction(request)
    
    if request.save_to_db:
        db_record = PredictionRecord(
            industry=request.industry,
            country=request.country,
            year=request.year,
            quarter=request.quarter,
            ai_adoption_level=request.ai_adoption_level,
            ai_investment_usd=request.ai_investment_usd,
            automation_rate=request.automation_rate,
            employee_ai_training_hours=request.employee_ai_training_hours,
            ai_maturity_score=request.ai_maturity_score,
            deployment_count=request.deployment_count,
            revenue_prediction=result["metrics"]["revenue_impact"],
            productivity_prediction=result["metrics"]["productivity_gain"],
            roi=result["metrics"]["roi"],
            ai_transformation_score=result["metrics"]["ai_transformation_score"],
            risk_score=result["metrics"]["risk_score"],
            readiness_level=result["metrics"]["readiness_level"],
            board_decision=result["metrics"]["board_decision"],
            recommendation=result["metrics"]["recommendation"],
            player_decision=request.player_decision,
            player_result=request.player_result
        )
        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        # NOTE: Predictions are persisted to the SQLite ledger above only.
        # We intentionally do NOT append model predictions back into
        # corporate_ai_adoption_dataset.csv — that training file is ground
        # truth, and writing the model's own (fabricated) outputs into it would
        # contaminate any future retraining with a self-reinforcing feedback loop.

    return result

class GameHistoryRequest(BaseModel):
    history: list[PredictionRequest]

@app.post("/api/save_game_history")
def save_game_history(request: GameHistoryRequest, db: Session = Depends(get_db)):
    for req in request.history:
        result = process_prediction(req)
        db_record = PredictionRecord(
            industry=req.industry,
            country=req.country,
            year=req.year,
            quarter=req.quarter,
            ai_adoption_level=req.ai_adoption_level,
            ai_investment_usd=req.ai_investment_usd,
            automation_rate=req.automation_rate,
            employee_ai_training_hours=req.employee_ai_training_hours,
            ai_maturity_score=req.ai_maturity_score,
            deployment_count=req.deployment_count,
            revenue_prediction=result["metrics"]["revenue_impact"],
            productivity_prediction=result["metrics"]["productivity_gain"],
            roi=result["metrics"]["roi"],
            ai_transformation_score=result["metrics"]["ai_transformation_score"],
            risk_score=result["metrics"]["risk_score"],
            readiness_level=result["metrics"]["readiness_level"],
            board_decision=result["metrics"]["board_decision"],
            recommendation=result["metrics"]["recommendation"],
            player_decision=req.player_decision,
            player_result=req.player_result
        )
        db.add(db_record)
    db.commit()
    return {"status": "success", "saved_records": len(request.history)}

@app.get("/api/predictions")
def get_predictions(db: Session = Depends(get_db)):
    records = db.query(PredictionRecord).order_by(PredictionRecord.timestamp.desc()).limit(50).all()
    return {"predictions": records}

class AuthLogRequest(BaseModel):
    action: str
    name: str
    email: str
    company: str = ""
    country: str = ""
    industry: str = ""

@app.post("/api/auth/log")
def log_auth_to_excel(req: AuthLogRequest):
    root_dir = BASE_DIR
    file_path = os.path.join(root_dir, "CEO_Registry.csv")
    file_exists = os.path.isfile(file_path)
    
    import csv
    try:
        with open(file_path, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(["Timestamp", "Action", "Name", "Email", "Company", "Country", "Industry"])
            timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
            writer.writerow([timestamp, req.action, req.name, req.email, req.company, req.country, req.industry])
        return {"status": "success"}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    # Bind to the platform-provided $PORT on deploy (Render/Railway/etc.); default 8000 locally.
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
    # Trigger uvicorn reload
