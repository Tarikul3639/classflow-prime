import { createAsyncThunk } from "@reduxjs/toolkit";
import { IClassroom } from "@/redux/slices/classroom/types";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

export const joinClassroomThunk = createAsyncThunk<
  IClassroom,
  string, // joinCode
  { rejectValue: string }
>("classroom/join", async (joinCode, { rejectWithValue }) => {
  try {
    console.log("🔄 Attempting to join classroom with code:", joinCode);
    const response = await apiClient.post<{ classroom: IClassroom }>(
      "/classrooms/join",
      { joinCode },
      {
        withCredentials: true,
      },
    );
    console.log("✅ Join classroom response:", response.data);
    if (!response) throw new Error("Failed to join classroom");
    return response.data.classroom;
  } catch (error) {
    console.error("❌ Join classroom error:", error);
    return rejectWithValue(extractErrorMessage(error));
  }
});
