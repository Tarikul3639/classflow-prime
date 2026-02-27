import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface AssignRolePayload {
  classroomId: string;
  userId: string;
  role: "co_admin" | "member";
}

interface AssignRoleResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    role: string;
  };
}

export const assignRoleThunk = createAsyncThunk<
  AssignRoleResponse,
  AssignRolePayload,
  { rejectValue: string }
>(
  "classroom/assignRole",
  async ({ classroomId, userId, role }, { rejectWithValue }) => {
    try {
      const response = await apiClient.patch<AssignRoleResponse>(
        `/classrooms/${classroomId}/members/assign-role`,
        { userId, role }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);