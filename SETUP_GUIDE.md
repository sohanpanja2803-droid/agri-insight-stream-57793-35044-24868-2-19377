# FieldSense Setup Guide

Complete guide to set up and run FieldSense with backend integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip

### Installation

#### 1. Install Frontend Dependencies
```bash
npm install
```

#### 2. Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

## 🏃 Running the Application

You have two options: **Development Mode** (recommended) or **Production Mode**.

---

## Option 1: Development Mode (Recommended)

Run frontend and backend separately for the best development experience.

### Terminal 1 - Backend
```bash
cd backend
python app.py
```

Backend will run on: `http://localhost:5000`
- API endpoints at: `http://localhost:5000/api/*`
- Health check: `http://localhost:5000/api/health`

### Terminal 2 - Frontend
```bash
npm run dev
```

Frontend will run on: `http://localhost:5173`

### ✅ Advantages
- Hot reload for frontend changes
- Separate console logs for debugging
- Faster development workflow
- Backend stays running while you edit frontend code

---

## Option 2: Production Mode

Backend serves the built frontend (single port deployment).

### Step 1: Build Frontend
```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 2: Run Backend
```bash
cd backend
python app.py
```

Everything runs on: `http://localhost:5000`
- Frontend UI at: `http://localhost:5000`
- API endpoints at: `http://localhost:5000/api/*`

### ✅ Advantages
- Single server to manage
- Production-like environment
- Simpler deployment

---

## 🧪 Testing the Integration

### 1. Test Backend Health
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15 10:30:00",
  "users_count": 0,
  "version": "1.0.0"
}
```

### 2. Test User Registration Flow

#### Open the app
- Development: `http://localhost:5173`
- Production: `http://localhost:5000`

#### Navigate to Free Trial
1. Click "Start Free Trial" button
2. Fill in the form:
   - Full Name: Test Farmer
   - Email: test@example.com
   - Phone: +91-9876543210
   - Farm Size: 10
   - Crop Type: Wheat
   - Location: Punjab, India

3. Submit the form

#### Verify Data Storage
```bash
# Check if user data was saved
cat backend/data/users.json

# Check if email was saved
cat backend/data/emails.txt
```

You should see your data in both files!

### 3. Test API Directly

#### Create a User
```bash
curl -X POST http://localhost:5000/api/user_data \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@example.com",
    "fullName": "John Farmer",
    "location": "Punjab, India",
    "farmSize": "15",
    "cropType": "Rice",
    "phone": "+91-9876543210"
  }'
```

#### Upload Soil Data
```bash
curl -X POST http://localhost:5000/api/soil-data/farmer@example.com \
  -H "Content-Type: application/json" \
  -d '{
    "moisture": 75,
    "ph": 6.2,
    "nitrogen": 120,
    "phosphorus": 25,
    "potassium": 25
  }'
```

#### Get Recommendations
```bash
curl http://localhost:5000/api/recommendations/farmer@example.com
```

### 4. Test AI System

#### Generate Training Data
```bash
curl -X POST http://localhost:5000/api/ai/generate-sample-data
```

This creates 1000 training samples in `backend/data/ai_training_data.json`

#### Train the Model
```bash
curl -X POST http://localhost:5000/api/ai/train
```

This trains the AI model and saves it to `backend/data/ai_model.pkl`

#### Check AI Status
```bash
curl http://localhost:5000/api/ai/status
```

Expected response:
```json
{
  "model_trained": true,
  "model_accuracy": 0.89,
  "training_samples": 1000,
  "model_info": {
    "algorithm": "Random Forest",
    "features": ["moisture", "ph", "nitrogen", "phosphorus", "potassium"],
    "last_trained": "2025-01-15 10:45:00"
  }
}
```

#### Get AI Prediction
```bash
curl -X POST http://localhost:5000/api/ai/predict-public \
  -H "Content-Type: application/json" \
  -d '{
    "moisture": 75,
    "ph": 6.2,
    "nitrogen": 120,
    "phosphorus": 25,
    "potassium": 25
  }'
```

---

## 📊 Data Storage

All data is stored in `backend/data/`:

```
backend/data/
├── users.json              # User profiles and soil data
├── emails.txt              # Email list
├── ai_training_data.json   # AI training dataset
├── ai_model.pkl            # Trained ML model
├── ai_scaler.pkl           # Feature scaler
└── model_accuracy.txt      # Model accuracy
```

### View Stored Data
```bash
# View all users
cat backend/data/users.json | python -m json.tool

# View emails
cat backend/data/emails.txt

# View training data
cat backend/data/ai_training_data.json | python -m json.tool

# View model accuracy
cat backend/data/model_accuracy.txt
```

---

## 🐛 Troubleshooting

### Issue: Frontend shows white screen

**Cause**: Frontend not built or backend can't find dist folder

