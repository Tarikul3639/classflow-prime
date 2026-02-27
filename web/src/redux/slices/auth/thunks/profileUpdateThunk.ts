import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface ProfileUpdatePayload {
  name: string;
  avatarUrl?: string | File;
}
interface ProfileUpdateResponse {
  _id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export const profileUpdateThunk = createAsyncThunk(
  "auth/profileUpdate",
  async (payload: ProfileUpdatePayload, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      if (payload.avatarUrl) {
        if (typeof payload.avatarUrl === "string") {
          formData.append("avatarUrl", payload.avatarUrl);
        } else {
          formData.append("avatar", payload.avatarUrl);
        }
      }
      const response = await apiClient.put<ProfileUpdateResponse>(
        "/auth/profile",
        formData,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        extractErrorMessage(error) || "Failed to update profile",
      );
    }
  },
);
