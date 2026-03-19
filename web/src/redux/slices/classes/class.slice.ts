import { combineReducers } from "@reduxjs/toolkit";
import createClassReducer from "./reducers/create-class.reducer";

export const classReducer = combineReducers({
    createClass: createClassReducer,
    // other reducers like updateClass, deleteClass can be added here
});