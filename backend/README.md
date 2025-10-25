# FieldSense Backend API Server

An intelligent agricultural solution backend with crop recommendations, AI predictions, and user management.

## 🚀 Features

### 🤖 AI-Powered Crop Prediction
- **Machine Learning Model**: Random Forest Classifier for crop prediction
- **Real-time Predictions**: Get AI-powered crop recommendations with confidence scores
- **Model Accuracy Tracking**: Monitor model performance and accuracy metrics

### 📊 Data Management
- **File-based Storage**: User data, soil data, and AI training data stored in JSON files
- **Training Data Collection**: Feed real-world soil data and crop outcomes to train the AI
- **Multiple Data Sources**: Support for manual entry, IoT sensors, lab analysis, and farmer reports

### 🔒 User Management
- User registration and profile management
- Soil data tracking per user
- Trial period management

## 🛠️ Setup

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## 🚀 Running the Backend

### Development Mode

Run the backend server:
```bash
python app.py
```

The server will start on `http://localhost:5000`

You'll see helpful information about:
- Server URL
- API endpoints
- How to integrate with frontend

### Integration with Frontend

#### Option 1: Separate Development Servers (Recommended for Development)

1. **Run backend** (Terminal 1):
```bash
cd backend
python app.py
```
Backend API: `http://localhost:5000/api/*`

2. **Run frontend** (Terminal 2):
```bash
npm run dev
```
Frontend: `http://localhost:5173`

The frontend will automatically connect to the backend API.

#### Option 2: Backend Serves Frontend (Production Mode)

1. **Build the frontend**:
```bash
npm run build
```

2. **Run backend**:
```bash
cd backend
python app.py
```

The backend will serve both the API and the built frontend at `http://localhost:5000`

## 📋 API Endpoints

All API endpoints are prefixed with `/api`:

### User Management
- `POST /api/signup` - User signup with email
- `GET /api/user/<email>` - Get user profile data
- `PUT /api/user/<email>` - Update user profile
- `POST /api/user_data` - Store complete user data (from sign-up form)

### Soil Data & Recommendations
- `POST /api/soil-data/<email>` - Upload soil data for user
- `GET /api/recommendations/<email>` - Get crop recommendations (includes AI predictions)

### AI Model Management
- `GET /api/ai/status` - Check AI model training status and accuracy
- `POST /api/ai/train` - Train the AI model with collected data
- `POST /api/ai/predict-public` - Get AI crop predictions (no auth required)
- `POST /api/ai/feed-data` - Add training data to the AI model
- `POST /api/ai/generate-sample-data` - Generate synthetic training data

### Health Check
- `GET /api/health` - Check if backend is running

## 🔬 API Usage Examples

### Test Backend Health
```bash
curl http://localhost:5000/api/health
```

### User Signup
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "farmer@example.com"}'
```

### Store Complete User Data
```bash
curl -X POST http://localhost:5000/api/user_data \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "fullName": "John Farmer",
    "location": "Punjab, India",
    "farmSize": "10",
    "cropType": "Wheat",
    "phone": "+91-9876543210"
  }'
```

### Upload Soil Data
```bash
curl -X POST http://localhost:5000/api/soil-data/farmer@example.com \
  -H "Content-Type: application/json" \
  -d '{
    "moisture": 70,
    "ph": 6.5,
    "nitrogen": 120,
    "phosphorus": 30,
    "potassium": 35
  }'
```

### Get Crop Recommendations
```bash
curl http://localhost:5000/api/recommendations/farmer@example.com
```

### Check AI Status
```bash
curl http://localhost:5000/api/ai/status
```

### Generate Training Data & Train Model
```bash
# Generate sample training data (1000 samples)
curl -X POST http://localhost:5000/api/ai/generate-sample-data

# Train the AI model
curl -X POST http://localhost:5000/api/ai/train

# Check status
curl http://localhost:5000/api/ai/status
```

### Get AI Predictions
```bash
curl -X POST http://localhost:5000/api/ai/predict-public \
  -H "Content-Type: application/json" \
  -d '{
    "moisture": 70,
    "ph": 6.5,
    "nitrogen": 120,
    "phosphorus": 30,
    "potassium": 35
  }'
