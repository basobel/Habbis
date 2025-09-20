import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Habit, HabitStats, WeeklyProgress, MonthlyProgress, HabitsResponse, HabitResponse, HabitStatsResponse } from '@/types';
import { habitsApi } from '@/services/api';

interface HabitsState {
  habits: Habit[];
  activeHabits: Habit[];
  selectedHabit: Habit | null;
  stats: HabitStats | null;
  isLoading: boolean;
  error: string | null;
}

// Mock data - w rzeczywistej aplikacji będzie pobierane z API
const mockHabits: Habit[] = [
  {
    id: 1,
    user_id: 1,
    name: 'Poranny jogging',
    description: '30 minut biegania każdego ranka',
    difficulty: 'medium' as const,
    target_frequency: 5,
    target_days: [1, 2, 3, 4, 5],
    reward_config: { xp: 50, gold: 10 },
    base_xp_reward: 50,
    streak_bonus_xp: 10,
    premium_currency_reward: 5,
    current_streak: 7,
    longest_streak: 15,
    total_completions: 45,
    last_completed_at: '2024-01-15T06:30:00Z',
    is_active: true,
    reminders_enabled: true,
    reminder_times: ['06:00'],
    color: '#10B981',
    icon: 'fitness',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T06:30:00Z',
  },
  {
    id: 2,
    user_id: 1,
    name: 'Czytanie książek',
    description: 'Czytanie 20 stron dziennie',
    difficulty: 'easy' as const,
    target_frequency: 7,
    target_days: [0, 1, 2, 3, 4, 5, 6],
    reward_config: { xp: 30, gold: 5 },
    base_xp_reward: 30,
    streak_bonus_xp: 5,
    premium_currency_reward: 2,
    current_streak: 12,
    longest_streak: 25,
    total_completions: 78,
    last_completed_at: '2024-01-15T21:00:00Z',
    is_active: true,
    reminders_enabled: true,
    reminder_times: ['21:00'],
    color: '#3B82F6',
    icon: 'book',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T21:00:00Z',
  },
];

const initialState: HabitsState = {
  habits: mockHabits,
  activeHabits: [], // Będzie obliczane przez selektory
  selectedHabit: null,
  stats: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchHabits = createAsyncThunk<HabitsResponse, { active?: boolean; page?: number }>(
  'habits/fetchHabits',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await habitsApi.getHabits(params);
      return response.data as HabitsResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch habits');
    }
  }
);

export const fetchHabit = createAsyncThunk<HabitResponse, number>(
  'habits/fetchHabit',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await habitsApi.getHabit(id);
      return response.data as HabitResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch habit');
    }
  }
);

export const createHabit = createAsyncThunk<HabitResponse, any>(
  'habits/createHabit',
  async (habitData: any, { rejectWithValue }) => {
    try {
      const response = await habitsApi.createHabit(habitData);
      return response.data as HabitResponse;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create habit');
    }
  }
);

export const updateHabit = createAsyncThunk<HabitResponse, { id: number; data: any }>(
  'habits/updateHabit',
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await habitsApi.updateHabit(id, data);
      return response.data as HabitResponse;
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

export const fetchHabitStats = createAsyncThunk<HabitStatsResponse, void>(
  'habits/fetchHabitStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitsApi.getHabitStats();
      return response.data as HabitStatsResponse;
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
        const habits = Array.isArray(action.payload.habits) 
          ? action.payload.habits 
          : action.payload.habits?.data || [];
        state.habits = habits;
        // activeHabits będzie obliczane przez selektor
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
        // activeHabits będzie obliczane przez selektor
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
        
        // activeHabits będzie obliczane przez selektor
        
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
        // activeHabits będzie obliczane przez selektor
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

// Selektory
export const selectAllHabits = (state: { habits: HabitsState }) => state.habits.habits;
export const selectActiveHabits = (state: { habits: HabitsState }) => 
  state.habits.habits.filter(habit => habit.is_active);
export const selectSelectedHabit = (state: { habits: HabitsState }) => state.habits.selectedHabit;
export const selectHabitsStats = (state: { habits: HabitsState }) => state.habits.stats;
export const selectHabitsLoading = (state: { habits: HabitsState }) => state.habits.isLoading;
export const selectHabitsError = (state: { habits: HabitsState }) => state.habits.error;
