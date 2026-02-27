import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

export const leaveClassroomThunk = createAsyncThunk<
  void,
  { classroomId: string },
  { rejectValue: string }
>("classrooms/leave", async ({ classroomId }, { rejectWithValue }) => {
  try {
    await apiClient.post(
      `/classrooms/${classroomId}/leave`,
      { classroomId },
      { withCredentials: true },
    );
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
