from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import joblib
import pandas as pd
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from datetime import datetime, timezone

# Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./database.db"
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
    annual_rev = revenue_model.predict(X_rev)[0]
    rev_impact = annual_rev / 4.0 # Make it a quarterly revenue for the budget
    
    invest = sample_data['ai_investment_usd'] * investment_multiplier
    
    # Calculate realistic ROI using Annual Revenue vs Total Investment
    raw_roi = ((annual_rev - invest) / invest) * 100 if invest > 0 else 0
    roi = raw_roi # Removed artificial cap to reflect true scale
    
    return float(rev_impact), float(roi)

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
    
    transform_score = (0.30 * request.ai_maturity_score) + (0.25 * request.automation_rate) + (0.20 * scaled_adoption) + (0.15 * scaled_training) + (0.10 * request.deployment_count)
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
        recommendation = "The organization demonstrates strong growth potential. Continue enterprise-wide deployment and invest heavily in advanced automation. Proceed with aggressive capital expansion as higher investment yields significantly greater ROI."
        board_decision = "APPROVE AGGRESSIVE EXPANSION"
    elif roi_B > roi_A:
        recommendation = "Moderate growth detected. Proceed with cautious expansion (+20%). Pushing to +50% shows diminishing returns. Focus on workforce upskilling before massive capital expenditures."
        board_decision = "APPROVE CAUTIOUS EXPANSION"
    else:
        recommendation = "Maintain the current investment strategy. Focus on improving AI maturity, automation efficiency, and workforce training before scaling AI spending further. Additional capital investment currently shows diminishing returns."
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
