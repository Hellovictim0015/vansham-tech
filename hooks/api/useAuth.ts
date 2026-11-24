import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { authService } from "@/services/api/auth.service";
import {
  LoginRequest,
  RegisterRequest,
  SendOtpRequest,
  User,
  UpdateProfileRequest,
} from "@/types/auth";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      toast.success("Login successful! Welcome back.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["me"], data.user);
      toast.success("Registration successful! Welcome to Vansham.");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration failed. Please try again.";
      toast.error(message);
    },
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: SendOtpRequest) => authService.sendOtp(data),
    onSuccess: (data) => {
      toast.success(data.message || "OTP sent successfully!");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to send OTP. Please try again.";
      toast.error(message);
    },
  });
};

export const useMe = () => {
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    setToken(Cookies.get("auth_token"));
    setIsTokenChecked(true);
  }, []);

  const query = useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    retry: false,
    staleTime: Infinity,
    enabled: !!token,
  });

  return {
    ...query,
    isLoading: !isTokenChecked || (!!token && query.isLoading),
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    authService.logout();
    queryClient.clear();
    router.push("/");
  };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["me"], updatedUser);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
