// Common types used across the application

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  level: number;
  experience: number;
  maxExperience: number;
  streak: number;
  achievements: number;
  regularCurrency: number;
  premiumCurrency: number;
}

export interface Habit extends BaseEntity {
  name: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  frequency: 'daily' | 'weekly' | 'monthly';
  isCompleted: boolean;
  completedAt?: Date;
  streak: number;
  maxStreak: number;
}

export interface Pet extends BaseEntity {
  name: string;
  species: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  experience: number;
  maxExperience: number;
  happiness: number;
  hunger: number;
  lastFed?: Date;
  lastPlayed?: Date;
  equipment: string[];
}

export interface Guild extends BaseEntity {
  name: string;
  description: string;
  level: number;
  memberCount: number;
  maxMembers: number;
  tags: string[];
  isPrivate: boolean;
}

export interface Battle extends BaseEntity {
  type: 'arena' | 'dungeon' | 'expedition';
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  status: 'pending' | 'active' | 'completed' | 'failed';
  rewards: {
    experience: number;
    currency: number;
    items: string[];
  };
}

export interface Achievement extends BaseEntity {
  name: string;
  description: string;
  category: string;
  points: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  icon: string;
}

// UI Component types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export interface ThemeColors {
  primary: Record<number, string>;
  text: {
    primary: string;
    secondary: string;
    inverse: string;
    placeholder: string;
  };
  background: {
    primary: string;
    secondary: string;
    card: string;
  };
  border: {
    primary: string;
    secondary: string;
  };
  error: Record<number, string>;
  accent: {
    success: string;
    warning: string;
    gold: string;
  };
}

// Navigation types
export type RootStackParamList = {
  '/(tabs)': undefined;
  '/(tabs)/': undefined;
  '/(tabs)/pets': undefined;
  '/(tabs)/battle': undefined;
  '/(tabs)/guild': undefined;
  '/(tabs)/profile': undefined;
  '/(tabs)/settings': undefined;
  '/(tabs)/premium': undefined;
  '/(tabs)/statistics': undefined;
  '/(tabs)/help': undefined;
  '/(tabs)/about': undefined;
  login: undefined;
  register: undefined;
  'forgot-password': undefined;
  'change-password': undefined;
  'email-verification': undefined;
};

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
