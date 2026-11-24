import { apiClient } from "@/lib/api/client";

// Types
export interface KulRatna {
  id: number;
  tree_id: number;
  member_id: number;
  title: string;
  description: string;
  created_at: string;
  full_name: string;
}

export interface AddKulRatnaRequest {
  member_id: number;
  title: string;
  description: string;
}

export interface AddKulRatnaResponse {
  message: string;
  id: number;
}

export interface BiopicRequest {
  member_id: string;
  title: string;
  bio: string;
  photo: File;
}

export interface BiopicResponse {
  success: boolean;
  message: string;
  request_id: number;
  order_id: string;
  amount: number;
}

export interface VerifyBiopicPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  request_id: number;
}

// Service
export const kulRatnaService = {
  getAll: async (): Promise<KulRatna[]> => {
    const response = await apiClient.get<KulRatna[]>("/kul-ratna/my");
    return response.data;
  },

  add: async (data: AddKulRatnaRequest): Promise<AddKulRatnaResponse> => {
    const response = await apiClient.post<AddKulRatnaResponse>(
      "/kul-ratna",
      data,
    );
    return response.data;
  },

  requestBiopic: async (data: BiopicRequest): Promise<BiopicResponse> => {
    const formData = new FormData();
    formData.append("member_id", data.member_id);
    formData.append("title", data.title);
    formData.append("bio", data.bio);
    formData.append("photo", data.photo);

    const response = await apiClient.post<any>(
      "/kul-ratna-request",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data || response.data;
  },

  verifyBiopicPayment: async (data: VerifyBiopicPaymentRequest) => {
    const response = await apiClient.post("/verify-kul-ratna-payment", data);
    return response.data;
  },
};
