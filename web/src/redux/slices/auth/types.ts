export interface IUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: "student" | "teacher" | "admin";
  isEmailVerified: boolean;
  avatarUrl?: string;
  studentId?: string;
  department?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface IRequestStatus {
  loading: boolean;
  error: string | null;
  message: string | null;
}

export interface IAuthState {
  user: IUser | null;
  isAuthenticated: boolean;

  requestStatus: {
    signIn: IRequestStatus;
    signUp: IRequestStatus;
    signOut: IRequestStatus;
    getCurrentUser: IRequestStatus;
    verifyEmail: IRequestStatus;
    resendVerification: IRequestStatus;
    sendPasswordResetOTP: IRequestStatus;
    resendPasswordResetOTP: IRequestStatus;
    resetPassword: IRequestStatus;
    verifyPasswordResetOTP: IRequestStatus;
  };
}

// Request/Response types
export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  role?: "student" | "teacher" | "admin";
  phone?: string;
  studentId?: string;
  department?: string;
  avatarUrl?: string;
}

export interface AuthResponse {
  message: string;
  user: IUser;
  tokens: ITokens;
  emailVerified?: boolean;
}

export interface VerifyEmailPayload {
  email: string;
  code: string;
}

export interface ResendVerificationPayload {
  email: string;
}
