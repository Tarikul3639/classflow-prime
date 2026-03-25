import { configureStore, combineReducers } from "@reduxjs/toolkit";

// Auth slices
import signinReducer from "./features/auth/slices/signin.slice";
import signupReducer from "./features/auth/slices/signup.slice";
import signoutReducer from "./features/auth/slices/signout.slice";
import passwordResetReducer from "./features/auth/slices/password-reset.slice";

// Combine auth slices
const authReducer = combineReducers({
  signin: signinReducer,
  signup: signupReducer,
  signout: signoutReducer,
  passwordReset: passwordResetReducer,
});

// Classes slices
import createClassReducer from "./features/classes/slices/create-class.slice";
import enrollClass from "./features/classes/slices/enroll-class.slice";
import fetchClassOverviewReducer from "./features/classes/slices/fetch-class-overview.slice";
import fetchClassUpdatesReducer from "./features/classes/slices/fetch-class-updates.slice";
import createClassUpdateReducer from "./features/classes/slices/create-class-update.slice";
import fetchSingleClassReducer from "./features/classes/slices/fetch-single-class.slice";
import fetchEnrolledClassesReducer from "./features/classes/slices/fetch-enrolled-classes.slice";
import fetchClassUpdateByIdReducer from "./features/classes/slices/fetch-class-update-by-id.slice";
import updateClassUpdateReducer from "./features/classes/slices/update-class-update.slice";

const classesReducer = combineReducers({
  createClass: createClassReducer,
  enrollClass: enrollClass,
  fetchClassOverview: fetchClassOverviewReducer,
  fetchClassUpdates: fetchClassUpdatesReducer,
  createClassUpdate: createClassUpdateReducer,
  fetchSingleClass: fetchSingleClassReducer,
  fetchEnrolledClasses: fetchEnrolledClassesReducer,
  fetchClassUpdateById: fetchClassUpdateByIdReducer,
  updateClassUpdate: updateClassUpdateReducer,
});

// Profile slices
import fetchUserReducer from "./features/profile/slices/fetch-user.slice";
import updateProfileReducer from "./features/profile/slices/update-profile.slice";

const profileReducer = combineReducers({
  fetchUser: fetchUserReducer,
  updateProfile: updateProfileReducer,
});

// // Notifications slices
// import fetchNotificationsReducer from "./features/notifications/slices/fetch-notifications.slice";
// import markAsReadReducer from "./features/notifications/slices/mark-as-read.slice";

// const notificationsReducer = combineReducers({
//   fetchNotifications: fetchNotificationsReducer,
//   markAsRead: markAsReadReducer,
// });

// Root store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    classes: classesReducer,
    profile: profileReducer,
    // notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;