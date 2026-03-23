import { combineReducers } from "@reduxjs/toolkit";
import createClassReducer from "./reducers/create-class.reducer";
import fetchEnrolledClassesReducer from "./reducers/fetch-enrolled-classes.reducer";
import enrollClassReducer from "./reducers/enroll-class.reducer";

export const classReducer = combineReducers({
    createClass: createClassReducer,
    fetchEnrolledClasses: fetchEnrolledClassesReducer,
    enrollClass: enrollClassReducer,
    // other reducers like updateClass, deleteClass can be added here
});