import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./reducers/user.reducer";

export const profileReducer = combineReducers({
  user: userReducer,
});
export default profileReducer;
