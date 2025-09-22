import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService } from '@/services/userService';
import { UserProfile, UserStatistics, UserEquipment, UpdateProfileData, AddCurrencyData } from '@/types/user';
import { logger } from '@/utils/logger';
import { updateUser } from './authSlice';

interface UserState {
  profile: UserProfile | null;
  statistics: UserStatistics | null;
  equipment: UserEquipment[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  statistics: null,
  equipment: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const profile = await userService.getProfile();
      return profile;
    } catch (error: any) {
      logger.error('Failed to fetch user profile', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: any, { rejectWithValue, dispatch }) => {
    try {
      const profile = await userService.updateProfile(data);
      // Update auth state with new user data
      dispatch(updateUser({
        username: profile.username,
        email: profile.email,
        avatar_url: profile.avatar_url,
        avatar_icon: profile.avatar_icon,
        level: profile.level,
        experience_points: profile.experience_points,
        regular_currency: profile.regular_currency,
        premium_currency: profile.premium_currency,
        is_premium: profile.is_premium,
        premium_expires_at: profile.premium_expires_at,
        current_streak_days: profile.current_streak_days,
        total_streak_days: profile.total_streak_days,
        last_activity_at: profile.last_activity_at,
        settings: profile.settings,
        statistics: profile.statistics,
        equipment: profile.equipment,
        avatars: profile.avatars,
        active_avatar: profile.active_avatar,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      }));
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const fetchUserStatistics = createAsyncThunk(
  'user/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const statistics = await userService.getStatistics();
      return statistics;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics');
    }
  }
);

export const fetchUserEquipment = createAsyncThunk(
  'user/fetchEquipment',
  async (_, { rejectWithValue }) => {
    try {
      const equipment = await userService.getEquipment();
      return equipment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch equipment');
    }
  }
);

export const equipItem = createAsyncThunk(
  'user/equipItem',
  async (itemId: number, { rejectWithValue }) => {
    try {
      const equipment = await userService.equipItem(itemId);
      return equipment;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to equip item');
    }
  }
);


export const addCurrency = createAsyncThunk(
  'user/addCurrency',
  async (data: { type: 'regular' | 'premium'; amount: number }, { rejectWithValue }) => {
    try {
      const result = await userService.addCurrency(data);
      return result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add currency');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.profile = null;
      state.statistics = null;
      state.equipment = [];
      state.loading = false;
      state.error = null;
    },
    updateProfileLocal: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    updateStatisticsLocal: (state, action: PayloadAction<Partial<UserStatistics>>) => {
      if (state.statistics) {
        state.statistics = { ...state.statistics, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        
        const userData = action.payload;
        state.profile = userData;
        state.statistics = userData.statistics || null;
        state.equipment = userData.equipment || [];
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        // Update auth state with new user data
        // This will be handled by the auth slice through a cross-slice action
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch statistics
      .addCase(fetchUserStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch equipment
      .addCase(fetchUserEquipment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserEquipment.fulfilled, (state, action) => {
        state.loading = false;
        state.equipment = action.payload;
      })
      .addCase(fetchUserEquipment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Equip item
      .addCase(equipItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(equipItem.fulfilled, (state, action) => {
        state.loading = false;
        // Update equipment list
        const itemIndex = state.equipment.findIndex(item => item.id === action.payload.id);
        if (itemIndex !== -1) {
          state.equipment[itemIndex] = action.payload;
        }
      })
      .addCase(equipItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      
      // Add currency
      .addCase(addCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCurrency.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) {
          state.profile.regular_currency = action.payload.regular_currency;
          state.profile.premium_currency = action.payload.premium_currency;
        }
      })
      .addCase(addCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserData, updateProfileLocal, updateStatisticsLocal } = userSlice.actions;
export default userSlice.reducer;
