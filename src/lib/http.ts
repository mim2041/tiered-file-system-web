import axios from "axios";
import { API_BASE_URL } from "@/lib/config";
import { tokenStorage } from "@/lib/storage";

export const http = axios.create({ baseURL: API_BASE_URL });

http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
