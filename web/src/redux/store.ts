import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/auth/auth.slice';
import profileReducer from './slices/profile/profile.slice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    // classroom: classroomReducer,
    // notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
