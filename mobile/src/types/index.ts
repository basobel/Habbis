// User types
export interface User {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  level: number;
  experience_points: number;
  premium_currency: number;
  total_streak_days: number;
  current_streak_days: number;
  last_activity_at?: string;
  settings?: Record<string, any>;
  notifications_enabled: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
}

// Pet types
export interface Pet {
  id: number;
  user_id: number;
  name: string;
  species: PetSpecies;
  level: number;
  experience: number;
  evolution_stage: number;
  attack: number;
  defense: number;
  speed: number;
  health: number;
  max_health: number;
  skin_id?: string;
  customization?: Record<string, any>;
  avatar_url?: string;
  is_active: boolean;
  last_fed_at?: string;
  last_battled_at?: string;
  created_at: string;
  updated_at: string;
}

export type PetSpecies = 'dragon' | 'phoenix' | 'wolf' | 'cat' | 'dog' | 'rabbit' | 'bear';

// Habit types
export interface Habit {
  id: number;
  user_id: number;
  name: string;
  description?: string;
  difficulty: HabitDifficulty;
  target_frequency: number;
  target_days: number[];
  reward_config?: Record<string, any>;
  base_xp_reward: number;
  streak_bonus_xp: number;
  premium_currency_reward: number;
  current_streak: number;
  longest_streak: number;
  total_completions: number;
  last_completed_at?: string;
  is_active: boolean;
  reminders_enabled: boolean;
  reminder_times?: string[];
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export type HabitDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

// Habit Log types
export interface HabitLog {
  id: number;
  habit_id: number;
  user_id: number;
  date: string;
  completed: boolean;
  xp_gained: number;
  premium_currency_gained: number;
  notes?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Battle types
export interface Battle {
  id: number;
  challenger_pet_id: number;
  defender_pet_id: number;
  winner_pet_id?: number;
  battle_type: BattleType;
  status: BattleStatus;
  rounds_played: number;
  max_rounds: number;
  xp_reward: number;
  premium_currency_reward: number;
  items_rewarded?: any[];
  battle_log?: BattleLogEntry[];
  final_stats?: Record<string, any>;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export type BattleType = 'pvp' | 'pve' | 'tournament' | 'guild';
export type BattleStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface BattleLogEntry {
  round: number;
  attacker: number;
  defender: number;
  action: string;
  damage: number;
  health_remaining: number;
  timestamp: string;
}

// Guild types
export interface Guild {
  id: number;
  name: string;
  tag: string;
  description?: string;
  leader_id: number;
  level: number;
  experience: number;
  member_count: number;
  max_members: number;
  settings?: Record<string, any>;
  banner_url?: string;
  icon_url?: string;
  is_public: boolean;
  auto_accept_members: boolean;
  min_level_required: number;
  min_streak_required: number;
  created_at: string;
  updated_at: string;
}

export interface GuildMember {
  id: number;
  guild_id: number;
  user_id: number;
  role: GuildRole;
  contribution_points: number;
  joined_at: string;
  last_contribution_at?: string;
  created_at: string;
  updated_at: string;
}

export type GuildRole = 'leader' | 'officer' | 'member';

// Achievement types
export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon?: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  requirements: Record<string, any>;
  rewards: Record<string, any>;
  xp_reward: number;
  premium_currency_reward: number;
  is_hidden: boolean;
  is_repeatable: boolean;
  max_progress: number;
  created_at: string;
  updated_at: string;
}

export type AchievementCategory = 'habits' | 'battles' | 'guild' | 'social' | 'special';
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface UserAchievement {
  id: number;
  user_id: number;
  achievement_id: number;
  progress: number;
  is_completed: boolean;
  completed_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Habits: undefined;
  HabitDetail: { habitId: number };
  CreateHabit: undefined;
  Pets: undefined;
  PetDetail: { petId: number };
  Battles: undefined;
  BattleDetail: { battleId: number };
  Guilds: undefined;
  GuildDetail: { guildId: number };
  Achievements: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Redux types
export interface RootState {
  auth: AuthState;
  habits: HabitsState;
  pets: PetsState;
  battles: BattlesState;
  guilds: GuildsState;
  achievements: AchievementsState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface HabitsState {
  habits: Habit[];
  activeHabits: Habit[];
  selectedHabit: Habit | null;
  stats: HabitStats | null;
  isLoading: boolean;
  error: string | null;
}

export interface HabitStats {
  total_habits: number;
  active_habits: number;
  total_completions: number;
  current_streak: number;
  longest_streak: number;
  completion_rate: number;
  weekly_progress: WeeklyProgress[];
  monthly_progress: MonthlyProgress[];
}

export interface WeeklyProgress {
  date: string;
  day_name: string;
  completions: number;
}

export interface MonthlyProgress {
  date: string;
  completions: number;
}

export interface PetsState {
  pets: Pet[];
  activePet: Pet | null;
  selectedPet: Pet | null;
  isLoading: boolean;
  error: string | null;
}

export interface BattlesState {
  battles: Battle[];
  activeBattles: Battle[];
  battleHistory: Battle[];
  selectedBattle: Battle | null;
  isLoading: boolean;
  error: string | null;
}

export interface GuildsState {
  guilds: Guild[];
  userGuild: Guild | null;
  guildMembers: GuildMember[];
  isLoading: boolean;
  error: string | null;
}

export interface AchievementsState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  completedAchievements: Achievement[];
  isLoading: boolean;
  error: string | null;
}
