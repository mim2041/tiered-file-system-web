export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    VERIFY_EMAIL: "/auth/verify-email",
    RESEND_VERIFY_EMAIL: "/auth/verify-email/resend",
  },

  FILES: {
    ROOT: "/files",
    BY_ID: (id: string) => `/files/${id}`,
  },

  FOLDERS: {
    ROOT: "/folders",
    BY_ID: (id: string) => `/folders/${id}`,
  },

  PACKAGES: {
    LIST: "/packages",
  },

  SUBSCRIPTIONS: {
    ACTIVATE: "/subscriptions/activate",
    ME: "/subscriptions/me",
  },
} as const;

