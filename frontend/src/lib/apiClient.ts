import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8000'),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  console.log('📡 Request:', config.method?.toUpperCase(), config.url);
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const api = {
  // Game endpoints
  async initializeGame(company: any) {
    return apiClient.post('/api/predict', company);
  },

  async getQuarterReport(payload: any) {
    return apiClient.post('/api/predict', payload);
  },

  async explainPrediction(payload: any) {
    return apiClient.post('/api/explain', payload);
  },

  async getPredictions() {
    return apiClient.get('/api/predictions');
  },

  async makeDecision(decisionId: string) {
    return apiClient.post('/api/game/decision', { decisionId });
  },

  async getGameState() {
    return apiClient.get('/api/game/state');
  },

  async saveGameHistory(history: any[]) {
    return apiClient.post('/api/save_game_history', { history });
  },

  // Decision endpoints
  async getDecisions() {
    return apiClient.get('/api/decisions');
  },

  async getAdvisorInsights(prompt: string) {
    return apiClient.post('/api/advisor', { prompt });
  },

  // Auth endpoints
  async logAuth(payload: any) {
    return apiClient.post('/api/auth/log', payload);
  }
};

export default apiClient;
