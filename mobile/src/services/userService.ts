import { apiClient } from './apiClient';
import { logger } from '@/utils/logger';
import { 
  UserProfile, 
  UserStatistics, 
  UserEquipment, 
  UserAvatar, 
  UpdateProfileData, 
  AddCurrencyData 
} from '@/types/user';

// Types are now imported from @/types/user

class UserService {
  /**
   * Get current user profile with full data
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to fetch user profile', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await apiClient.put('/user/profile', data);
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to update user profile', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Upload avatar
   */
  async uploadAvatar(avatarFile: FormData): Promise<{ avatar_url: string }> {
    try {
      const response = await apiClient.post('/user/avatar', avatarFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to upload avatar', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  async getStatistics(): Promise<UserStatistics> {
    try {
      const response = await apiClient.get('/user/statistics');
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to fetch user statistics', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user equipment
   */
  async getEquipment(): Promise<UserEquipment[]> {
    try {
      const response = await apiClient.get('/user/equipment');
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to fetch user equipment', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Equip item
   */
  async equipItem(itemId: number): Promise<UserEquipment> {
    try {
      const response = await apiClient.post('/user/equipment/equip', {
        item_id: itemId,
      });
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to equip item', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user avatars
   */
  async getAvatars(): Promise<UserAvatar[]> {
    try {
      const response = await apiClient.get('/user/avatars');
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to fetch user avatars', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Set active avatar
   */
  async setActiveAvatar(avatarId: number): Promise<UserAvatar> {
    try {
      const response = await apiClient.post('/user/avatars/set-active', {
        avatar_id: avatarId,
      });
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to set active avatar', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Add currency (for testing)
   */
  async addCurrency(data: AddCurrencyData): Promise<{
    regular_currency: number;
    premium_currency: number;
  }> {
    try {
      const response = await apiClient.post('/user/currency/add', data);
      return response.data.data;
    } catch (error: any) {
      logger.error('Failed to add currency', error.response?.data || error.message);
      throw error;
    }
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
