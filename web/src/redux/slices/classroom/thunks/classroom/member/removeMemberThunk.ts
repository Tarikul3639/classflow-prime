import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface RemoveMemberPayload {
  classroomId: string;
  memberId: string;
}

interface RemoveMemberResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    removedAt: string;
  };
}

export const removeMemberThunk = createAsyncThunk<
  RemoveMemberResponse,
  RemoveMemberPayload,
  { rejectValue: string }
>(
  "classroom/removeMember",
  async ({ classroomId, memberId }, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete<RemoveMemberResponse>(
        `/classrooms/${classroomId}/members/${memberId}`, // memberId in URL
      );
      if (!response.data.success) {
        return rejectWithValue("Failed to remove member");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);
