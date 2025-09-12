import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Habit, HabitStats, WeeklyProgress, MonthlyProgress } from '@/types';
import { habitsApi } from '@/services/api';

interface HabitsState {
  habits: Habit[];
  activeHabits: Habit[];
  selectedHabit: Habit | null;
  stats: HabitStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: HabitsState = {
  habits: [],
  activeHabits: [],
  selectedHabit: null,
  stats: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchHabits = createAsyncThunk(
  'habits/fetchHabits',
  async (params?: { active?: boolean; page?: number }, { rejectWithValue }) => {
    try {
      const response = await habitsApi.getHabits(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch habits');
    }
  }
);

export const fetchHabit = createAsyncThunk(
  'habits/fetchHabit',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await habitsApi.getHabit(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch habit');
    }
  }
);

export const createHabit = createAsyncThunk(
  'habits/createHabit',
  async (habitData: any, { rejectWithValue }) => {
    try {
      const response = await habitsApi.createHabit(habitData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create habit');
    }
  }
);

export const updateHabit = createAsyncThunk(
  'habits/updateHabit',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await habitsApi.updateHabit(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update habit');
    }
  }
);

export const deleteHabit = createAsyncThunk(
  'habits/deleteHabit',
  async (id: number, { rejectWithValue }) => {
    try {
      await habitsApi.deleteHabit(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete habit');
    }
  }
);

export const completeHabit = createAsyncThunk(
  'habits/completeHabit',
  async ({ id, data }: { id: number; data?: { notes?: string } }, { rejectWithValue }) => {
    try {
      const response = await habitsApi.completeHabit(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete habit');
    }
  }
);

export const skipHabit = createAsyncThunk(
  'habits/skipHabit',
  async ({ id, data }: { id: number; data?: { reason?: string } }, { rejectWithValue }) => {
    try {
      const response = await habitsApi.skipHabit(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to skip habit');
    }
  }
);

export const fetchHabitStats = createAsyncThunk(
  'habits/fetchHabitStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitsApi.getHabitStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch habit stats');
    }
  }
);

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedHabit: (state, action: PayloadAction<Habit | null>) => {
      state.selectedHabit = action.payload;
    },
    updateHabitInList: (state, action: PayloadAction<Habit>) => {
      const index = state.habits.findIndex(habit => habit.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = action.payload;
      }
      
      const activeIndex = state.activeHabits.findIndex(habit => habit.id === action.payload.id);
      if (activeIndex !== -1) {
        state.activeHabits[activeIndex] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch habits
      .addCase(fetchHabits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits = action.payload.habits?.data || action.payload.habits || [];
        state.activeHabits = state.habits.filter(habit => habit.is_active);
        state.error = null;
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch habit
      .addCase(fetchHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedHabit = action.payload.habit;
        state.error = null;
      })
      .addCase(fetchHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create habit
      .addCase(createHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.habits.unshift(action.payload.habit);
        if (action.payload.habit.is_active) {
          state.activeHabits.unshift(action.payload.habit);
        }
        state.error = null;
      })
      .addCase(createHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update habit
      .addCase(updateHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedHabit = action.payload.habit;
        const index = state.habits.findIndex(habit => habit.id === updatedHabit.id);
        if (index !== -1) {
          state.habits[index] = updatedHabit;
        }
        
        const activeIndex = state.activeHabits.findIndex(habit => habit.id === updatedHabit.id);
        if (activeIndex !== -1) {
          state.activeHabits[activeIndex] = updatedHabit;
        }
        
        if (state.selectedHabit?.id === updatedHabit.id) {
          state.selectedHabit = updatedHabit;
        }
        state.error = null;
      })
      .addCase(updateHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete habit
      .addCase(deleteHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        const habitId = action.payload;
        state.habits = state.habits.filter(habit => habit.id !== habitId);
        state.activeHabits = state.activeHabits.filter(habit => habit.id !== habitId);
        if (state.selectedHabit?.id === habitId) {
          state.selectedHabit = null;
        }
        state.error = null;
      })
      .addCase(deleteHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Complete habit
      .addCase(completeHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update habit in lists if needed
        state.error = null;
      })
      .addCase(completeHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Skip habit
      .addCase(skipHabit.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(skipHabit.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update habit in lists if needed
        state.error = null;
      })
      .addCase(skipHabit.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch habit stats
      .addCase(fetchHabitStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHabitStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
        state.error = null;
      })
      .addCase(fetchHabitStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedHabit, updateHabitInList } = habitsSlice.actions;
export default habitsSlice.reducer;
