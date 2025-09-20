import { BaseApiService } from './baseApi';
import { AuthResponse, User } from '@/types';

// API Configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create API service instance
const apiService = new BaseApiService(API_BASE_URL);

// Helper function to add auth token to requests
export const setAuthToken = (token: string | null) => {
  apiService.setAuthToken(token);
};

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
    apiService.post<AuthResponse>('/auth/login', credentials),
    
  register: (userData: RegisterData) =>
    apiService.post<AuthResponse>('/auth/register', userData),
    
  logout: () =>
    apiService.post<ApiResponse>('/auth/logout'),
    
  getMe: () =>
    apiService.get<{ user: User }>('/auth/me'),
    
  refresh: () =>
    apiService.post<AuthResponse>('/auth/refresh'),
};

// Habits API
export const habitsApi = {
  getHabits: (params?: { active?: boolean; page?: number }) =>
    apiService.get<ApiResponse>('/habits', { params }),
    
  getHabit: (id: number) =>
    apiService.get<ApiResponse>(`/habits/${id}`),
    
  createHabit: (data: any) =>
    apiService.post<ApiResponse>('/habits', data),
    
  updateHabit: (id: number, data: any) =>
    apiService.put<ApiResponse>(`/habits/${id}`, data),
    
  deleteHabit: (id: number) =>
    apiService.delete<ApiResponse>(`/habits/${id}`),
    
  completeHabit: (id: number, data?: { notes?: string }) =>
    apiService.post<ApiResponse>(`/habits/${id}/complete`, data),
    
  skipHabit: (id: number, data?: { reason?: string }) =>
    apiService.post<ApiResponse>(`/habits/${id}/skip`, data),
    
  getHabitStats: () =>
    apiService.get<ApiResponse>('/habits/stats/overview'),
};

// Pets API
export const petsApi = {
  getPets: () =>
    apiService.get<ApiResponse>('/pets'),
    
  getPet: (id: number) =>
    apiService.get<ApiResponse>(`/pets/${id}`),
    
  createPet: (data: any) =>
    apiService.post<ApiResponse>('/pets', data),
    
  updatePet: (id: number, data: any) =>
    apiService.put<ApiResponse>(`/pets/${id}`, data),
    
  deletePet: (id: number) =>
    apiService.delete<ApiResponse>(`/pets/${id}`),
    
  feedPet: (id: number) =>
    apiService.post<ApiResponse>(`/pets/${id}/feed`),
    
  evolvePet: (id: number) =>
    apiService.post<ApiResponse>(`/pets/${id}/evolve`),
    
  getPetStats: (id: number) =>
    apiService.get<ApiResponse>(`/pets/${id}/stats`),
};

// Battles API
export const battlesApi = {
  getBattles: () =>
    apiService.get<ApiResponse>('/battles'),
    
  getBattle: (id: number) =>
    apiService.get<ApiResponse>(`/battles/${id}`),
    
  createBattle: (data: any) =>
    apiService.post<ApiResponse>('/battles', data),
    
  challengeBattle: (id: number) =>
    apiService.post<ApiResponse>(`/battles/${id}/challenge`),
    
  acceptBattle: (id: number) =>
    apiService.post<ApiResponse>(`/battles/${id}/accept`),
    
  declineBattle: (id: number) =>
    apiService.post<ApiResponse>(`/battles/${id}/decline`),
    
  makeMove: (id: number, data: any) =>
    apiService.post<ApiResponse>(`/battles/${id}/make-move`, data),
};

// Guilds API
export const guildsApi = {
  getGuilds: () =>
    apiService.get<ApiResponse>('/guilds'),
    
  getGuild: (id: number) =>
    apiService.get<ApiResponse>(`/guilds/${id}`),
    
  createGuild: (data: any) =>
    apiService.post<ApiResponse>('/guilds', data),
    
  updateGuild: (id: number, data: any) =>
    apiService.put<ApiResponse>(`/guilds/${id}`, data),
    
  deleteGuild: (id: number) =>
    apiService.delete<ApiResponse>(`/guilds/${id}`),
    
  joinGuild: (id: number) =>
    apiService.post<ApiResponse>(`/guilds/${id}/join`),
    
  leaveGuild: (id: number) =>
    apiService.post<ApiResponse>(`/guilds/${id}/leave`),
    
  promoteMember: (id: number, data: { user_id: number; role: string }) =>
    apiService.post<ApiResponse>(`/guilds/${id}/promote`, data),
    
  kickMember: (id: number, data: { user_id: number }) =>
    apiService.post<ApiResponse>(`/guilds/${id}/kick`, data),
};

// Achievements API
export const achievementsApi = {
  getAchievements: () =>
    apiService.get<ApiResponse>('/achievements'),
    
  getAchievement: (id: number) =>
    apiService.get<ApiResponse>(`/achievements/${id}`),
    
  getUserProgress: () =>
    apiService.get<ApiResponse>('/achievements/user/progress'),
};

// Leaderboards API
export const leaderboardsApi = {
  getUsers: () =>
    apiService.get<ApiResponse>('/leaderboards/users'),
    
  getPets: () =>
    apiService.get<ApiResponse>('/leaderboards/pets'),
    
  getGuilds: () =>
    apiService.get<ApiResponse>('/leaderboards/guilds'),
};

export default apiService;
