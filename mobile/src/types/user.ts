// User-related types
export interface UserSettings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
  timezone?: string;
}

export interface AvatarPreferences {
  style: 'rounded' | 'square' | 'circle';
  background_color: string;
  text_color: string;
  border_style?: string;
}

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
  settings?: UserSettings;
  avatar_preferences?: AvatarPreferences;
  statistics?: UserStatistics;
  equipment: UserEquipment[];
  avatars: UserAvatar[];
  active_avatar?: UserAvatar;
  achievements: Achievement[];
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
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserAvatar {
  id: number;
  user_id: number;
  avatar_type: 'default' | 'custom' | 'generated';
  avatar_url?: string;
  avatar_name?: string;
  avatar_config?: Record<string, any>;
  is_active: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  category: string;
  points: number;
  is_unlocked: boolean;
  unlocked_at?: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  username?: string;
  email?: string;
  avatar_url?: string;
  settings?: UserSettings;
  avatar_preferences?: AvatarPreferences;
}

export interface AddCurrencyData {
  type: 'regular' | 'premium';
  amount: number;
}