```

## 📊 Data Storage

All data is stored in the `data/` directory:

- **users.json** - User profiles, farm details, and soil data
- **emails.txt** - List of registered emails
- **ai_training_data.json** - AI training dataset
- **ai_model.pkl** - Trained ML model (binary)
- **ai_scaler.pkl** - Feature scaler (binary)
- **model_accuracy.txt** - Model accuracy score

See `data/README.md` for detailed data format information.

## 🔄 Complete Workflow

### 1. User Registration Flow
1. User fills form on frontend `/free-trial` page
2. Frontend sends data to `POST /api/user_data`
3. Backend stores in `users.json` and `emails.txt`
4. User data available via `GET /api/user/<email>`

### 2. Soil Analysis Flow
1. User submits soil data on dashboard
2. Frontend sends to `POST /api/soil-data/<email>`
3. Backend stores soil data in user profile
4. Backend calculates crop recommendations
5. Backend adds AI predictions if model is trained
6. Returns combined recommendations to frontend

### 3. AI Training Flow
1. Admin/User generates sample data: `POST /api/ai/generate-sample-data`
2. System creates 1000 training samples
3. Admin trains model: `POST /api/ai/train`
4. Model saved to `ai_model.pkl` and `ai_scaler.pkl`
5. Predictions now available via `POST /api/ai/predict-public`

## 🧪 Testing the Integration

### 1. Start Backend
```bash
cd backend
python app.py
```

### 2. Test Health Check
```bash
curl http://localhost:5000/api/health
```

### 3. Complete User Journey Test
```bash
# Sign up
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Store user data
curl -X POST http://localhost:5000/api/user_data \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "fullName": "Test Farmer",
    "location": "Punjab",
    "farmSize": "5",
    "cropType": "Wheat"
  }'

# Upload soil data
curl -X POST http://localhost:5000/api/soil-data/test@example.com \
  -H "Content-Type: application/json" \
  -d '{"moisture": 70, "ph": 6.5, "nitrogen": 120, "phosphorus": 30, "potassium": 35}'

# Get recommendations
curl http://localhost:5000/api/recommendations/test@example.com
```

### 4. Test AI System
```bash
# Generate training data
curl -X POST http://localhost:5000/api/ai/generate-sample-data

# Train model
curl -X POST http://localhost:5000/api/ai/train

# Get prediction
curl -X POST http://localhost:5000/api/ai/predict-public \
  -H "Content-Type: application/json" \
  -d '{"moisture": 70, "ph": 6.5, "nitrogen": 120, "phosphorus": 30, "potassium": 35}'
```

## 🏗️ Architecture

```
backend/
├── app.py                 # Main Flask application (905+ lines)
├── requirements.txt       # Python dependencies
├── data/                  # Data storage directory
│   ├── users.json        # User profiles and soil data
│   ├── emails.txt        # Email list
│   ├── ai_training_data.json  # Training dataset
│   ├── ai_model.pkl      # Trained model
│   ├── ai_scaler.pkl     # Feature scaler
│   └── model_accuracy.txt # Model accuracy
└── README.md             # This file
```

## 🔧 Technical Details

### Backend Stack
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **scikit-learn** - Machine learning (Random Forest)
- **NumPy** - Numerical computations
- **Pandas** - Data manipulation

### ML Model Details
- **Algorithm**: Random Forest Classifier (100 estimators)
- **Features**: Moisture, pH, Nitrogen, Phosphorus, Potassium
- **Preprocessing**: StandardScaler for feature normalization
- **Train/Test Split**: 80/20
- **Typical Accuracy**: 85-95%

### CORS Configuration
CORS is enabled for all origins in development:
```python
CORS(app)
```

For production, restrict to specific origins:
```python
CORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})
```

## 🚨 Troubleshooting

### Backend starts but frontend shows white screen
- **Solution**: Build the frontend first with `npm run build`
- Or run frontend separately with `npm run dev` on port 5173

### Frontend can't connect to backend
- **Check**: Backend is running on port 5000
- **Check**: No firewall blocking port 5000
- **Check**: API URL in `src/services/api.ts` is correct (`http://localhost:5000/api`)

### Data not being saved
- **Check**: `data/` directory exists
- **Check**: Write permissions on `data/` directory
- **Check**: Backend console logs for errors
- **Verify**: Check `data/users.json` file after API calls

### AI predictions not working
- **Generate data**: `POST /api/ai/generate-sample-data`
- **Train model**: `POST /api/ai/train`
- **Check status**: `GET /api/ai/status`
- **Verify**: Model files exist in `data/` directory

## 🔮 Future Enhancements

- Database migration (PostgreSQL/MongoDB)
- User authentication (JWT tokens)
- Real-time updates (WebSockets)
- Advanced ML models (Neural Networks)
- Weather API integration
- Crop yield prediction
- Plant disease detection
- Market price forecasting

---

**Note**: This is a development/prototype backend using file-based storage. For production deployment with many users, migrate to a proper database system.

