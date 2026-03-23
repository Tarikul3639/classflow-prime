import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { AxiosError } from "axios";

interface IEnrollRequest {
  enrollCode: string;
}

export interface IEnrollResponse {
  success: boolean;
  message: string;
  data: {
    classId: string;
  };
}

export const enrollClass = createAsyncThunk<
  IEnrollResponse,
  IEnrollRequest,
  { rejectValue: { message: string } }
>("classes/enroll", async (payload, { rejectWithValue }) => {
  try {

    // Assuming enroll codes are exactly 6 characters
    if (!payload.enrollCode || payload.enrollCode.length !== 6) {
      return rejectWithValue({
        message: "Invalid enroll code. Please enter a 6-character code.",
      });
    }

    const { data } = await apiClient.post<IEnrollResponse>(
      "/classes/enroll",
      payload
    );

    console.log("Enroll: ",data);

    if (!data.success) {
      return rejectWithValue({
        message: data.message || "Failed to enroll class",
      });
    }

    return data;
  } catch (error: unknown) {
    const err = error as AxiosError<{ message?: string }>;
    return rejectWithValue({
      message:
        err.response?.data?.message || "An error occurred while enrolling the class",
    });
  }
});