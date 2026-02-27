import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

export const deactivateAccountThunk = createAsyncThunk(
  "auth/deactivateAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete("/auth/account");
      
      // Clear all auth-related data
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        localStorage.removeItem("auth_status");
        
        // Clear client-side auth marker cookie
        document.cookie = "cf_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);