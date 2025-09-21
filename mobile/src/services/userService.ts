import { apiClient } from './apiClient';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  level: number;
  experience_points: number;
  regular_currency: number;
  premium_currency: number;
  is_premium: boolean;
  premium_expires_at?: string;
  current_streak_days: number;
  total_streak_days: number;
  last_activity_at?: string;
  settings?: any;
  avatar_preferences?: any;
  statistics?: UserStatistics;
  equipment: UserEquipment[];
  active_avatar?: UserAvatar;
  achievements: any[];
  created_at: string;
  updated_at: string;
}

export interface UserStatistics {
  id: number;
  user_id: number;
  total_habits_completed: number;
  total_habits_created: number;
  total_days_active: number;
  longest_streak: number;
  current_streak: number;
  habits_completed_today: number;
  habits_completed_this_week: number;
  habits_completed_this_month: number;
  habits_completed_this_year: number;
  category_stats?: Record<string, number>;
  time_stats?: Record<string, number>;
  completion_rate: number;
  perfect_days: number;
  zero_days: number;
  guild_contributions: number;
  battles_won: number;
  battles_lost: number;
  pets_owned: number;
  achievements_unlocked: number;
  created_at: string;
  updated_at: string;
}

export interface UserEquipment {
  id: number;
  user_id: number;
  type: 'avatar' | 'pet_accessory' | 'background' | 'frame' | 'badge';
  item_id: string;
  item_name: string;
  item_description?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  is_equipped: boolean;
  acquired_at: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface UserAvatar {
  id: number;
  user_id: number;
  avatar_type: 'default' | 'custom' | 'generated';
  avatar_url?: string;
  avatar_name?: string;
  avatar_config?: any;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  avatar_url?: string;
  settings?: any;
  avatar_preferences?: any;
}

export interface AddCurrencyData {
  type: 'regular' | 'premium';
  amount: number;
}

class UserService {
  /**
   * Get current user profile with full data
   */
  async getProfile(): Promise<UserProfile> {
    console.log('userService.getProfile: Starting...');
    try {
      const response = await apiClient.get('/user/profile');
      console.log('userService.getProfile: Success', response.data);
      // Return only the user data, not the full API response structure
      return response.data.data;
    } catch (error: any) {
      console.error('userService.getProfile: Error', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await apiClient.put('/user/profile', data);
    return response.data.data;
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(avatarFile: FormData): Promise<{ avatar_url: string }> {
    const response = await apiClient.post('/user/avatar', avatarFile, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  }

  /**
   * Get user statistics
   */
  async getStatistics(): Promise<UserStatistics> {
    const response = await apiClient.get('/user/statistics');
    return response.data.data;
  }

  /**
   * Get user equipment
   */
  async getEquipment(): Promise<UserEquipment[]> {
    const response = await apiClient.get('/user/equipment');
    return response.data.data;
  }

  /**
   * Equip item
   */
  async equipItem(itemId: number): Promise<UserEquipment> {
    const response = await apiClient.post('/user/equipment/equip', {
      item_id: itemId,
    });
    return response.data.data;
  }

  /**
   * Get user avatars
   */
  async getAvatars(): Promise<UserAvatar[]> {
    const response = await apiClient.get('/user/avatars');
    return response.data.data;
  }

  /**
   * Set active avatar
   */
  async setActiveAvatar(avatarId: number): Promise<UserAvatar> {
    const response = await apiClient.post('/user/avatars/set-active', {
      avatar_id: avatarId,
    });
    return response.data.data;
  }

  /**
   * Add currency (for testing)
   */
  async addCurrency(data: AddCurrencyData): Promise<{
    regular_currency: number;
    premium_currency: number;
  }> {
    const response = await apiClient.post('/user/currency/add', data);
    return response.data.data;
  }

  /**
   * Get user level progress
   */
  calculateLevelProgress(experiencePoints: number, level: number): {
    current: number;
    required: number;
    percentage: number;
  } {
    const currentLevelXp = this.calculateRequiredXpForLevel(level);
    const nextLevelXp = this.calculateRequiredXpForLevel(level + 1);
    const progress = experiencePoints - currentLevelXp;
    const required = nextLevelXp - currentLevelXp;
    const percentage = Math.min((progress / required) * 100, 100);

    return {
      current: progress,
      required,
      percentage: Math.round(percentage),
    };
  }

  /**
   * Calculate required XP for level
   */
  private calculateRequiredXpForLevel(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  /**
   * Get rarity color
   */
  getRarityColor(rarity: string): string {
    const colors = {
      common: '#6B7280',
      uncommon: '#10B981',
      rare: '#3B82F6',
      epic: '#8B5CF6',
      legendary: '#F59E0B',
    };
    return colors[rarity as keyof typeof colors] || '#6B7280';
  }

  /**
   * Get rarity name in Polish
   */
  getRarityName(rarity: string): string {
    const names = {
      common: 'Pospolity',
      uncommon: 'Niezbyt pospolity',
      rare: 'Rzadki',
      epic: 'Epicki',
      legendary: 'Legendarny',
    };
    return names[rarity as keyof typeof names] || 'Nieznany';
  }
}

export const userService = new UserService();
