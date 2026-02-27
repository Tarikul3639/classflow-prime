import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface UnblockUserPayload {
  classroomId: string;
  userId: string;
}

interface UnblockUserResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    isBlocked: boolean;
  };
}

export const unblockUserThunk = createAsyncThunk<
  UnblockUserResponse,
  UnblockUserPayload,
  { rejectValue: string }
>(
  "classroom/unblockUser",
  async ({ classroomId, userId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<UnblockUserResponse>(
        `/classrooms/${classroomId}/members/unblock`,
        { userId } // Send userId in body
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);