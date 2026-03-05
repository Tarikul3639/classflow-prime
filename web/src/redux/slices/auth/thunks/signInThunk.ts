import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "@/redux/slices/auth/types";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/api/error.utils";

interface SignInPayload {
  email: string;
  password: string;
}

interface SignInResponse {
  user: IUser;
  access_token: string;
}

export const signInThunk = createAsyncThunk<
  { user: IUser; fromCache?: boolean },
  SignInPayload,
  { rejectValue: string }
>("auth/sign-in", async (data, { rejectWithValue }) => {
  try {
    console.log('🔐 Signing in...');
    
    const response = await apiClient.post<SignInResponse>(
      "/auth/sign-in",
      data,
    );
    
    const { user, access_token } = response.data;
    
    console.log('✅ Sign-in successful, user:', user.email);
    console.log('🔑 Access token stored in localStorage');

    // Store auth data in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user_data", JSON.stringify(user));
      localStorage.setItem("auth_status", "authenticated");
    }

    return { user };
  } catch (err: any) {
    console.error('❌ Sign-in error:', err);
    
    // If offline, try to use cached user data
    if (!err.response && (err.message === 'Network Error' || err.code === 'ERR_NETWORK')) {
      console.log('📴 Offline mode - checking for cached credentials');
      
      if (typeof window !== "undefined") {
        const cachedUser = localStorage.getItem("user_data");
        const cachedToken = localStorage.getItem("access_token");
        
        if (cachedUser && cachedToken) {
          console.log('✅ Using cached user data');
          return {
            user: JSON.parse(cachedUser),
            fromCache: true,
          };
        }
      }
    }
    
    return rejectWithValue(extractErrorMessage(err));
  }
});