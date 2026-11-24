import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "/api";

console.log("[API] Using Base URL:", API_BASE_URL);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error(`[API Request Error]`, error);
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle Global Errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(
      `[API Response Error] ${error.response?.status} ${error.config?.url}`,
      error.response?.data,
    );

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn("[Auth] 401 detected. Clearing token and redirecting...");
      Cookies.remove("auth_token", { path: "/" });
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = "/"; // Redirect to login only if not already there
      }
    }
    return Promise.reject(error);
  },
);
