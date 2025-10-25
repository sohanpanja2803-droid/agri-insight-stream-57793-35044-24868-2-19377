# FieldSense Backend Data Storage

This directory contains all persistent data for the FieldSense backend.

## 📁 File Structure

### User Data
- **users.json** - Complete user profiles including soil data and crop history
- **emails.txt** - List of registered user emails (one per line)

### AI Model Data
- **ai_training_data.json** - Training dataset for the AI crop prediction model
- **ai_model.pkl** - Trained Random Forest model (binary pickle file)
- **ai_scaler.pkl** - StandardScaler for feature normalization (binary pickle file)
- **model_accuracy.txt** - Current model accuracy score

## 📄 Data Format Examples

### users.json

Complete user profiles with farm details and soil data:

```json
{
  "user@example.com": {
    "email": "user@example.com",
    "fullName": "John Farmer",
    "location": "Punjab, India",
    "farmSize": "10",
    "cropType": "Wheat",
    "phone": "+91-9876543210",
    "coordinates": {
      "lat": 30.7333,
      "lng": 76.7794
    },
    "trial_start_date": "2025-01-15",
    "trial_end_date": "2025-03-01",
    "subscription_tier": "free",
    "is_active": true,
    "registration_date": "2025-01-15 10:30:00",
    "soil_data": {
      "timestamp": "2025-01-15 11:00:00",
      "moisture": 70,
      "ph": 6.5,
      "nitrogen": 250,
      "phosphorus": 40,
      "potassium": 180
    },
    "crop_history": []
  }
}
```

**Key Fields:**
- `email` (string): Unique identifier for user
- `fullName` (string): User's full name
- `location` (string): Farm location/address
- `farmSize` (string): Size of farm in acres
- `cropType` (string): Primary crop grown
- `phone` (string): Contact number
- `coordinates` (object): GPS coordinates {lat, lng}
- `soil_data` (object): Latest soil analysis data
- `crop_history` (array): Historical crop data
- `trial_start_date`, `trial_end_date`: Trial period dates
- `registration_date`: When user signed up

### emails.txt

Simple text file with one email per line:

```
user@example.com
farmer@example.com
test@example.com
```

Used for mailing lists and quick email lookups.

### ai_training_data.json

Training dataset for machine learning model:

```json
[
  {
    "moisture": 75.5,
    "ph": 6.2,
    "nitrogen": 120,
    "phosphorus": 25,
    "potassium": 25,
    "crop": "Rice",
    "timestamp": "2025-01-15 10:00:00",
    "source": "manual"
  },
  {
    "moisture": 68.0,
    "ph": 6.8,
    "nitrogen": 90,
    "phosphorus": 30,
    "potassium": 35,
    "crop": "Wheat",
    "timestamp": "2025-01-15 10:05:00",
    "source": "sensor"
  }
]
```

**Fields:**
- `moisture` (float): Soil moisture percentage (0-100)
- `ph` (float): Soil pH level (0-14)
- `nitrogen` (int): Nitrogen content in mg/kg
- `phosphorus` (int): Phosphorus content in mg/kg
- `potassium` (int): Potassium content in mg/kg
- `crop` (string): Crop that was grown successfully
- `timestamp` (string): When data was collected
- `source` (string): Data source (manual, sensor, lab, farmer)

### ai_model.pkl & ai_scaler.pkl

Binary pickle files containing:
- **ai_model.pkl**: Trained Random Forest Classifier
- **ai_scaler.pkl**: StandardScaler for feature normalization

These files are generated when you train the AI model via `POST /api/ai/train`

### model_accuracy.txt

Single float value (0.0 to 1.0) representing model accuracy:

```
0.8972
```

Updated each time the model is trained.

## 🔄 Data Flow

### User Registration
1. User signs up on `/free-trial` page
2. Frontend calls `POST /api/user_data`
3. Backend stores data in `users.json`
4. Email added to `emails.txt`

### Soil Data Upload
1. User submits soil data on dashboard
2. Frontend calls `POST /api/soil-data/<email>`
3. Backend updates user's `soil_data` field in `users.json`
4. Timestamp added automatically

### AI Training
1. Admin generates sample data: `POST /api/ai/generate-sample-data`
2. Data added to `ai_training_data.json`
3. Admin trains model: `POST /api/ai/train`
4. Model saved to `ai_model.pkl` and `ai_scaler.pkl`
5. Accuracy saved to `model_accuracy.txt`

