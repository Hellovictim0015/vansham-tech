export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  purpose: string;
  photo: string;
  created_at: string;
}

export interface UploadMemoryRequest {
  title: string;
  description: string;
  purpose: string;
  photo: File;
}
