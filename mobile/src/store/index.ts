import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import habitsSlice from './slices/habitsSlice';
import petsSlice from './slices/petsSlice';
import battlesSlice from './slices/battlesSlice';
import guildsSlice from './slices/guildsSlice';
import achievementsSlice from './slices/achievementsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    habits: habitsSlice,
    pets: petsSlice,
    battles: battlesSlice,
    guilds: guildsSlice,
    achievements: achievementsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
