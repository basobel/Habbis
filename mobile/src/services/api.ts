import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper function to add auth token to requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    // Token will be added by individual API calls
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  timezone?: string;
  pet_name?: string;
  pet_species?: string;
}

export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Auth API
export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<ApiResponse>('/auth/login', credentials),
    
  register: (userData: RegisterData) =>
    apiClient.post<ApiResponse>('/auth/register', userData),
    
  logout: () =>
    apiClient.post<ApiResponse>('/auth/logout'),
    
  getMe: () =>
    apiClient.get<ApiResponse>('/auth/me'),
    
  refresh: () =>
    apiClient.post<ApiResponse>('/auth/refresh'),
};

// Habits API
export const habitsApi = {
  getHabits: (params?: { active?: boolean; page?: number }) =>
    apiClient.get<ApiResponse>('/habits', { params }),
    
  getHabit: (id: number) =>
    apiClient.get<ApiResponse>(`/habits/${id}`),
    
  createHabit: (data: any) =>
    apiClient.post<ApiResponse>('/habits', data),
    
  updateHabit: (id: number, data: any) =>
    apiClient.put<ApiResponse>(`/habits/${id}`, data),
    
  deleteHabit: (id: number) =>
    apiClient.delete<ApiResponse>(`/habits/${id}`),
    
  completeHabit: (id: number, data?: { notes?: string }) =>
    apiClient.post<ApiResponse>(`/habits/${id}/complete`, data),
    
  skipHabit: (id: number, data?: { reason?: string }) =>
    apiClient.post<ApiResponse>(`/habits/${id}/skip`, data),
    
  getHabitStats: () =>
    apiClient.get<ApiResponse>('/habits/stats/overview'),
};

// Pets API
export const petsApi = {
  getPets: () =>
    apiClient.get<ApiResponse>('/pets'),
    
  getPet: (id: number) =>
    apiClient.get<ApiResponse>(`/pets/${id}`),
    
  createPet: (data: any) =>
    apiClient.post<ApiResponse>('/pets', data),
    
  updatePet: (id: number, data: any) =>
    apiClient.put<ApiResponse>(`/pets/${id}`, data),
    
  deletePet: (id: number) =>
    apiClient.delete<ApiResponse>(`/pets/${id}`),
    
  feedPet: (id: number) =>
    apiClient.post<ApiResponse>(`/pets/${id}/feed`),
    
  evolvePet: (id: number) =>
    apiClient.post<ApiResponse>(`/pets/${id}/evolve`),
    
  getPetStats: (id: number) =>
    apiClient.get<ApiResponse>(`/pets/${id}/stats`),
};

// Battles API
export const battlesApi = {
  getBattles: () =>
    apiClient.get<ApiResponse>('/battles'),
    
  getBattle: (id: number) =>
    apiClient.get<ApiResponse>(`/battles/${id}`),
    
  createBattle: (data: any) =>
    apiClient.post<ApiResponse>('/battles', data),
    
  challengeBattle: (id: number) =>
    apiClient.post<ApiResponse>(`/battles/${id}/challenge`),
    
  acceptBattle: (id: number) =>
    apiClient.post<ApiResponse>(`/battles/${id}/accept`),
    
  declineBattle: (id: number) =>
    apiClient.post<ApiResponse>(`/battles/${id}/decline`),
    
  makeMove: (id: number, data: any) =>
    apiClient.post<ApiResponse>(`/battles/${id}/make-move`, data),
};

// Guilds API
export const guildsApi = {
  getGuilds: () =>
    apiClient.get<ApiResponse>('/guilds'),
    
  getGuild: (id: number) =>
    apiClient.get<ApiResponse>(`/guilds/${id}`),
    
  createGuild: (data: any) =>
    apiClient.post<ApiResponse>('/guilds', data),
    
  updateGuild: (id: number, data: any) =>
    apiClient.put<ApiResponse>(`/guilds/${id}`, data),
    
  deleteGuild: (id: number) =>
    apiClient.delete<ApiResponse>(`/guilds/${id}`),
    
  joinGuild: (id: number) =>
    apiClient.post<ApiResponse>(`/guilds/${id}/join`),
    
  leaveGuild: (id: number) =>
    apiClient.post<ApiResponse>(`/guilds/${id}/leave`),
    
  promoteMember: (id: number, data: { user_id: number; role: string }) =>
    apiClient.post<ApiResponse>(`/guilds/${id}/promote`, data),
    
  kickMember: (id: number, data: { user_id: number }) =>
    apiClient.post<ApiResponse>(`/guilds/${id}/kick`, data),
};

// Achievements API
export const achievementsApi = {
  getAchievements: () =>
    apiClient.get<ApiResponse>('/achievements'),
    
  getAchievement: (id: number) =>
    apiClient.get<ApiResponse>(`/achievements/${id}`),
    
  getUserProgress: () =>
    apiClient.get<ApiResponse>('/achievements/user/progress'),
};

// Leaderboards API
export const leaderboardsApi = {
  getUsers: () =>
    apiClient.get<ApiResponse>('/leaderboards/users'),
    
  getPets: () =>
    apiClient.get<ApiResponse>('/leaderboards/pets'),
    
  getGuilds: () =>
    apiClient.get<ApiResponse>('/leaderboards/guilds'),
};

export default apiClient;
