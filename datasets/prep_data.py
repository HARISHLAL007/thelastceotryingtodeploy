import pandas as pd
import numpy as np
import pickle
import os
from sklearn.preprocessing import LabelEncoder

def prep_data():
    dataset_path = "../corporate_ai_adoption_dataset.csv"
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}")
        return
    
    print("Loading dataset...")
    df = pd.read_csv(dataset_path)
    
    # Features & Targets as specified
    features = [
        "industry", "country", "year", "ai_investment_usd", 
        "ai_adoption_level", "automation_rate", 
        "employee_ai_training_hours", "ai_maturity_score", "deployment_count"
    ]
    targets = ["cost_savings", "revenue_impact", "productivity_gain"]
    
    df_selected = df[features + targets].copy()
    
    # Drop NaNs if any
    df_selected.dropna(inplace=True)
    
    # Encode categorical features
    print("Encoding categorical features...")
    encoders = {}
    for col in ["industry", "country"]:
        le = LabelEncoder()
        df_selected[col] = le.fit_transform(df_selected[col].astype(str))
        encoders[col] = le
        
    # Save encoders for the backend API
    os.makedirs("../models", exist_ok=True)
    with open("../models/encoders.pkl", "wb") as f:
        pickle.dump(encoders, f)
        
    # Save processed data
    output_path = "processed_data.csv"
    df_selected.to_csv(output_path, index=False)
    print(f"Processed dataset saved to {output_path}")
    print(f"Data shape: {df_selected.shape}")

if __name__ == "__main__":
    prep_data()
