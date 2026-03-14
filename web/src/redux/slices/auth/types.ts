export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type User = {
  _id?: string;
  email: string;
  firstName: string;
  lastName?: string;
  fullName?: string;
  role?: string;
  status?: string;
  avatarUrl?: string | null;
  isEmailVerified?: boolean;
};

// ---------- Requests (DTO-like) ----------
export type SignInRequest = {
  email: string;
  password: string;
};

export type SignOutRequest = {
  refreshToken?: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
};

export type VerifySignupEmailRequest = {
  email: string;
  code: string; // ✅ you confirmed `code`
};

export type ResendSignupVerificationRequest = {
  email: string;
};

export type RequestPasswordResetRequest = {
  email: string;
};

export type VerifyPasswordResetRequest = {
  email: string;
  code: string; // ✅ you confirmed `code`
};

export type ConfirmPasswordResetRequest = {
  email: string;
  code: string;
  newPassword: string; // min length 6 enforced server side
};

// ---------- Responses (adjust if your backend differs) ----------
export type SignInResponse = {
  user: User;
  tokens: Tokens;
};

export type MeResponse = User;

export type MessageResponse = {
  message: string;
  user?: User;
};