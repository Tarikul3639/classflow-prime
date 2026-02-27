import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface BlockUserPayload {
  classroomId: string;
  userId: string;
}

interface BlockUserResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    isBlocked: boolean;
  };
}

export const blockUserThunk = createAsyncThunk<
  BlockUserResponse,
  BlockUserPayload,
  { rejectValue: string }
>(
  "classroom/blockUser",
  async ({ classroomId, userId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<BlockUserResponse>(
        `/classrooms/${classroomId}/members/block`,
        { userId } // Send userId in body
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);