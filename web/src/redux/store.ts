import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/auth/slice";
// import classroomReducer from "./slices/classroom/slice";
// import notificationReducer from "./slices/notifications/notificationSlice";

export const store = configureStore({
  reducer: {
    // auth: authReducer,
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
