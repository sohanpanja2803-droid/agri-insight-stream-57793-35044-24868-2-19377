from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import json
import random
import os
import math
import pickle
import numpy as np
from flask_cors import CORS
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, classification_report
import pandas as pd

app = Flask(__name__)
CORS(app)

# File paths for data storage (use absolute paths relative to this script)
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BACKEND_DIR, 'data')
USERS_FILE = os.path.join(DATA_DIR, 'users.json')
EMAILS_FILE = os.path.join(DATA_DIR, 'emails.txt')
AI_TRAINING_FILE = os.path.join(DATA_DIR, 'ai_training_data.json')
AI_MODEL_FILE = os.path.join(DATA_DIR, 'ai_model.pkl')
AI_SCALER_FILE = os.path.join(DATA_DIR, 'ai_scaler.pkl')
MODEL_ACCURACY_FILE = os.path.join(DATA_DIR, 'model_accuracy.txt')

# Ensure data directory exists
os.makedirs(DATA_DIR, exist_ok=True)
print(f"Data directory: {DATA_DIR}")  # Debug log to confirm path

# Initialize file-based storage
def load_users():
    """Load users from JSON file"""
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_users(users_data):
    """Save users to JSON file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users_data, f, indent=2)

def load_emails():
    """Load emails from text file"""
    if os.path.exists(EMAILS_FILE):
        with open(EMAILS_FILE, 'r') as f:
            return [line.strip() for line in f.readlines() if line.strip()]
    return []

def save_email(email):
    """Append email to text file"""
    with open(EMAILS_FILE, 'a') as f:
        f.write(email + '\n')

def load_ai_training_data():
    """Load AI training data from JSON file"""
    if os.path.exists(AI_TRAINING_FILE):
        try:
            with open(AI_TRAINING_FILE, 'r') as f:
                return json.load(f)
        except:
            return []
    return []

def save_ai_training_data(training_data):
    """Save AI training data to JSON file"""
    with open(AI_TRAINING_FILE, 'w') as f:
        json.dump(training_data, f, indent=2)

def load_ai_model():
    """Load AI model and scaler from pickle files"""
    model = None
    scaler = None
    accuracy = 0.0
    
    if os.path.exists(AI_MODEL_FILE):
        try:
            with open(AI_MODEL_FILE, 'rb') as f:
                model = pickle.load(f)
        except:
            pass
    
    if os.path.exists(AI_SCALER_FILE):
        try:
            with open(AI_SCALER_FILE, 'rb') as f:
                scaler = pickle.load(f)
        except:
            pass
    
    if os.path.exists(MODEL_ACCURACY_FILE):
        try:
            with open(MODEL_ACCURACY_FILE, 'r') as f:
                accuracy = float(f.read().strip())
        except:
            pass
    
    return model, scaler, accuracy

def save_ai_model(model, scaler, accuracy):
    """Save AI model and scaler to pickle files"""
    if model is not None:
        with open(AI_MODEL_FILE, 'wb') as f:
            pickle.dump(model, f)
    
    if scaler is not None:
        with open(AI_SCALER_FILE, 'wb') as f:
            pickle.dump(scaler, f)
    
    with open(MODEL_ACCURACY_FILE, 'w') as f:
        f.write(str(accuracy))

# Load data on startup
users = load_users()
ai_training_data = load_ai_training_data()
ai_model, model_scaler, model_accuracy = load_ai_model()

# Real-world agricultural data from India
agricultural_data = [
    # Rice data from Uttar Pradesh
    {"year": 2018, "crop": "Rice", "state": "Uttar Pradesh", "area": 5.81, "production": 13.28, "yield": 2283, "nitrogen": 120, "phosphorus": 25, "potassium": 25, "base_price": 18.2, "price_volatility": 0.27},
    {"year": 2019, "crop": "Rice", "state": "Uttar Pradesh", "area": 5.99, "production": 13.62, "yield": 2295, "nitrogen": 120, "phosphorus": 25, "potassium": 25, "base_price": 18.5, "price_volatility": 0.28},
    {"year": 2020, "crop": "Rice", "state": "Uttar Pradesh", "area": 6.07, "production": 14.05, "yield": 2311, "nitrogen": 120, "phosphorus": 25, "potassium": 25, "base_price": 19.0, "price_volatility": 0.29},
    {"year": 2021, "crop": "Rice", "state": "Uttar Pradesh", "area": 6.14, "production": 14.50, "yield": 2322, "nitrogen": 120, "phosphorus": 25, "potassium": 25, "base_price": 20.0, "price_volatility": 0.31},
    {"year": 2022, "crop": "Rice", "state": "Uttar Pradesh", "area": 6.21, "production": 14.69, "yield": 2335, "nitrogen": 120, "phosphorus": 25, "potassium": 25, "base_price": 21.0, "price_volatility": 0.32},
    
    # Wheat data from Punjab
    {"year": 2018, "crop": "Wheat", "state": "Punjab", "area": 3.50, "production": 11.35, "yield": 4704, "nitrogen": 90, "phosphorus": 30, "potassium": 35, "base_price": 20.8, "price_volatility": 0.24},
    {"year": 2019, "crop": "Wheat", "state": "Punjab", "area": 3.50, "production": 11.35, "yield": 4704, "nitrogen": 90, "phosphorus": 30, "potassium": 35, "base_price": 21.0, "price_volatility": 0.25},
    {"year": 2020, "crop": "Wheat", "state": "Punjab", "area": 3.51, "production": 11.86, "yield": 5090, "nitrogen": 90, "phosphorus": 30, "potassium": 35, "base_price": 21.5, "price_volatility": 0.26},
    {"year": 2021, "crop": "Wheat", "state": "Punjab", "area": 3.52, "production": 12.05, "yield": 5100, "nitrogen": 90, "phosphorus": 30, "potassium": 35, "base_price": 22.0, "price_volatility": 0.27},
    {"year": 2022, "crop": "Wheat", "state": "Punjab", "area": 3.53, "production": 12.10, "yield": 5110, "nitrogen": 90, "phosphorus": 30, "potassium": 35, "base_price": 22.3, "price_volatility": 0.28},
    
    # Maize data from Karnataka
    {"year": 2018, "crop": "Maize", "state": "Karnataka", "area": 1.29, "production": 13.60, "yield": 2755, "nitrogen": 100, "phosphorus": 24, "potassium": 23, "base_price": 17.0, "price_volatility": 0.30},
    {"year": 2019, "crop": "Maize", "state": "Karnataka", "area": 1.37, "production": 14.22, "yield": 2419, "nitrogen": 100, "phosphorus": 24, "potassium": 23, "base_price": 17.5, "price_volatility": 0.32},
    {"year": 2020, "crop": "Maize", "state": "Karnataka", "area": 1.37, "production": 14.22, "yield": 2419, "nitrogen": 100, "phosphorus": 24, "potassium": 23, "base_price": 18.0, "price_volatility": 0.33},
    {"year": 2021, "crop": "Maize", "state": "Karnataka", "area": 1.39, "production": 14.55, "yield": 2555, "nitrogen": 100, "phosphorus": 24, "potassium": 23, "base_price": 18.2, "price_volatility": 0.34},
    
    # Groundnut data from Gujarat
    {"year": 2018, "crop": "Groundnut", "state": "Gujarat", "area": 1.76, "production": 32.95, "yield": 1795, "nitrogen": 30, "phosphorus": 20, "potassium": 25, "base_price": 47.0, "price_volatility": 0.28},
    {"year": 2019, "crop": "Groundnut", "state": "Gujarat", "area": 1.76, "production": 32.95, "yield": 1795, "nitrogen": 30, "phosphorus": 20, "potassium": 25, "base_price": 48.9, "price_volatility": 0.29},
    {"year": 2020, "crop": "Groundnut", "state": "Gujarat", "area": 1.68, "production": 34.18, "yield": 2343, "nitrogen": 30, "phosphorus": 20, "potassium": 25, "base_price": 50.1, "price_volatility": 0.30},
    {"year": 2021, "crop": "Groundnut", "state": "Gujarat", "area": 1.69, "production": 34.50, "yield": 2367, "nitrogen": 30, "phosphorus": 20, "potassium": 25, "base_price": 51.6, "price_volatility": 0.32},
    
    # Cotton data from Maharashtra
    {"year": 2018, "crop": "Cotton", "state": "Maharashtra", "area": 4.49, "production": 33.32, "yield": 251, "nitrogen": 80, "phosphorus": 22, "potassium": 44, "base_price": 50.2, "price_volatility": 0.31},
    {"year": 2019, "crop": "Cotton", "state": "Maharashtra", "area": 4.49, "production": 33.32, "yield": 251, "nitrogen": 80, "phosphorus": 22, "potassium": 44, "base_price": 51.2, "price_volatility": 0.32},
    {"year": 2020, "crop": "Cotton", "state": "Maharashtra", "area": 4.29, "production": 32.95, "yield": 380, "nitrogen": 80, "phosphorus": 22, "potassium": 44, "base_price": 51.5, "price_volatility": 0.33},
    {"year": 2021, "crop": "Cotton", "state": "Maharashtra", "area": 4.35, "production": 32.99, "yield": 385, "nitrogen": 80, "phosphorus": 22, "potassium": 44, "base_price": 52.1, "price_volatility": 0.34}
]
# Enhanced crops database with real-world data
crops = [
    {
        'name': 'Rice',
        'moisture_min': 80, 'moisture_max': 90,
        'ph_min': 5.0, 'ph_max': 6.5,
        'nitrogen_min': 120,
        'phosphorus_min': 25,
        'potassium_min': 25,
        'base_price': 21.0,  # Updated from real data
        'price_volatility': 0.32,
        'states': ['Uttar Pradesh', 'West Bengal', 'Punjab', 'Bihar'],
        'avg_yield': 2322,  # kg/ha from real data
        'description': 'Staple food crop, high water requirement'
    },
    {
        'name': 'Wheat',
        'moisture_min': 60, 'moisture_max': 70,
        'ph_min': 6.0, 'ph_max': 7.5,
        'nitrogen_min': 90,  # Updated from real data
        'phosphorus_min': 30,
        'potassium_min': 35,  # Updated from real data
        'base_price': 22.3,  # Updated from real data
        'price_volatility': 0.28,
        'states': ['Punjab', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh'],
        'avg_yield': 5110,  # kg/ha from real data
        'description': 'Winter crop, high protein content'
    },
    {
        'name': 'Maize',  # Updated from 'Corn'
        'moisture_min': 65, 'moisture_max': 80,
        'ph_min': 5.5, 'ph_max': 7.0,
        'nitrogen_min': 100,  # Updated from real data
        'phosphorus_min': 24,  # Updated from real data
        'potassium_min': 23,  # Updated from real data
        'base_price': 18.2,  # Updated from real data
        'price_volatility': 0.34,
        'states': ['Karnataka', 'Maharashtra', 'Bihar', 'Rajasthan'],
        'avg_yield': 2555,  # kg/ha from real data
        'description': 'Versatile crop for food and feed'
    },
    {
        'name': 'Groundnut',  # New crop from real data
        'moisture_min': 50, 'moisture_max': 70,
        'ph_min': 6.0, 'ph_max': 7.0,
        'nitrogen_min': 30,  # From real data
        'phosphorus_min': 20,  # From real data
        'potassium_min': 25,  # From real data
        'base_price': 51.6,  # From real data
        'price_volatility': 0.32,
        'states': ['Gujarat', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka'],
        'avg_yield': 2367,  # kg/ha from real data
        'description': 'Oilseed crop, drought tolerant'
    },
    {
        'name': 'Cotton',
        'moisture_min': 50, 'moisture_max': 60,
        'ph_min': 5.8, 'ph_max': 8.0,
        'nitrogen_min': 80,  # Updated from real data
        'phosphorus_min': 22,  # Updated from real data
        'potassium_min': 44,  # Updated from real data
        'base_price': 52.1,  # Updated from real data
        'price_volatility': 0.34,
        'states': ['Maharashtra', 'Gujarat', 'Punjab', 'Haryana'],
        'avg_yield': 385,  # kg/ha from real data
        'description': 'Fiber crop, cash crop'
    },
    {
        'name': 'Soybeans',
        'moisture_min': 60, 'moisture_max': 70,
        'ph_min': 6.0, 'ph_max': 6.8,
        'nitrogen_min': 50,
        'phosphorus_min': 40,
        'potassium_min': 80,
        'base_price': 32.50,
        'price_volatility': 0.35,
        'states': ['Madhya Pradesh', 'Maharashtra', 'Rajasthan'],
        'avg_yield': 1200,
        'description': 'Protein-rich legume crop'
    },
    {
        'name': 'Tea',
        'moisture_min': 70, 'moisture_max': 85,
        'ph_min': 4.5, 'ph_max': 5.5,
        'nitrogen_min': 50,
        'phosphorus_min': 25,
        'potassium_min': 30,
        'base_price': 250.0,
        'price_volatility': 0.2,
        'states': ['Assam', 'West Bengal', 'Tamil Nadu'],
        'avg_yield': 2000,
        'description': 'Beverage crop, plantation crop'
    },
    {
        'name': 'Potatoes',
        'moisture_min': 65, 'moisture_max': 80,
        'ph_min': 5.0, 'ph_max': 6.5,
        'nitrogen_min': 100,
        'phosphorus_min': 50,
        'potassium_min': 100,
        'base_price': 12.35,
        'price_volatility': 0.3,
        'states': ['Uttar Pradesh', 'West Bengal', 'Bihar'],
        'avg_yield': 25000,
        'description': 'Tuber crop, high yield potential'
    },
    {
        'name': 'Tomatoes',
        'moisture_min': 60, 'moisture_max': 80,
        'ph_min': 5.5, 'ph_max': 7.5,
        'nitrogen_min': 80,
        'phosphorus_min': 60,
        'potassium_min': 70,
        'base_price': 25.40,
        'price_volatility': 0.45,
        'states': ['Andhra Pradesh', 'Karnataka', 'Maharashtra'],
        'avg_yield': 35000,
        'description': 'Vegetable crop, high value'
    }
]


def get_crop_recommendations(soil_data):
    """
    Determine suitable crops based on soil parameters
    """
    if not soil_data:
        return []
    
    suitable_crops = []
    for crop in crops:
        score = 0
        if 'moisture' in soil_data:
            moisture = float(soil_data['moisture'])
            if crop['moisture_min'] <= moisture <= crop['moisture_max']:
                score += 30
            elif abs(crop['moisture_min'] - moisture) <= 10 or abs(crop['moisture_max'] - moisture) <= 10:
                score += 15
        if 'ph' in soil_data:
            ph = float(soil_data['ph'])
            if crop['ph_min'] <= ph <= crop['ph_max']:
                score += 20
            elif abs(crop['ph_min'] - ph) <= 0.5 or abs(crop['ph_max'] - ph) <= 0.5:
                score += 10    
        if 'nitrogen' in soil_data and float(soil_data['nitrogen']) >= crop['nitrogen_min']:
            score += 15
        if 'phosphorus' in soil_data and float(soil_data['phosphorus']) >= crop['phosphorus_min']:
            score += 15
        if 'potassium' in soil_data and float(soil_data['potassium']) >= crop['potassium_min']:
            score += 15 
        if score >= 50:  # At least 50% match
            suitable_crops.append({
                'name': crop['name'],
                'suitability_score': score,
                'base_price': crop['base_price']
            })
    suitable_crops.sort(key=lambda x: x['suitability_score'], reverse=True)
    return suitable_crops

def generate_sample_training_data():
    """Generate sample training data for AI model using real agricultural data"""
    sample_data = []
    
    # First, add real agricultural data as training samples
    for data_point in agricultural_data:
        # Add some variation to the real data to create more training samples
        for variation in range(5):  # Create 5 variations of each real data point
            sample_data.append({
                'moisture': data_point['nitrogen'] + random.uniform(-10, 10),  # Use nitrogen as proxy for moisture
                'ph': random.uniform(5.0, 7.5),  # Typical pH range
                'nitrogen': data_point['nitrogen'] + random.uniform(-5, 5),
                'phosphorus': data_point['phosphorus'] + random.uniform(-2, 2),
                'potassium': data_point['potassium'] + random.uniform(-3, 3),
                'crop': data_point['crop'],
                'state': data_point['state'],
                'yield': data_point['yield'],
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'source': 'real_data'
            })
    
    # Generate additional synthetic data based on crop requirements
    crop_names = [crop['name'] for crop in crops]
    
    for _ in range(500):  # Generate 500 additional synthetic records
        # Random soil parameters
        moisture = random.uniform(30, 95)
        ph = random.uniform(4.0, 9.0)
        nitrogen = random.uniform(20, 200)
        phosphorus = random.uniform(10, 100)
        potassium = random.uniform(10, 150)
        
        # Determine best crop based on rules
        best_crop = None
        best_score = 0
        
        for crop in crops:
            score = 0
            if crop['moisture_min'] <= moisture <= crop['moisture_max']:
                score += 30
            elif abs(crop['moisture_min'] - moisture) <= 10 or abs(crop['moisture_max'] - moisture) <= 10:
                score += 15
                
            if crop['ph_min'] <= ph <= crop['ph_max']:
                score += 20
            elif abs(crop['ph_min'] - ph) <= 0.5 or abs(crop['ph_max'] - ph) <= 0.5:
                score += 10
                
            if nitrogen >= crop['nitrogen_min']:
                score += 15
            if phosphorus >= crop['phosphorus_min']:
                score += 15
            if potassium >= crop['potassium_min']:
                score += 15
                
            if score > best_score:
                best_score = score
                best_crop = crop['name']
        
        if best_crop:
            sample_data.append({
                'moisture': moisture,
                'ph': ph,
                'nitrogen': nitrogen,
                'phosphorus': phosphorus,
                'potassium': potassium,
                'crop': best_crop,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                'source': 'synthetic'
            })
    
    return sample_data

def train_ai_model():
    """Train AI model using collected data"""
    global ai_model, model_scaler, model_accuracy
    
    if len(ai_training_data) < 50:
        return {'error': 'Insufficient training data. Need at least 50 samples.'}
    
    try:
        # Convert to DataFrame
        df = pd.DataFrame(ai_training_data)
        
        # Prepare features and target
        features = ['moisture', 'ph', 'nitrogen', 'phosphorus', 'potassium']
        X = df[features]
        y = df['crop']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Scale features
        model_scaler = StandardScaler()
        X_train_scaled = model_scaler.fit_transform(X_train)
        X_test_scaled = model_scaler.transform(X_test)
        
        # Train model
        ai_model = RandomForestClassifier(n_estimators=100, random_state=42)
        ai_model.fit(X_train_scaled, y_train)
        
        # Evaluate model
        y_pred = ai_model.predict(X_test_scaled)
        model_accuracy = accuracy_score(y_test, y_pred)
        
        # Save model to file
        save_ai_model(ai_model, model_scaler, model_accuracy)
        
        return {
            'success': True,
            'accuracy': round(model_accuracy * 100, 2),
            'training_samples': len(ai_training_data),
            'test_samples': len(X_test),
            'model_info': {
                'algorithm': 'Random Forest',
                'features': features,
                'classes': list(y.unique())
            }
        }
    except Exception as e:
        return {'error': f'Model training failed: {str(e)}'}

def ai_crop_prediction(soil_data):
    """Use AI model to predict best crop"""
    global ai_model, model_scaler
    
    if ai_model is None or model_scaler is None:
        return {'error': 'AI model not trained yet'}
    
    try:
        # Prepare input data with proper feature names
        features = ['moisture', 'ph', 'nitrogen', 'phosphorus', 'potassium']
        input_data = pd.DataFrame([[
            float(soil_data.get('moisture', 0)),
            float(soil_data.get('ph', 7)),
            float(soil_data.get('nitrogen', 0)),
            float(soil_data.get('phosphorus', 0)),
            float(soil_data.get('potassium', 0))
        ]], columns=features)
        
        # Scale input
        input_scaled = model_scaler.transform(input_data)
        
        # Predict
        prediction = ai_model.predict(input_scaled)[0]
        probabilities = ai_model.predict_proba(input_scaled)[0]
        classes = ai_model.classes_
        
        # Get top 3 predictions with confidence scores
        top_predictions = []
        for i, prob in enumerate(probabilities):
            top_predictions.append({
                'crop': classes[i],
                'confidence': round(prob * 100, 2)
            })
        
        top_predictions.sort(key=lambda x: x['confidence'], reverse=True)
        
        return {
            'success': True,
            'predicted_crop': prediction,
            'confidence': round(max(probabilities) * 100, 2),
            'top_predictions': top_predictions[:3],
            'model_accuracy': round(model_accuracy * 100, 2)
        }
    except Exception as e:
        return {'error': f'AI prediction failed: {str(e)}'}

def predict_crop_prices(crops_list, location_data=None):
    """
    Predict crop prices based on base price and various factors
    """
    predictions = []
    weather_factor = 1.0
    if location_data:
        if location_data.get('rainfall', 'normal') == 'high':
            weather_factor = 0.9  # Lower prices due to abundant supply
        elif location_data.get('rainfall', 'normal') == 'low':
            weather_factor = 1.1  # Higher prices due to scarcity
        current_month = datetime.now().month
        if 3 <= current_month <= 5:  # Spring
            weather_factor *= 0.95  # Planting season, prices slightly lower
        elif 6 <= current_month <= 8:  # Summer
            weather_factor *= 1.0  # Normal prices
        elif 9 <= current_month <= 11:  # Fall
            weather_factor *= 1.05  # Harvest season, prices fluctuate
        else:  # Winter
            weather_factor *= 1.1  # Off-season, prices higher
    for crop_info in crops_list:
        crop_name = crop_info['name']
        base_price = crop_info['base_price']
        volatility = next((c['price_volatility'] for c in crops if c['name'] == crop_name), 0.3)
        random_factor = random.uniform(1 - volatility, 1 + volatility)
        predicted_price = base_price * weather_factor * random_factor
        price_min = round(predicted_price * 0.95, 2)
        price_max = round(predicted_price * 1.05, 2)
        predictions.append({
            'name': crop_name,
            'price_range': {
                'min': price_min,
                'max': price_max,
                'average': round((price_min + price_max) / 2, 2)
            },
            'price_trend': 'stable' if 0.97 < random_factor < 1.03 else ('increasing' if random_factor >= 1.03 else 'decreasing'),
            'market_factors': {
                'weather_impact': round((weather_factor - 1) * 100, 1),
                'seasonal_effect': 'moderate',
                'supply_status': 'normal' 
            }
        })
    return predictions

@app.route('/api/ai/feed-data', methods=['POST'])
def feed_training_data():
    """API to feed training data to AI model"""
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    required_fields = ['moisture', 'ph', 'nitrogen', 'phosphorus', 'potassium', 'crop']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({
            'error': 'Missing required fields',
            'missing': missing_fields
        }), 400
    
    # Validate crop name
    crop_names = [crop['name'] for crop in crops]
    if data['crop'] not in crop_names:
        return jsonify({
            'error': 'Invalid crop name',
            'valid_crops': crop_names
        }), 400
    
    # Add timestamp and store data
    training_record = {
        'moisture': float(data['moisture']),
        'ph': float(data['ph']),
        'nitrogen': float(data['nitrogen']),
        'phosphorus': float(data['phosphorus']),
        'potassium': float(data['potassium']),
        'crop': data['crop'],
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'source': data.get('source', 'manual')
    }
    
    ai_training_data.append(training_record)
    save_ai_training_data(ai_training_data)
    
    return jsonify({
        'success': True,
        'message': 'Training data added successfully',
        'total_samples': len(ai_training_data)
    })

@app.route('/api/ai/train', methods=['POST'])
def train_model():
    """API to train the AI model"""
    result = train_ai_model()
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@app.route('/api/ai/predict', methods=['POST'])
def ai_predict():
    """API to get AI-powered crop prediction"""
    data = request.json
    if not data:
        return jsonify({'error': 'No soil data provided'}), 400
    
    result = ai_crop_prediction(data)
    
    if 'error' in result:
        return jsonify(result), 400
    
    return jsonify(result)

@app.route('/api/ai/predict-public', methods=['POST'])
def ai_predict_public():
    """Public API to get AI-powered crop prediction (no login required)"""
    data = request.json
    if not data:
        return jsonify({'error': 'No soil data provided'}), 400
    
    # Validate required fields
    required_fields = ['moisture', 'ph']
    missing_fields = [field for field in required_fields if field not in data]
    
    if missing_fields:
        return jsonify({
            'error': 'Missing required soil parameters',
            'missing': missing_fields,
            'required': required_fields
        }), 400
    
    # Set default values for missing optional fields
    soil_data = {
        'moisture': float(data.get('moisture', 0)),
        'ph': float(data.get('ph', 7)),
        'nitrogen': float(data.get('nitrogen', 0)),
        'phosphorus': float(data.get('phosphorus', 0)),
        'potassium': float(data.get('potassium', 0))
    }
    
    # Get both traditional and AI predictions
    traditional_recommendations = get_crop_recommendations(soil_data)
    ai_prediction = ai_crop_prediction(soil_data)
    
    response = {
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'soil_data': soil_data,
        'traditional_recommendations': traditional_recommendations[:5],  # Top 5
        'ai_prediction': ai_prediction,
        'model_status': {
            'trained': ai_model is not None,
            'accuracy': round(model_accuracy * 100, 2) if model_accuracy > 0 else 0,
            'training_samples': len(ai_training_data)
        }
    }
    
    return jsonify(response)

@app.route('/api/ai/status', methods=['GET'])
def ai_status():
    """API to get AI model status and statistics"""
    return jsonify({
        'model_trained': ai_model is not None,
        'model_accuracy': round(model_accuracy * 100, 2) if model_accuracy > 0 else 0,
        'training_samples': len(ai_training_data),
        'model_info': {
            'algorithm': 'Random Forest',
            'features': ['moisture', 'ph', 'nitrogen', 'phosphorus', 'potassium'],
            'last_trained': datetime.now().strftime('%Y-%m-%d %H:%M:%S') if ai_model else None
        }
    })

@app.route('/api/ai/generate-sample-data', methods=['POST'])
def generate_sample_data():
    """API to generate sample training data"""
    sample_data = generate_sample_training_data()
    ai_training_data.extend(sample_data)
    save_ai_training_data(ai_training_data)
    
    return jsonify({
        'success': True,
        'message': f'Generated {len(sample_data)} sample training records',
        'total_samples': len(ai_training_data)
    })

@app.route('/api/ai/training-data', methods=['GET'])
def get_training_data():
    """API to get training data (for debugging/analysis)"""
    return jsonify({
        'training_data': ai_training_data[-100:],  # Return last 100 records
        'total_samples': len(ai_training_data)
    })

@app.route('/api/signup', methods=['POST'])
def signup():
    """API to register a new user with email and start 45-day trial """
    data = request.json
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
    email = data['email']
    if email in users:
        return jsonify({'error': 'Email already registered'}), 400
    trial_start = datetime.now().strftime('%Y-%m-%d')
    trial_end = (datetime.now() + timedelta(days=45)).strftime('%Y-%m-%d')
    users[email] = {
        'email': email,
        'trial_start_date': trial_start,
        'trial_end_date': trial_end,
        'subscription_tier': 'free',
        'is_active': True,
        'registration_date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'soil_data': {},
        'crop_history': []
    }
    save_users(users)
    save_email(email)
    return jsonify({
        'success': True, 
        'message': 'User registered successfully. 45-day trial started.',
        'trial_end_date': trial_end
    }), 201

@app.route('/api/user_data', methods=['POST'])
def store_user_data():
    """API to store all user data in a nested structure"""
    data = request.json
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required for identification'}), 400
    email = data['email']
    if email not in users:
        return jsonify({'error': 'User not found'}), 404
    user_data = users[email]
    
    # Store all provided fields
    if 'fullName' in data:
        user_data['fullName'] = data['fullName']
    if 'phone' in data:
        user_data['phone'] = data['phone']
    if 'farmSize' in data:
        user_data['farmSize'] = data['farmSize']
    if 'cropType' in data:
        user_data['cropType'] = data['cropType']
    if 'location' in data:
        user_data['location'] = data['location']
    
    if 'soil_data' in data:
        user_data['soil_data'] = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            **data['soil_data']
        }
    
    # Update any other provided fields
    for key, value in data.items():
        if key not in ['email', 'soil_data']:
            user_data[key] = value
    
    save_users(users)
    
    return jsonify({
        'success': True, 
        'message': 'User data updated successfully'
    })

@app.route('/api/user/<email>', methods=['GET'])
def get_user(email):
    """API to retrieve a user's data"""
    if email not in users:
        return jsonify({'error': 'User not found'}), 404
    user_data = users[email].copy()
    return jsonify(user_data)

