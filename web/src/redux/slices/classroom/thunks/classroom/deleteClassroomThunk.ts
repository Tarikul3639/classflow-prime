import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface DeleteClassroomArgs {
  classroomId: string;
}

export const deleteClassroomThunk = createAsyncThunk<
  any, // return type
  DeleteClassroomArgs, // argument type
  { rejectValue: string } // thunk API config
>("classroom/deleteClassroom", async ({ classroomId }, { rejectWithValue }) => {
  try {
    const response = await apiClient.delete(`/classrooms/${classroomId}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
