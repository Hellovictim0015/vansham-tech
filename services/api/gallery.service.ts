import { apiClient } from "@/lib/api/client";
import { GalleryItem } from "@/types/gallery";

export const galleryService = {
  uploadMemory: async (data: {
    title: string;
    description: string;
    purpose: string;
    photo: File;
  }): Promise<GalleryItem> => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("purpose", data.purpose);
    formData.append("photo", data.photo);
    console.log(JSON.stringify(formData));
    const response = await apiClient.post<any>("/gallery", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  getGallery: async (): Promise<GalleryItem[]> => {
    const response = await apiClient.get<any>("/gallery/my");
    return response.data.data || response.data;
  },
};