@app.route('/api/user/<email>', methods=['DELETE'])
def delete_user(email):
    """API to delete a user and all their data"""
    if email not in users:
        return jsonify({'error': 'User not found'}), 404
    
    # Remove user from dictionary
    del users[email]
    save_users(users)
    
    return jsonify({
        'success': True,
        'message': 'User and all associated data deleted successfully'
    })

@app.route('/api/user/<email>', methods=['PUT'])
def update_user(email):
    """API to update a user's information"""
    if email not in users:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    for key, value in data.items():
        if key != 'email':
            users[email][key] = value
    
    save_users(users)
    
    return jsonify({
        'success': True,
        'message': 'User data updated successfully'
    })

@app.route('/api/recommendations/<email>', methods=['GET'])
def get_recommendations(email):
    """API to get crop recommendations and price predictions based on soil data"""
    if email not in users:
        return jsonify({'error': 'User not found'}), 404
    
    user_data = users[email]
    soil_data = user_data.get('soil_data', {})
    
    if not soil_data:
        return jsonify({
            'error': 'No soil data available',
            'message': 'Please submit soil data first'
        }), 400
    recommended_crops = get_crop_recommendations(soil_data)
    
    if not recommended_crops:
        return jsonify({
            'message': 'No suitable crops found for your soil parameters',
            'recommendations': []
        })
    
    # Get AI prediction if model is trained
    ai_prediction = None
    if ai_model is not None:
        ai_result = ai_crop_prediction(soil_data)
        if 'success' in ai_result:
            ai_prediction = ai_result
    
    location_data = {
        'region': user_data.get('location', {}).get('region', 'unknown'),
        'rainfall': user_data.get('location', {}).get('rainfall', 'normal'),
        'elevation': user_data.get('location', {}).get('elevation', 'medium')
    }
    price_predictions = predict_crop_prices(recommended_crops, location_data)
    response = {
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'soil_analysis': {
            'moisture_level': soil_data.get('moisture', 'N/A'),
            'ph_level': soil_data.get('ph', 'N/A'),
            'nitrogen': soil_data.get('nitrogen', 'N/A'),
            'phosphorus': soil_data.get('phosphorus', 'N/A'),
            'potassium': soil_data.get('potassium', 'N/A')
        },
        'crop_recommendations': [
            {
                'name': crop['name'],
                'suitability_score': crop['suitability_score'],
                'price_prediction': next((p for p in price_predictions if p['name'] == crop['name']), None)
            } for crop in recommended_crops
        ],
        'ai_prediction': ai_prediction,
        'recommendation_summary': f"Found {len(recommended_crops)} suitable crops for your soil conditions."
    }
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    history_entry = {
        'timestamp': timestamp,
        'soil_data': soil_data,
        'recommendations': [crop['name'] for crop in recommended_crops[:3]]
    }
    
    if 'crop_history' not in user_data:
        user_data['crop_history'] = []
    
    user_data['crop_history'].append(history_entry)
    if len(user_data['crop_history']) > 10:
        user_data['crop_history'] = user_data['crop_history'][-10:]
    
    save_users(users)
    
    return jsonify(response)

