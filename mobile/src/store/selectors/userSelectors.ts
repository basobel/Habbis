import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { userService } from '@/services/userService';

// Base selectors
export const selectUserState = (state: RootState) => state.user;

export const selectUserProfile = createSelector(
  [selectUserState],
  (userState) => userState.profile
);

export const selectUserStatistics = createSelector(
  [selectUserState],
  (userState) => userState.statistics
);

export const selectUserEquipment = createSelector(
  [selectUserState],
  (userState) => userState.equipment
);

export const selectUserAvatars = createSelector(
  [selectUserState],
  (userState) => userState.avatars
);

export const selectUserLoading = createSelector(
  [selectUserState],
  (userState) => userState.loading
);

export const selectUserError = createSelector(
  [selectUserState],
  (userState) => userState.error
);

// Computed selectors
export const selectLevelProgress = createSelector(
  [selectUserProfile],
  (profile) => {
    if (!profile) {
      return { current: 0, required: 100, percentage: 0 };
    }
    return userService.calculateLevelProgress(profile.experience_points, profile.level);
  }
);

export const selectUserDisplayName = createSelector(
  [selectUserProfile],
  (profile) => profile?.username || 'Użytkownik'
);

export const selectUserLevel = createSelector(
  [selectUserProfile],
  (profile) => profile?.level || 1
);

export const selectUserCurrencies = createSelector(
  [selectUserProfile],
  (profile) => ({
    regular: profile?.regular_currency || 0,
    premium: profile?.premium_currency || 0,
  })
);

export const selectUserStreak = createSelector(
  [selectUserProfile],
  (profile) => profile?.current_streak_days || 0
);

export const selectUserAchievements = createSelector(
  [selectUserProfile],
  (profile) => profile?.achievements || []
);

export const selectIsUserPremium = createSelector(
  [selectUserProfile],
  (profile) => profile?.is_premium || false
);

// Complex selectors
export const selectUserStats = createSelector(
  [selectUserProfile, selectUserStatistics, selectLevelProgress],
  (profile, statistics, levelProgress) => ({
    level: profile?.level || 1,
    experience: profile?.experience_points || 0,
    levelProgress,
    streak: profile?.current_streak_days || 0,
    totalStreak: profile?.total_streak_days || 0,
    achievements: profile?.achievements?.length || 0,
    isPremium: profile?.is_premium || false,
    statistics,
  })
);
