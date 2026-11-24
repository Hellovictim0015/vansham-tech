import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { galleryService } from "@/services/api/gallery.service";
import { UploadMemoryRequest } from "@/types/gallery";

export const useUploadMemory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadMemoryRequest) =>
      galleryService.uploadMemory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};

export const useGallery = () => {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: () => galleryService.getGallery(),
  });
};
