export interface User {
  id: number;
  name: string;
  mobile_number: string;
  referral_number: string | null;
  referral_status: number;
  my_referral_code: string;
  payment: number;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  mobile_number: string;
  password?: string;
}

export interface RegisterRequest {
  name: string;
  mobile_number: string;
  password?: string;
  otp: string;
}

export interface SendOtpRequest {
  mobile_number: string;
}

export interface UpdateProfileRequest {
  name: string;
}
