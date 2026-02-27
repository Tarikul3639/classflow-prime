import { createAsyncThunk } from "@reduxjs/toolkit";
import { IClassroom } from "@/redux/slices/classroom/types";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";
import { CreateClassroomPayload } from "@/types/classroom/create.classroom";

export const createClassroomThunk = createAsyncThunk<
  IClassroom,
  CreateClassroomPayload,
  { rejectValue: string }
>("classroom/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{ classroom: IClassroom }>(
      "/classrooms",
      payload,
      {
        withCredentials: true,
      },
    );

    if (!response) throw new Error("Failed to create classroom");
    return response.data.classroom;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});
