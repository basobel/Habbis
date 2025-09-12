import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Guild, GuildMember } from '@/types';
import { guildsApi } from '@/services/api';

interface GuildsState {
  guilds: Guild[];
  userGuild: Guild | null;
  guildMembers: GuildMember[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GuildsState = {
  guilds: [],
  userGuild: null,
  guildMembers: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchGuilds = createAsyncThunk(
  'guilds/fetchGuilds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await guildsApi.getGuilds();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guilds');
    }
  }
);

export const fetchGuild = createAsyncThunk(
  'guilds/fetchGuild',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await guildsApi.getGuild(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch guild');
    }
  }
);

export const createGuild = createAsyncThunk(
  'guilds/createGuild',
  async (guildData: any, { rejectWithValue }) => {
    try {
      const response = await guildsApi.createGuild(guildData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create guild');
    }
  }
);

export const updateGuild = createAsyncThunk(
  'guilds/updateGuild',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await guildsApi.updateGuild(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update guild');
    }
  }
);

export const deleteGuild = createAsyncThunk(
  'guilds/deleteGuild',
  async (id: number, { rejectWithValue }) => {
    try {
      await guildsApi.deleteGuild(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete guild');
    }
  }
);

export const joinGuild = createAsyncThunk(
  'guilds/joinGuild',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await guildsApi.joinGuild(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to join guild');
    }
  }
);

export const leaveGuild = createAsyncThunk(
  'guilds/leaveGuild',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await guildsApi.leaveGuild(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave guild');
    }
  }
);

export const promoteMember = createAsyncThunk(
  'guilds/promoteMember',
  async ({ id, data }: { id: number; data: { user_id: number; role: string } }, { rejectWithValue }) => {
    try {
      const response = await guildsApi.promoteMember(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to promote member');
    }
  }
);

export const kickMember = createAsyncThunk(
  'guilds/kickMember',
  async ({ id, data }: { id: number; data: { user_id: number } }, { rejectWithValue }) => {
    try {
      const response = await guildsApi.kickMember(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to kick member');
    }
  }
);

const guildsSlice = createSlice({
  name: 'guilds',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUserGuild: (state, action: PayloadAction<Guild | null>) => {
      state.userGuild = action.payload;
    },
    updateGuildInList: (state, action: PayloadAction<Guild>) => {
      const index = state.guilds.findIndex(guild => guild.id === action.payload.id);
      if (index !== -1) {
        state.guilds[index] = action.payload;
      }
      
      if (state.userGuild?.id === action.payload.id) {
        state.userGuild = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch guilds
      .addCase(fetchGuilds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuilds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guilds = action.payload.guilds || action.payload || [];
        state.error = null;
      })
      .addCase(fetchGuilds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch guild
      .addCase(fetchGuild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuild.fulfilled, (state, action) => {
        state.isLoading = false;
        // Handle guild data if needed
        state.error = null;
      })
      .addCase(fetchGuild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create guild
      .addCase(createGuild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createGuild.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guilds.unshift(action.payload.guild);
        state.userGuild = action.payload.guild;
        state.error = null;
      })
      .addCase(createGuild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update guild
      .addCase(updateGuild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateGuild.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedGuild = action.payload.guild;
        const index = state.guilds.findIndex(guild => guild.id === updatedGuild.id);
        if (index !== -1) {
          state.guilds[index] = updatedGuild;
        }
        
        if (state.userGuild?.id === updatedGuild.id) {
          state.userGuild = updatedGuild;
        }
        state.error = null;
      })
      .addCase(updateGuild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete guild
      .addCase(deleteGuild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteGuild.fulfilled, (state, action) => {
        state.isLoading = false;
        const guildId = action.payload;
        state.guilds = state.guilds.filter(guild => guild.id !== guildId);
        if (state.userGuild?.id === guildId) {
          state.userGuild = null;
        }
        state.error = null;
      })
      .addCase(deleteGuild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Join guild
      .addCase(joinGuild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinGuild.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update guild in lists if needed
        state.error = null;
      })
      .addCase(joinGuild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Leave guild
      .addCase(leaveGuild.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(leaveGuild.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userGuild = null;
        state.error = null;
      })
      .addCase(leaveGuild.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Promote member
      .addCase(promoteMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(promoteMember.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update guild in lists if needed
        state.error = null;
      })
      .addCase(promoteMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Kick member
      .addCase(kickMember.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(kickMember.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update guild in lists if needed
        state.error = null;
      })
      .addCase(kickMember.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setUserGuild, updateGuildInList } = guildsSlice.actions;
export default guildsSlice.reducer;
