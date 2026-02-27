import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "@/redux/slices/auth/types";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

interface SignUpResponse {
  user: IUser;
  access_token: string;
}

export const signUpThunk = createAsyncThunk<
  { user: IUser },
  SignUpPayload,
  { rejectValue: string }
>("auth/sign-up", async (data, { rejectWithValue }) => {
  try {
    console.log('📝 Signing up...');
    
    const response = await apiClient.post<SignUpResponse>(
      "/auth/sign-up",
      data,
    );
    
    const { user, access_token } = response.data;
    
    console.log('✅ Sign-up successful, user:', user.email);
    console.log('🔑 Access token stored in localStorage');

    // Store auth data in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_data", JSON.stringify(user));
      localStorage.setItem("auth_status", "authenticated");
    }

    return { user };
  } catch (err: any) {
    console.error('❌ Sign-up error:', err);
    return rejectWithValue(extractErrorMessage(err));
  }
});