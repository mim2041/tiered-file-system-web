import { http } from "./api-client";
import { API_ENDPOINTS } from "./endpoints";
import { unwrapData } from "@/lib/api-response";
import type { AuthMeResponse, User } from "@/types/api";

export type RegisterPayload = { name: string; email: string; password: string };
export type LoginPayload = { email: string; password: string };

type LoginRaw = {
  user?: User;
  tokens?: { accessToken?: string; refreshToken?: string };
  accessToken?: string;
};

export async function registerCustomer(payload: RegisterPayload): Promise<User> {
  const { data } = await http.post(API_ENDPOINTS.AUTH.REGISTER, payload);
  const u = unwrapData<{ user?: User } | User>(data);
  return (u as { user?: User })?.user ?? (u as User);
}

export async function resendVerifyEmail(payload: { email: string }) {
  const { data } = await http.post(API_ENDPOINTS.AUTH.RESEND_VERIFY_EMAIL, payload);
  return data;
}

export async function verifyEmail(payload: { token: string }) {
  const { data } = await http.post(API_ENDPOINTS.AUTH.VERIFY_EMAIL, payload);
  return data;
}

export async function loginCustomer(payload: LoginPayload): Promise<{ accessToken: string }> {
  const { data } = await http.post(API_ENDPOINTS.AUTH.LOGIN, payload);
  const raw = unwrapData<LoginRaw>(data);
  const token = raw?.tokens?.accessToken ?? raw?.accessToken;
  if (!token) throw new Error("No access token returned from login");
  return { accessToken: token };
}

export async function getCurrentUser(): Promise<AuthMeResponse> {
  const { data } = await http.get(API_ENDPOINTS.AUTH.ME);
  return unwrapData<AuthMeResponse>(data);
}

export async function forgotPassword(payload: { email: string }) {
  const { data } = await http.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload);
  return data;
}

export async function resetPassword(payload: { token: string; newPassword: string }) {
  const { data } = await http.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload);
  return data;
}

