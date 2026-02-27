import { createAsyncThunk } from "@reduxjs/toolkit";
import { IClassroom } from "@/redux/slices/classroom/types";
import { extractErrorMessage } from "@/lib/utils/error.utils";
import { apiClient } from "@/lib/api/axios";

export const fetchClassroomThunk = createAsyncThunk<
  IClassroom,
  string, // classroomId
  { rejectValue: string }
>("classroom/fetchClassroom", async (classroomId, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{ classroom: IClassroom }>(
      `/classrooms/${classroomId}`,
      { withCredentials: true }
    );

    console.log("fetchClassroomThunk response:", response.data);

    if (!response.data?.classroom) {
      throw new Error("Failed to fetch classroom");
    }

    return response.data.classroom;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
