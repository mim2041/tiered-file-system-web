import { http } from "@/lib/http";
import { unwrapData } from "@/lib/api-response";
import { AuthMeResponse, User } from "@/types/api";

export type RegisterPayload = { name: string; email: string; password: string };
export type LoginPayload = { email: string; password: string };

type LoginRaw = {
  user?: User;
  tokens?: { accessToken?: string; refreshToken?: string };
  accessToken?: string;
};

export async function registerCustomer(payload: RegisterPayload): Promise<User> {
  const { data } = await http.post("/auth/register", payload);
  const u = unwrapData<{ user?: User } | User>(data);
  return (u as { user?: User })?.user ?? (u as User);
}

export async function resendVerifyEmail(payload: { email: string }) {
  const { data } = await http.post("/auth/verify-email/resend", payload);
  return data;
}

export async function verifyEmail(payload: { token: string }) {
  const { data } = await http.post("/auth/verify-email", payload);
  return data;
}

export async function loginCustomer(payload: LoginPayload): Promise<{ accessToken: string }> {
  const { data } = await http.post("/auth/login", payload);
  const raw = unwrapData<LoginRaw>(data);
  const token = raw?.tokens?.accessToken ?? raw?.accessToken;
  if (!token) throw new Error("No access token returned from login");
  return { accessToken: token };
}

export async function getCurrentUser(): Promise<AuthMeResponse> {
  const { data } = await http.get("/auth/me");
  return unwrapData<AuthMeResponse>(data);
}

export async function forgotPassword(payload: { email: string }) {
  const { data } = await http.post("/auth/forgot-password", payload);
  return data;
}

export async function resetPassword(payload: { token: string; newPassword: string }) {
  const { data } = await http.post("/auth/reset-password", payload);
  return data;
}
