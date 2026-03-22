import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { AxiosError } from "axios";

interface IJoinRequest {
  joinCode: string;
}

export interface IJoinResponse {
  success: boolean;
  message: string;
  data: {
    classId: string;
  };
}

export const joinClass = createAsyncThunk<
  IJoinResponse,
  IJoinRequest,
  { rejectValue: { message: string } }
>("classes/join", async (payload, { rejectWithValue }) => {
  try {

    // Assuming join codes are exactly 6 characters
    if (!payload.joinCode || payload.joinCode.length !== 6) {
      return rejectWithValue({
        message: "Invalid join code. Please enter a 6-character code.",
      });
    }

    const { data } = await apiClient.post<IJoinResponse>(
      "/classes/join",
      payload
    );

    console.log("Join: ",data);

    if (!data.success) {
      return rejectWithValue({
        message: data.message || "Failed to join class",
      });
    }

    return data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue({
      message:
        err.response?.data?.message || "An error occurred while joining the class",
    });
  }
});