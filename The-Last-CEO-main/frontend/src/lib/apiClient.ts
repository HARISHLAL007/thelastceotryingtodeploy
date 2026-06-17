import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
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
    return apiClient.post('/predict', company);
  },

  async getQuarterReport(payload: any) {
    return apiClient.post('/predict', payload);
  },

  async getPredictions() {
    return apiClient.get('/predictions');
  },

  async makeDecision(decisionId: string) {
    return apiClient.post('/game/decision', { decisionId });
  },

  async getGameState() {
    return apiClient.get('/game/state');
  },

  async saveGameHistory(history: any[]) {
    return apiClient.post('/save_game_history', { history });
  },

  // Decision endpoints
  async getDecisions() {
    return apiClient.get('/decisions');
  },
};

export default apiClient;
