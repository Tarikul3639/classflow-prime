import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
export const changePasswordThunk = createAsyncThunk<
  void,
  ChangePasswordPayload,
  { rejectValue: string }
>("auth/changePassword", async (payload, { rejectWithValue }) => {
  try {
    await apiClient.post("/auth/change-password", payload);
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});
