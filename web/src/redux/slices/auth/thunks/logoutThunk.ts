import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

export const logoutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await apiClient.post("/auth/sign-out");

    if (typeof window !== "undefined") {
      // Clear all auth-related data
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_data");
      localStorage.removeItem("auth_status");
      
      // Clear client-side auth marker cookie
      document.cookie = "cf_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});
