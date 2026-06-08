import pandas as pd
import numpy as np
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import pickle
import os

def train_models():
    data_path = "../datasets/processed_data.csv"
    if not os.path.exists(data_path):
        print("Processed data not found. Run prep_data.py first.")
        return
        
    print("Loading processed data...")
    df = pd.read_csv(data_path)
    
    features = [
        "industry", "country", "year", "ai_investment_usd", 
        "ai_adoption_level", "automation_rate", 
        "employee_ai_training_hours", "ai_maturity_score", "deployment_count"
    ]
    
    X = df[features]
    
    # Target 1: Cost Savings
    y_cost = df["cost_savings"]
    # Target 2: Revenue Impact
    y_rev = df["revenue_impact"]
    # Target 3: Productivity Gain
    y_prod = df["productivity_gain"]
    
    # Train-test split (using a single split for all to save time, or we can just train on full data for simplicity since it's a demo, but let's do proper train/test)
    X_train, X_test, y_cost_train, y_cost_test = train_test_split(X, y_cost, test_size=0.2, random_state=42)
    _, _, y_rev_train, y_rev_test = train_test_split(X, y_rev, test_size=0.2, random_state=42)
    _, _, y_prod_train, y_prod_test = train_test_split(X, y_prod, test_size=0.2, random_state=42)
    
    models = {
        "cost_savings_model": (y_cost_train, y_cost_test),
        "revenue_impact_model": (y_rev_train, y_rev_test),
        "productivity_model": (y_prod_train, y_prod_test)
    }
    
    os.makedirs("../models", exist_ok=True)
    
    for model_name, (y_train, y_test) in models.items():
        print(f"\n--- Training {model_name} ---")
        model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42, n_jobs=-1)
        model.fit(X_train, y_train)
        
        preds = model.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        rmse = np.sqrt(mean_squared_error(y_test, preds))
        r2 = r2_score(y_test, preds)
        
        print(f"MAE: {mae:.4f}")
        print(f"RMSE: {rmse:.4f}")
        print(f"R2 Score: {r2:.4f}")
        
        with open(f"../models/{model_name}.pkl", "wb") as f:
            pickle.dump(model, f)
            
    print("\nAll models trained and saved successfully in ../models/")

if __name__ == "__main__":
    train_models()
