import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Achievement, UserAchievement } from '@/types';
import { achievementsApi } from '@/services/api';

interface AchievementsState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  completedAchievements: Achievement[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AchievementsState = {
  achievements: [],
  userAchievements: [],
  completedAchievements: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchAchievements = createAsyncThunk(
  'achievements/fetchAchievements',
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementsApi.getAchievements();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch achievements');
    }
  }
);

export const fetchAchievement = createAsyncThunk(
  'achievements/fetchAchievement',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await achievementsApi.getAchievement(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch achievement');
    }
  }
);

export const fetchUserProgress = createAsyncThunk(
  'achievements/fetchUserProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await achievementsApi.getUserProgress();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user progress');
    }
  }
);

const achievementsSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateUserAchievement: (state, action: PayloadAction<UserAchievement>) => {
      const index = state.userAchievements.findIndex(
        ua => ua.user_id === action.payload.user_id && ua.achievement_id === action.payload.achievement_id
      );
      
      if (index !== -1) {
        state.userAchievements[index] = action.payload;
      } else {
        state.userAchievements.push(action.payload);
      }
      
      // Update completed achievements if achievement is completed
      if (action.payload.is_completed) {
        const achievement = state.achievements.find(a => a.id === action.payload.achievement_id);
        if (achievement && !state.completedAchievements.find(ca => ca.id === achievement.id)) {
          state.completedAchievements.push(achievement);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch achievements
      .addCase(fetchAchievements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.achievements = action.payload.achievements || action.payload || [];
        state.error = null;
      })
      .addCase(fetchAchievements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch achievement
      .addCase(fetchAchievement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAchievement.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle individual achievement if needed
        state.error = null;
      })
      .addCase(fetchAchievement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch user progress
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userAchievements = action.payload.user_achievements || action.payload || [];
        state.completedAchievements = state.achievements.filter(achievement =>
          state.userAchievements.some(ua => 
            ua.achievement_id === achievement.id && ua.is_completed
          )
        );
        state.error = null;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, updateUserAchievement } = achievementsSlice.actions;
export default achievementsSlice.reducer;
