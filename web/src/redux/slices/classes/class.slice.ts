import { combineReducers } from "@reduxjs/toolkit";
import createClassReducer from "./reducers/create-class.reducer";
import fetchClassesReducer from "./reducers/fetch-classes.reducer";

export const classReducer = combineReducers({
    createClass: createClassReducer,
    fetchClasses: fetchClassesReducer,
    // other reducers like updateClass, deleteClass can be added here
});