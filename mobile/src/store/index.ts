import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from '@reduxjs/toolkit';

// Use different storage for web vs native
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();
import authSlice from './slices/authSlice';
import habitsSlice from './slices/habitsSlice';
import petsSlice from './slices/petsSlice';
import battlesSlice from './slices/battlesSlice';
import guildsSlice from './slices/guildsSlice';
import achievementsSlice from './slices/achievementsSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Tylko auth będzie persistowane
};

const rootReducer = combineReducers({
  auth: authSlice,
  habits: habitsSlice,
  pets: petsSlice,
  battles: battlesSlice,
  guilds: guildsSlice,
  achievements: achievementsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