**Solution for Development**:
```bash
# Run backend and frontend separately
# Terminal 1
cd backend && python app.py

# Terminal 2
npm run dev
```

**Solution for Production**:
```bash
# Build frontend first
npm run build

# Then run backend
cd backend && python app.py
```

---

### Issue: Backend connection failed

**Check 1**: Is backend running?
```bash
curl http://localhost:5000/api/health
```

**Check 2**: Is the port available?
```bash
lsof -i :5000
```

**Check 3**: Check backend logs for errors

---

### Issue: Data not being saved

**Check 1**: Does data directory exist?
```bash
ls -la backend/data/
```

**Check 2**: Do you have write permissions?
```bash
# Give write permissions
chmod 755 backend/data/
```

**Check 3**: Check backend console for errors

---

### Issue: CORS errors

**Symptom**: Browser console shows CORS errors

**Solution**: Backend already has CORS enabled. Make sure:
1. Backend is running on port 5000
2. Frontend API calls use `http://localhost:5000/api`
3. Both servers are running

---

### Issue: AI predictions not working

**Cause**: Model not trained

**Solution**:
```bash
# Step 1: Generate training data
curl -X POST http://localhost:5000/api/ai/generate-sample-data

# Step 2: Train the model
curl -X POST http://localhost:5000/api/ai/train

# Step 3: Check status
curl http://localhost:5000/api/ai/status

# Step 4: Test prediction
curl -X POST http://localhost:5000/api/ai/predict-public \
  -H "Content-Type: application/json" \
  -d '{"moisture": 70, "ph": 6.5, "nitrogen": 120, "phosphorus": 30, "potassium": 35}'
```

---

## 📱 Full User Journey Test

### 1. Start Services
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend (if dev mode)
npm run dev
```

### 2. User Signs Up
1. Go to `http://localhost:5173` (or :5000 for production)
2. Click "Start Free Trial"
3. Fill form and submit
4. Data saved to `backend/data/users.json`

### 3. User Logs In
1. Use email from signup
2. Login redirects to dashboard

### 4. View Dashboard
1. See user profile with farm details
2. View soil analysis (mock data initially)
3. View charts and insights

### 5. Backend Verification
```bash
# Check user data
cat backend/data/users.json

# Check if email saved
cat backend/data/emails.txt
```

---

## 🚀 Deployment Checklist

Before deploying to production:

### Backend
- [ ] Change CORS to specific domain: `CORS(app, resources={r"/api/*": {"origins": "https://yourdomain.com"}})`
- [ ] Add environment variables for sensitive config
- [ ] Migrate from file storage to database (PostgreSQL/MongoDB)
- [ ] Add user authentication (JWT tokens)
- [ ] Add rate limiting
- [ ] Add logging and monitoring
- [ ] Set up SSL/HTTPS

### Frontend
- [ ] Update API_BASE_URL in `src/services/api.ts` to production URL
- [ ] Build optimized production bundle: `npm run build`
- [ ] Add error tracking (Sentry, etc.)
- [ ] Add analytics
- [ ] Test on different devices/browsers

### Data
- [ ] Set up automated backups
- [ ] Add data encryption for sensitive fields
- [ ] Implement data retention policies
- [ ] Add GDPR compliance features

---

## 📚 Additional Resources

- **Backend API Documentation**: See `backend/README.md`
- **Data Storage Guide**: See `backend/data/README.md`
- **Frontend Documentation**: See `README.md`

---

## 💡 Tips

1. **Use Development Mode** during development for hot reload and better debugging
2. **Test Production Mode** locally before deploying to ensure build works correctly
3. **Backup data directory** regularly: `cp -r backend/data backend/data_backup`
4. **Check logs** if something isn't working - both backend console and browser console
5. **Train AI model** with sample data to test recommendations feature

---

## 🎯 Common Workflows

### Adding a New User via API
```bash
curl -X POST http://localhost:5000/api/user_data \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "fullName": "New Farmer",
    "location": "Karnataka, India",
    "farmSize": "8",
    "cropType": "Cotton",
    "phone": "+91-9876543210"
  }'
```

### Getting Crop Recommendations
```bash
# Upload soil data first
curl -X POST http://localhost:5000/api/soil-data/newuser@example.com \
  -H "Content-Type: application/json" \
  -d '{"moisture": 55, "ph": 6.5, "nitrogen": 80, "phosphorus": 22, "potassium": 44}'

# Get recommendations
curl http://localhost:5000/api/recommendations/newuser@example.com
```

### Training AI with Custom Data
```bash
# Add training samples
curl -X POST http://localhost:5000/api/ai/feed-data \
  -H "Content-Type: application/json" \
  -d '{"moisture": 55, "ph": 6.5, "nitrogen": 80, "phosphorus": 22, "potassium": 44, "crop": "Cotton", "source": "manual"}'

# Train with new data
curl -X POST http://localhost:5000/api/ai/train
```

---

Happy Farming! 🌾🚜
