import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUser } from "@/redux/slices/auth/types";
import { apiClient } from "@/lib/api/axios";
import { extractErrorMessage } from "@/lib/utils/error.utils";

export const verifyAuthThunk = createAsyncThunk<
  IUser,
  void,
  { rejectValue: string }
>("auth/verify", async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get<{ user: IUser }>("/auth/verify");
    console.log("userThunk response:", response.data);
    return response.data.user;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});
