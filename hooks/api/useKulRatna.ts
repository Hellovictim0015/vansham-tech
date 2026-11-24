import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  kulRatnaService,
  AddKulRatnaRequest,
  BiopicRequest,
  VerifyBiopicPaymentRequest,
} from "@/services/api/kulRatna.service";
import { toast } from "sonner";

export const useKulRatnas = () => {
  return useQuery({
    queryKey: ["kulRatnas"],
    queryFn: () => kulRatnaService.getAll(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useAddKulRatna = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddKulRatnaRequest) => kulRatnaService.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kulRatnas"] });
      toast.success("Kul Ratna added successfully! 🌟");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add Kul Ratna.";
      toast.error(message);
    },
  });
};

export const useRequestKulRatnaBiopic = () => {
  return useMutation({
    mutationFn: (data: BiopicRequest) => kulRatnaService.requestBiopic(data),
  });
};

export const useVerifyKulRatnaBiopicPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VerifyBiopicPaymentRequest) =>
      kulRatnaService.verifyBiopicPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kulRatnas"] });
    },
  });
};
