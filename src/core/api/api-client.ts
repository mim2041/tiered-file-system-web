import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { API_BASE_URL } from "@/lib/config";
import { tokenStorage } from "@/lib/storage";

const API_TIMEOUT = 30000;

export interface SimpleAxiosRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
}

class RestAPI {
  public axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      const cfg = config as unknown as SimpleAxiosRequestConfig;
      if (cfg?.skipAuth) return config;
      const token = tokenStorage.get();
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => Promise.reject(error),
    );
  }

  get = <T = unknown>(
    url: string,
    config?: SimpleAxiosRequestConfig,
  ): Promise<T> =>
    this.axiosInstance.get<T>(url, config).then((res) => res.data);

  post = <T = unknown>(
    url: string,
    payload?: unknown,
    config?: SimpleAxiosRequestConfig,
  ): Promise<T> => {
    const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
    const mergedConfig: SimpleAxiosRequestConfig = {
      ...config,
      headers: {
        ...(isFormData ? { "Content-Type": undefined } : {}),
        ...config?.headers,
      },
    };
    return this.axiosInstance.post<T>(url, payload, mergedConfig).then((res) => res.data);
  };

  patch = <T = unknown>(
    url: string,
    payload?: unknown,
    config?: SimpleAxiosRequestConfig,
  ): Promise<T> =>
    this.axiosInstance.patch<T>(url, payload, config).then((res) => res.data);

  delete = <T = unknown>(
    url: string,
    config?: SimpleAxiosRequestConfig,
  ): Promise<T> =>
    this.axiosInstance.delete<T>(url, config).then((res) => res.data);
}

export const api = new RestAPI();
export const { get, post, patch, delete: del } = api;

// Axios instance export for legacy-style usage (`http.get`, etc.)
export const http = api.axiosInstance;

export default api;