### AI Predictions
1. User requests prediction: `POST /api/ai/predict-public`
2. Backend loads model from `ai_model.pkl`
3. Scales features using `ai_scaler.pkl`
4. Returns top 3 crop predictions with confidence scores

## 💾 File Management

### Initialization
All files are automatically created when needed. The backend creates:
- `data/` directory on startup if it doesn't exist
- Empty `users.json` with `{}` if missing
- Empty `emails.txt` if missing
- Empty `ai_training_data.json` with `[]` if missing

### Reading Data
- **users.json**: Loaded into memory on startup, read on each request
- **emails.txt**: Read line by line when needed
- **AI files**: Loaded into memory on startup for fast predictions

### Writing Data
- **Immediate writes**: All data changes written immediately to disk
- **No caching**: Ensures data persistence even if server crashes
- **Pretty formatting**: JSON files use 2-space indentation for readability

## 🔒 Data Security Considerations

### Current Implementation (Development)
- Plain text storage
- No encryption
- File system permissions only

### Production Recommendations
1. **Encrypt sensitive data** (passwords, payment info)
2. **Use proper database** (PostgreSQL, MongoDB)
3. **Implement user authentication** (JWT tokens)
4. **Add data validation** (prevent injection attacks)
5. **Regular backups** (automated daily backups)
6. **Access logging** (track who accessed what)
7. **GDPR compliance** (data export, deletion rights)

## 📊 File Size Estimates

With typical usage:
- **users.json**: ~1-2 KB per user
- **emails.txt**: ~30 bytes per email
- **ai_training_data.json**: ~150 bytes per sample
- **ai_model.pkl**: ~500 KB (trained model)
- **ai_scaler.pkl**: ~5 KB

Example storage for 1000 users:
- 1000 users × 1.5 KB = ~1.5 MB
- 10,000 training samples × 150 bytes = ~1.5 MB
- AI model files = ~505 KB
- **Total**: ~3.5 MB

## 🔧 Backup Recommendations

### Manual Backup
```bash
# From project root
cp -r backend/data backend/data_backup_$(date +%Y%m%d)
```

### Automated Backup Script
```bash
#!/bin/bash
# backup_data.sh
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "data_backup_$DATE.tar.gz" backend/data
# Keep only last 7 backups
ls -t data_backup_*.tar.gz | tail -n +8 | xargs rm -f
```

### What to Backup
- ✅ `users.json` - Critical user data
- ✅ `emails.txt` - Email list
- ✅ `ai_training_data.json` - Valuable training data
- ⚠️ `ai_model.pkl` - Can be regenerated by retraining
- ⚠️ `ai_scaler.pkl` - Can be regenerated by retraining
- ⚠️ `model_accuracy.txt` - Can be regenerated

### Restoration
```bash
# Restore from backup
tar -xzf data_backup_YYYYMMDD_HHMMSS.tar.gz
```

## 📈 Scaling Considerations

### Current File-Based Approach is Suitable For:
- ✅ Prototyping and development
- ✅ Small user bases (< 1,000 users)
- ✅ Low-frequency writes (< 10 writes/second)
- ✅ Single-server deployments
- ✅ Quick iteration and testing

### Migrate to Database When:
- ❌ User count exceeds 5,000
- ❌ High write frequency (> 50 writes/second)
- ❌ Multiple server instances needed
- ❌ Complex queries required
- ❌ ACID transactions needed
- ❌ Production deployment with SLA requirements

### Migration Path
1. **PostgreSQL**: For structured relational data
2. **MongoDB**: For flexible document storage
3. **Redis**: For caching and sessions
4. **S3/Blob Storage**: For large files and backups

## 🐛 Troubleshooting

### Data not saving
- Check file permissions: `ls -la backend/data/`
- Check disk space: `df -h`
- Check backend logs for write errors

### Corrupted JSON files
```bash
# Validate JSON
python -m json.tool backend/data/users.json

# Fix formatting
python -m json.tool backend/data/users.json > backend/data/users_fixed.json
mv backend/data/users_fixed.json backend/data/users.json
```

### Lost data recovery
1. Check `data_backup_*` files
2. Check version control history
3. Check OS file recovery tools
4. Contact users to re-submit data

---

**Important**: This file-based storage is for development/prototyping. For production use, migrate to a proper database system with proper backups, security, and scalability.
