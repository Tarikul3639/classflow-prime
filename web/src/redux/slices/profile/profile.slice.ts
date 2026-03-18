import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./reducers/user.reducer";
import updateProfileSlice from "./reducers/update.reducer";

export const profileReducer = combineReducers({
  user: userReducer,
  update: updateProfileSlice,
});
export default profileReducer;
