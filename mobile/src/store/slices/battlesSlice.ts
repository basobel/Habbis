import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Battle } from '@/types';
import { battlesApi } from '@/services/api';

interface BattlesState {
  battles: Battle[];
  activeBattles: Battle[];
  battleHistory: Battle[];
  selectedBattle: Battle | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BattlesState = {
  battles: [],
  activeBattles: [],
  battleHistory: [],
  selectedBattle: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchBattles = createAsyncThunk(
  'battles/fetchBattles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await battlesApi.getBattles();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch battles');
    }
  }
);

export const fetchBattle = createAsyncThunk(
  'battles/fetchBattle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await battlesApi.getBattle(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch battle');
    }
  }
);

export const createBattle = createAsyncThunk(
  'battles/createBattle',
  async (battleData: any, { rejectWithValue }) => {
    try {
      const response = await battlesApi.createBattle(battleData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create battle');
    }
  }
);

export const challengeBattle = createAsyncThunk(
  'battles/challengeBattle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await battlesApi.challengeBattle(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to challenge battle');
    }
  }
);

export const acceptBattle = createAsyncThunk(
  'battles/acceptBattle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await battlesApi.acceptBattle(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept battle');
    }
  }
);

export const declineBattle = createAsyncThunk(
  'battles/declineBattle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await battlesApi.declineBattle(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to decline battle');
    }
  }
);

export const makeMove = createAsyncThunk(
  'battles/makeMove',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await battlesApi.makeMove(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to make move');
    }
  }
);

const battlesSlice = createSlice({
  name: 'battles',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBattle: (state, action: PayloadAction<Battle | null>) => {
      state.selectedBattle = action.payload;
    },
    updateBattleInList: (state, action: PayloadAction<Battle>) => {
      const index = state.battles.findIndex(battle => battle.id === action.payload.id);
      if (index !== -1) {
        state.battles[index] = action.payload;
      }
      
      const activeIndex = state.activeBattles.findIndex(battle => battle.id === action.payload.id);
      if (activeIndex !== -1) {
        state.activeBattles[activeIndex] = action.payload;
      }
      
      if (state.selectedBattle?.id === action.payload.id) {
        state.selectedBattle = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch battles
      .addCase(fetchBattles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBattles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.battles = action.payload.battles || action.payload || [];
        state.activeBattles = state.battles.filter(battle => 
          battle.status === 'pending' || battle.status === 'in_progress'
        );
        state.battleHistory = state.battles.filter(battle => 
          battle.status === 'completed' || battle.status === 'cancelled'
        );
        state.error = null;
      })
      .addCase(fetchBattles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch battle
      .addCase(fetchBattle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBattle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBattle = action.payload.battle;
        state.error = null;
      })
      .addCase(fetchBattle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create battle
      .addCase(createBattle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBattle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.battles.unshift(action.payload.battle);
        state.activeBattles.unshift(action.payload.battle);
        state.error = null;
      })
      .addCase(createBattle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Challenge battle
      .addCase(challengeBattle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(challengeBattle.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update battle in lists if needed
        state.error = null;
      })
      .addCase(challengeBattle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Accept battle
      .addCase(acceptBattle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptBattle.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update battle in lists if needed
        state.error = null;
      })
      .addCase(acceptBattle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Decline battle
      .addCase(declineBattle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(declineBattle.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update battle in lists if needed
        state.error = null;
      })
      .addCase(declineBattle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Make move
      .addCase(makeMove.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(makeMove.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update battle in lists if needed
        state.error = null;
      })
      .addCase(makeMove.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedBattle, updateBattleInList } = battlesSlice.actions;
export default battlesSlice.reducer;
