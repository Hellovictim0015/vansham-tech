"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useRequestKulRatnaBiopic, useVerifyKulRatnaBiopicPayment } from "@/hooks/api/useKulRatna";
import { useMe } from "@/hooks/api/useAuth";
import { toast } from "sonner";
import Script from "next/script";

interface RequestBiopicDialogProps {
  isOpen: boolean;
  onClose: () => void;
  memberId: number;
  memberName: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function RequestBiopicDialog({
  isOpen,
  onClose,
  memberId,
  memberName,
}: RequestBiopicDialogProps) {
  const { data: user } = useMe();
  const requestBiopic = useRequestKulRatnaBiopic();
  const verifyPayment = useVerifyKulRatnaBiopicPayment();

  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePayment = (response: any, biopicRequestId: number) => {
    verifyPayment.mutate(
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        request_id: biopicRequestId,
      },
      {
        onSuccess: () => {
          toast.success("AI Biopic request submitted successfully!");
          onClose();
        },
        onError: () => {
          toast.error("Payment verification failed. Please contact support.");
        },
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      toast.error("Please upload a photo");
      return;
    }

    try {
      const response = await requestBiopic.mutateAsync({
        member_id: String(memberId),
        title,
        bio,
        photo,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: response.amount * 100, // Razorpay expects paise (₹999 -> 99900)
        currency: "INR",
        name: "Vansham",
        description: "AI Biopic Creation Request",
        order_id: response.order_id,
        handler: (res: any) => handlePayment(res, response.request_id),
        prefill: {
          name: memberName,
          contact: user?.mobile_number || "",
        },
        theme: {
          color: "#c2410c",
        },
        modal: {
          ondismiss: () => {
            console.log("[Payment] Biopic request modal dismissed");
          },
        },
      };

      console.log("[Payment] Razorpay Options:", {
        ...options,
        key: "rzp_live_***" // Hide real key in console
      });

      if (!(window as any).Razorpay) {
        toast.error("Razorpay SDK not loaded. Please wait a moment.");
        return;
      }

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (res: any) => {
        console.error("[Payment] Failure Event:", res.error);
        toast.error(`Payment failed: ${res.error.description}`);
      });
      rzp.open();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to initiate biopic request.");
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js-biopic"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] rounded-[2.5rem] p-0 overflow-hidden border-orange-100">
          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Left: Preview/Upload */}
            <div className="md:w-5/12 bg-orange-50/50 p-8 flex flex-col items-center justify-center border-r border-orange-100 relative">
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full space-y-4"
                  >
                    <div className="aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white ring-8 ring-orange-100/30">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full text-orange-700 hover:bg-orange-100 font-bold text-[10px] uppercase tracking-widest"
                    >
                      Change Photo
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-square rounded-3xl border-2 border-dashed border-orange-200 bg-white flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-orange-100/50 transition-all group p-6 text-center"
                  >
                    <div className="p-4 rounded-2xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Upload Photo</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">Clear face photo preferred</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Form */}
            <div className="md:w-7/12 p-8 md:p-10 flex flex-col">
              <DialogHeader className="mb-6 text-left">
                <DialogTitle className="flex items-center gap-2 mb-1">
                  <div className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-serif italic font-bold text-slate-900 leading-none">AI Biopic Gen</span>
                </DialogTitle>
                <DialogDescription className="text-slate-500 text-sm">
                  Create a cinematic tribute for {memberName}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tribute Title</Label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. A Life of Service"
                    className="rounded-xl border-orange-100 bg-orange-50/20 italic"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Brief Bio / Bio</Label>
                  <textarea
                    required
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Key life events, personality traits..."
                    className="w-full rounded-xl border border-orange-100 bg-orange-50/20 p-3 text-sm min-h-[100px] resize-none outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                  />
                </div>

                <div className="pt-4 mt-auto">
                  <Button
                    type="submit"
                    disabled={requestBiopic.isPending || verifyPayment.isPending}
                    className="w-full rounded-2xl h-12 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white font-bold shadow-xl shadow-orange-200 transition-all flex items-center justify-center gap-2"
                  >
                    {requestBiopic.isPending || verifyPayment.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Pay ₹999 & Generate
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-slate-400 mt-3 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Processing takes up to 24 hours
                  </p>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
