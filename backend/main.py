from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import pickle
import os
from google import genai
from google.genai import types

app = FastAPI(title="AI Investment Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and encoders globally
models_path = "../models"
try:
    with open(f"{models_path}/encoders.pkl", "rb") as f:
        encoders = pickle.load(f)
    with open(f"{models_path}/cost_savings_model.pkl", "rb") as f:
        model_cost = pickle.load(f)
    with open(f"{models_path}/revenue_impact_model.pkl", "rb") as f:
        model_rev = pickle.load(f)
    with open(f"{models_path}/productivity_model.pkl", "rb") as f:
        model_prod = pickle.load(f)
except Exception as e:
    print(f"Warning: Models not found or failed to load. Run training scripts first. {e}")

class PredictionInput(BaseModel):
    industry: str
    country: str
    year: int
    ai_investment_usd: float
    ai_adoption_level: float
    automation_rate: float
    employee_ai_training_hours: float
    ai_maturity_score: float
    deployment_count: int

class CopilotInput(BaseModel):
    context: dict
    question: str

@app.post("/predict")
def predict(data: PredictionInput):
    # Encode categorical features
    industry_enc = encoders["industry"].transform([data.industry])[0] if data.industry in encoders["industry"].classes_ else 0
    country_enc = encoders["country"].transform([data.country])[0] if data.country in encoders["country"].classes_ else 0
    
    input_data = pd.DataFrame([{
        "industry": industry_enc,
        "country": country_enc,
        "year": data.year,
        "ai_investment_usd": data.ai_investment_usd,
        "ai_adoption_level": data.ai_adoption_level,
        "automation_rate": data.automation_rate,
        "employee_ai_training_hours": data.employee_ai_training_hours,
        "ai_maturity_score": data.ai_maturity_score,
        "deployment_count": data.deployment_count
    }])
    
    cost_savings = float(model_cost.predict(input_data)[0])
    revenue_impact = float(model_rev.predict(input_data)[0])
    productivity_gain = float(model_prod.predict(input_data)[0])
    
    # ROI calculation
    if data.ai_investment_usd > 0:
        roi = ((cost_savings + revenue_impact) / data.ai_investment_usd) * 100
    else:
        roi = 0.0
        
    # Risk derivation
    if data.ai_maturity_score < 4 and data.ai_investment_usd > 5000000:
        risk = "High"
    elif data.ai_maturity_score >= 7:
        risk = "Low"
    else:
        risk = "Medium"
        
    # Readiness Score
    readiness = min(100, max(0, int(
        (data.ai_maturity_score / 10 * 40) + 
        (data.ai_adoption_level * 30) + 
        (min(data.employee_ai_training_hours, 100) / 100 * 20) + 
        (min(data.deployment_count, 50) / 50 * 10)
    )))
    
    return {
        "cost_savings": cost_savings,
        "revenue_impact": revenue_impact,
        "productivity_gain": productivity_gain,
        "roi": roi,
        "risk": risk,
        "readiness_score": readiness
    }

@app.post("/copilot")
def copilot(data: CopilotInput):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable not set.")
        
    client = genai.Client(api_key=api_key)
    
    system_prompt = f"""You are the AI Investment Copilot, an enterprise AI strategy advisor.
    The user is asking a question about their AI investment strategy. 
    Here is their current data and prediction context:
    {data.context}
    
    Answer their question clearly and professionally based on this data. Keep your answer concise (2-3 short paragraphs max).
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=data.question,
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
            ),
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
