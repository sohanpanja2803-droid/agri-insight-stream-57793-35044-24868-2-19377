// Backend API service for FieldSense
const API_BASE_URL = 'http://localhost:5000/api';

export interface SoilData {
  moisture: number;
  ph: number;
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
}

export interface UserData {
  email: string;
  fullName?: string;
  location?: string;
  farmSize?: string;
  cropType?: string;
  phone?: string;
  soil_data?: SoilData;
}

export interface CropRecommendation {
  name: string;
  suitability_score: number;
  base_price: number;
  price_prediction?: any;
}

export interface AIStatus {
  model_trained: boolean;
  model_accuracy: number;
  training_samples: number;
  model_info: {
    algorithm: string;
    features: string[];
    last_trained: string | null;
  };
}

// User APIs
export const signup = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
};

export const getUserData = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/user/${email}`);
  return response.json();
};

export const updateUserData = async (email: string, data: any) => {
  const response = await fetch(`${API_BASE_URL}/user/${email}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

export const storeUserData = async (userData: UserData) => {
  const response = await fetch(`${API_BASE_URL}/user_data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Soil Data APIs
export const uploadSoilData = async (email: string, soilData: SoilData) => {
  const response = await fetch(`${API_BASE_URL}/soil-data/${email}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(soilData)
  });
  return response.json();
};

export const getRecommendations = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/recommendations/${email}`);
  return response.json();
};

// AI APIs
export const getAIStatus = async (): Promise<AIStatus> => {
  const response = await fetch(`${API_BASE_URL}/ai/status`);
  return response.json();
};

export const generateSampleData = async () => {
  const response = await fetch(`${API_BASE_URL}/ai/generate-sample-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
};

export const trainAIModel = async () => {
  const response = await fetch(`${API_BASE_URL}/ai/train`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return response.json();
};

export const getAIPrediction = async (soilData: SoilData) => {
  const response = await fetch(`${API_BASE_URL}/ai/predict-public`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(soilData)
  });
  return response.json();
};

export const feedTrainingData = async (data: SoilData & { crop: string; source?: string }) => {
  const response = await fetch(`${API_BASE_URL}/ai/feed-data`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};
