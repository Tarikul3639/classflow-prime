import { combineReducers } from '@reduxjs/toolkit';

import sessionReducer from './reducers/session.reducer';
import signupReducer from './reducers/signup.reducer';
import passwordResetReducer from './reducers/password-reset.reducer';

export const authReducer = combineReducers({
  session: sessionReducer,
  signup: signupReducer,
  passwordReset: passwordResetReducer,
});

export default authReducer;