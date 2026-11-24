import { apiClient } from "@/lib/api/client";
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
  SendOtpRequest,
} from "@/types/auth";
import Cookies from "js-cookie";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>("/auth/login", data);
    // Handle both { token, user } and { data: { token, user } } structures
    const result = response.data.data || response.data;
    const { token } = result;
    if (token) {
      Cookies.set("auth_token", token, {
        expires: 7,
        path: "/",
      });
    }
    return result as AuthResponse;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<any>("/auth/register", data);
    const result = response.data.data || response.data;
    const { token } = result;
    if (token) {
      Cookies.set("auth_token", token, {
        expires: 7,
        path: "/",
      });
    }
    return result as AuthResponse;
  },

  sendOtp: async (data: SendOtpRequest): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/auth/send-otp-new",
      data,
    );
    return response.data;
  },

  logout: () => {
    Cookies.remove("auth_token", { path: "/" });
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  },

  getMe: async (): Promise<User> => {
    console.log("[Auth] Calling getMe...");
    const response = await apiClient.get<any>("/auth/me");
    console.log("[Auth] getMe response:", response.status);
    const result = response.data.data || response.data;
    return result as User;
  },

  updateProfile: async (data: { name: string }): Promise<User> => {
    const response = await apiClient.put<any>("/auth/update/profile", data);
    const result = response.data.data || response.data;
    return result as User;
  },
};
