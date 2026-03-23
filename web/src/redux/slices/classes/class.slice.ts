import { combineReducers } from "@reduxjs/toolkit";
import createClassReducer from "./reducers/create-class.reducer";
import fetchEnrolledClassesReducer from "./reducers/fetch-enrolled-classes.reducer";
import enrollClassReducer from "./reducers/enroll-class.reducer";
// Import Individual class reducers
import fetchClassReducer from "./reducers/fetch-class.reducer";

export const classReducer = combineReducers({
    createClass: createClassReducer,
    fetchEnrolledClasses: fetchEnrolledClassesReducer,
    enrollClass: enrollClassReducer,
    // Add individual class reducers here
    fetchClass: fetchClassReducer,
});