"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUploadMemory } from "@/hooks/api/useGallery";
import { toast } from "sonner";

interface AddMemoryModalProps {
  onClose: () => void;
}

export default function AddMemoryModal({ onClose }: AddMemoryModalProps) {
  const uploadMemory = useUploadMemory();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [purpose, setPurpose] = React.useState("Weddings");
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      toast.error("Please select a photo");
      return;
    }

    try {
      await uploadMemory.mutateAsync({
        title,
        description,
        purpose,
        photo,
      });
      toast.success("Memory successfully added to the gallery!");
      onClose();
    } catch (error) {
      toast.error("Failed to upload memory. Please try again.");
      console.error("Upload error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl relative border border-orange-100"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Left Side: Image Preview / Upload Zone */}
          <div className="md:w-5/12 bg-orange-50 border-r border-orange-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#c2410c 1.5px, transparent 1.5px)",
                backgroundSize: "24px 24px",
              }}
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-center gap-4"
                >
                  <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-inner border-2 border-white ring-8 ring-orange-100/50">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-orange-700 hover:bg-orange-100 text-xs font-bold uppercase tracking-widest"
                  >
                    Change Photo
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-square rounded-3xl border-2 border-dashed border-orange-200 bg-white flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-orange-100/50 transition-all group"
                >
                  <div className="p-4 rounded-2xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-sm font-bold text-gray-800">
                      Choose Memory
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">
                      JPEG, PNG up to 10MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side: Form Details */}
          <div className="md:w-7/12 p-10 py-12">
            <div className="mb-8">
              <h2 className="text-3xl font-serif italic font-bold text-[#c2410c]">
                New Memory
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Preserve a moment for your family tree.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                  Memory Title
                </Label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Grandfather's Wedding Day"
                  className="rounded-xl border-orange-100 bg-orange-50/20 focus:ring-orange-500 h-10 italic"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                  Category / Purpose
                </Label>
                <Select value={purpose} onValueChange={setPurpose}>
                  <SelectTrigger className="rounded-xl border-orange-100 bg-orange-50/20 h-10">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-orange-100 z-[110]">
                    <SelectItem value="Weddings">Weddings</SelectItem>
                    <SelectItem value="Elders">Elders</SelectItem>
                    <SelectItem value="Ancestral Home">
                      Ancestral Home
                    </SelectItem>
                    <SelectItem value="Travels">Travels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-400">
                  Story / Description
                </Label>
                <textarea
                  required
                  value={description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setDescription(e.target.value)
                  }
                  placeholder="Describe the story behind this photo..."
                  className="w-full rounded-xl border border-orange-100 bg-orange-50/20 focus:ring-2 focus:ring-orange-500 min-h-[100px] p-3 text-sm leading-relaxed resize-none outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={uploadMemory.isPending}
                  className="w-full rounded-2xl h-12 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-black hover:to-slate-900 text-white font-bold shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  {uploadMemory.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Preserving Story...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Save to Gallery
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
