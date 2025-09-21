import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { userService, UserProfile, UserStatistics, UserEquipment, UserAvatar } from '@/services/userService';

interface UserState {
  profile: UserProfile | null;
  statistics: UserStatistics | null;
  equipment: UserEquipment[];
  avatars: UserAvatar[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  statistics: null,
  equipment: [],
  avatars: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Redux: fetchUserProfile thunk starting');
      const profile = await userService.getProfile();
      console.log('Redux: fetchUserProfile thunk success', profile);
      return profile;
    } catch (error: any) {
      console.error('Redux: fetchUserProfile thunk error', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (data: any, { rejectWithValue }) => {
    try {
      const profile = await userService.updateProfile(data);
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

export const fetchUserAvatars = createAsyncThunk(
  'user/fetchAvatars',
  async (_, { rejectWithValue }) => {
    try {
      const avatars = await userService.getAvatars();
      return avatars;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch avatars');
    }
  }
);

export const setActiveAvatar = createAsyncThunk(
  'user/setActiveAvatar',
  async (avatarId: number, { rejectWithValue }) => {
    try {
      const avatar = await userService.setActiveAvatar(avatarId);
      return avatar;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set active avatar');
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
      state.avatars = [];
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
        console.log('Redux: fetchUserProfile.fulfilled', action.payload);
        state.loading = false;
        
        // action.payload is now directly the user data (not wrapped in {success, data})
        const userData = action.payload;
        state.profile = userData;
        state.statistics = userData.statistics || null;
        state.equipment = userData.equipment || [];
        state.avatars = userData.avatars || [];
        
        console.log('Redux: state updated', { 
          profile: !!state.profile, 
          statistics: !!state.statistics,
          profileUsername: state.profile?.username,
          profileLevel: state.profile?.level
        });
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
      
      // Fetch avatars
      .addCase(fetchUserAvatars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAvatars.fulfilled, (state, action) => {
        state.loading = false;
        state.avatars = action.payload;
      })
      .addCase(fetchUserAvatars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Set active avatar
      .addCase(setActiveAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setActiveAvatar.fulfilled, (state, action) => {
        state.loading = false;
        // Update avatars list
        const avatarIndex = state.avatars.findIndex(avatar => avatar.id === action.payload.id);
        if (avatarIndex !== -1) {
          state.avatars[avatarIndex] = action.payload;
        }
        // Update profile if it exists
        if (state.profile) {
          state.profile.active_avatar = action.payload;
        }
      })
      .addCase(setActiveAvatar.rejected, (state, action) => {
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