@app.route('/api/health', methods=['GET'])
def health_check():
    """API endpoint to check if service is running"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'users_count': len(users),
        'version': '1.0.0'
    })

@app.route('/api/soil-data/<email>', methods=['POST'])
def upload_soil_data(email):
    """API to upload soil data for a specific user"""
    if email not in users:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.json
    if not data:
        return jsonify({'error': 'No soil data provided'}), 400
    required_params = ['moisture', 'ph']
    missing_params = [param for param in required_params if param not in data]
    if missing_params:
        return jsonify({
            'error': 'Missing required soil parameters',
            'missing': missing_params
        }), 400
    users[email]['soil_data'] = {
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        **data
    }
    save_users(users)
    
    recommended_crops = get_crop_recommendations(data)[:3]  # Top 3 recommendations
    
    # Get AI prediction if model is trained
    ai_prediction = None
    if ai_model is not None:
        ai_result = ai_crop_prediction(data)
        if 'success' in ai_result:
            ai_prediction = ai_result
    
    response = {
        'success': True,
        'message': 'Soil data updated successfully',
        'quick_recommendations': [crop['name'] for crop in recommended_crops] if recommended_crops else [],
        'ai_prediction': ai_prediction
    }
    
    return jsonify(response)

from flask import send_from_directory
import os

# Serve React App (production build)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    # Don't intercept API routes
    if path.startswith('api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    
    dist_dir = os.path.join(os.path.dirname(__file__), '..', 'dist')
    
    # Check if dist folder exists
    if not os.path.exists(dist_dir):
        return jsonify({
            'error': 'Frontend not built',
            'message': 'Please run "npm run build" to build the frontend first',
            'api_status': 'Backend API is running on /api/*'
        }), 200
    
    # Serve static files
    if path and os.path.exists(os.path.join(dist_dir, path)):
        return send_from_directory(dist_dir, path)
    else:
        # Serve index.html for all other routes (React Router)
        return send_from_directory(dist_dir, 'index.html')

if __name__ == '__main__':
    print("=" * 60)
    print("FieldSense Backend API Server")
    print("=" * 60)
    print(f"Server running on: http://localhost:5000")
    print(f"API endpoints available at: http://localhost:5000/api/*")
    print(f"Health check: http://localhost:5000/api/health")
    print("")
    print("To serve the frontend:")
    print("1. Build frontend: npm run build")
    print("2. Backend will serve from dist folder")
    print("")
    print("For development:")
    print("- Run frontend: npm run dev (separate terminal)")
    print("- Frontend will be at: http://localhost:5173")
    print("- Backend API at: http://localhost:5000/api")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)