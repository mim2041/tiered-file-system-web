export {
  registerCustomer,
  resendVerifyEmail,
  verifyEmail,
  loginCustomer,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} from "@/core/api/auth";

export type { RegisterPayload, LoginPayload } from "@/core/api/auth";
