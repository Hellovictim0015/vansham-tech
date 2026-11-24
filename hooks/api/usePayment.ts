import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  paymentService,
  VerifyPaymentRequest,
} from "@/services/api/payment.service";
import { toast } from "sonner";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ({ amount, currency }: { amount: number; currency?: string }) =>
      paymentService.createOrder(amount, currency),
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create payment order.";
      toast.error(message);
    },
  });
};

export const useVerifyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyPaymentRequest) =>
      paymentService.verifyPayment(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Payment verified successfully!");
        queryClient.invalidateQueries({ queryKey: ["me"] });
      } else {
        toast.error(data.message || "Payment verification failed.");
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to verify payment.";
      toast.error(message);
    },
  });
};
