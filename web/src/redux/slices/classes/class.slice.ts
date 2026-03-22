import { combineReducers } from "@reduxjs/toolkit";
import createClassReducer from "./reducers/create-class.reducer";
import fetchClassesReducer from "./reducers/fetch-classes.reducer";
import joinClassReducer from "./reducers/join-class.reducer";

export const classReducer = combineReducers({
    createClass: createClassReducer,
    fetchClasses: fetchClassesReducer,
    joinClass: joinClassReducer,
    // other reducers like updateClass, deleteClass can be added here
});