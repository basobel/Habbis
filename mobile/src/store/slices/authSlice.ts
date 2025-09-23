import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';
import { authApi, setAuthToken } from '@/services/api';
import { secureStorage } from '@/utils/secureStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Helper function to save token to secure storage
const saveTokenToStorage = async (token: string) => {
  try {
    await secureStorage.setItem('auth_token', token);
  } catch (error) {
    console.error('Failed to save token to secure storage:', error);
  }
};

// Helper function to remove token from secure storage
const removeTokenFromStorage = async () => {
  try {
    await secureStorage.removeItem('auth_token');
  } catch (error) {
    console.error('Failed to remove token from secure storage:', error);
  }
};

// Async thunks
export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      if (__DEV__) console.log('Login attempt with credentials:', credentials);
      const response = await authApi.login(credentials);
      if (__DEV__) console.log('Login response:', response);
      return response;
    } catch (error: any) {
      if (__DEV__) console.log('Login error:', error);
      if (__DEV__) console.log('Error response data:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterData>(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

export const getMe = createAsyncThunk<{ user: User }, void>(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      if (__DEV__) console.log('getMe: Starting...');
      const response = await authApi.getMe();
      if (__DEV__) console.log('getMe: Response received:', response);
      return response;
    } catch (error: any) {
      if (__DEV__) console.log('getMe: Error occurred:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      setAuthToken(action.payload);
      saveTokenToStorage(action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      setAuthToken(null);
      removeTokenFromStorage();
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Rehydrate from storage
      .addCase(REHYDRATE, (state, action: any) => {
        if (action.payload?.auth?.token) {
          state.token = action.payload.auth.token;
          state.user = action.payload.auth.user;
          state.isAuthenticated = action.payload.auth.isAuthenticated;
          setAuthToken(action.payload.auth.token);
          // Also save to secure storage for consistency
          saveTokenToStorage(action.payload.auth.token);
        }
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        setAuthToken(action.payload.token);
        saveTokenToStorage(action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        setAuthToken(action.payload.token);
        saveTokenToStorage(action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        setAuthToken(null);
        removeTokenFromStorage();
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setToken, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;

// Selektory
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;