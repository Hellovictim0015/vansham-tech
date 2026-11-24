import { apiClient } from "@/lib/api/client";

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

export interface CreateOrderResponse {
  success: boolean;
  order: RazorpayOrder;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
}

export const paymentService = {
  createOrder: async (
    amount: number,
    currency: string = "INR",
  ): Promise<CreateOrderResponse> => {
    const response = await apiClient.post<any>("/payment/create-order", {
      amount,
      currency,
    });
    const result = response.data.data || response.data;

    // Normalize: If the backend returns the raw Razorpay order directly
    if (result && result.id && result.entity === "order" && !result.success) {
      return {
        success: true,
        order: result as RazorpayOrder,
      };
    }

    return result as CreateOrderResponse;
  },

  verifyPayment: async (
    data: VerifyPaymentRequest,
  ): Promise<VerifyPaymentResponse> => {
    const response = await apiClient.post<any>("/payment/verify-payment", data);
    const result = response.data.data || response.data;

    // Normalize: Server returns { payment: true }, frontend expects { success: true }
    if (typeof result.payment === "boolean" && result.success === undefined) {
      result.success = result.payment;
    }

    return result as VerifyPaymentResponse;
  },
};
