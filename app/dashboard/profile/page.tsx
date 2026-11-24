"use client";

import React from "react";
import { motion } from "motion/react";
import {
  User,
  Phone,
  Calendar,
  Copy,
  CheckCircle,
  CreditCard,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { useMe, useUpdateProfile } from "@/hooks/api/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfilePage() {
  const { data: user } = useMe();
  const updateProfile = useUpdateProfile();
  const [copied, setCopied] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [newName, setNewName] = React.useState("");

  React.useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile.mutateAsync({ name: newName });
      toast.success("Profile updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Failed to update profile:", error);
    }
  };

  const copyReferralCode = () => {
    if (user?.my_referral_code) {
      navigator.clipboard.writeText(user.my_referral_code);
      setCopied(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 p-4 md:p-6">
      {/* Header Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl md:rounded-[2rem] p-5 md:p-8 border border-orange-100 shadow-sm flex flex-col md:flex-row items-center gap-5 md:gap-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none" />

        <div className="relative">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-xl ring-4 ring-orange-50">
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600 text-white text-4xl font-bold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" />
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
              {user?.name}
            </h1>
            <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-[#c2410c] text-xs font-bold rounded-full uppercase tracking-wider">
              {user?.payment === 1 ? "Premium Member" : "Standard Account"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Calendar className="w-3.5 h-3.5" />
              Joined {formatDate(user?.created_at)}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          className="rounded-2xl border-orange-200 text-[#c2410c] hover:bg-orange-50 px-6 font-bold"
          onClick={() => setIsEditDialogOpen(true)}
        >
          Edit Profile
        </Button>
      </motion.div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="rounded-3xl border-orange-100 sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-serif font-bold text-gray-900">
              Edit Profile
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Update your basic information here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateProfile} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs font-bold uppercase tracking-widest text-slate-400"
              >
                Full Name
              </Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
                className="rounded-xl border-orange-100 focus:ring-orange-500 bg-orange-50/30 h-12 text-gray-800 font-medium"
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#c2410c] to-[#ea580c] hover:opacity-90 shadow-lg shadow-orange-100 h-12 font-bold"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? "Saving Changes..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Referral Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-3"
        >
          <Card className="rounded-[2rem] border-orange-100 h-full overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 md:p-8">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-serif italic mb-1">
                    Family Invitations
                  </CardTitle>
                  <CardDescription className="text-slate-400 capitalize">
                    Grow your family tree registry
                  </CardDescription>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Share2 className="w-6 h-6 text-orange-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1 p-6 bg-orange-50 rounded-2xl border border-orange-100/50 space-y-3">
                  <span className="text-[10px] font-bold text-[#c2410c] uppercase tracking-widest">
                    Your Referral Code
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <code className="text-2xl font-mono font-black text-gray-800 tracking-tighter">
                      {user?.my_referral_code || "-------"}
                    </code>
                    <button
                      onClick={copyReferralCode}
                      className="p-2.5 bg-white rounded-xl shadow-sm border border-orange-100 hover:scale-110 active:scale-95 transition-all text-[#c2410c]"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Account Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-[2rem] border-orange-100 overflow-hidden">
          <CardHeader className="p-5 md:p-8 pb-0">
            <CardTitle className="text-xl font-serif font-bold text-gray-800">
              Account Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 md:p-8">
            <div className="grid sm:grid-cols-3 gap-4 md:gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  User ID
                </p>
                <p className="text-sm font-bold text-slate-700 font-mono">
                  #{user?.id}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Mobile Number
                </p>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 opacity-40" /> +91{" "}
                  {user?.mobile_number}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Payment Status
                </p>
                <p
                  className={`text-sm font-bold flex items-center gap-2 ${user?.payment === 1 ? "text-green-600" : "text-amber-600"}`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {user?.payment === 1 ? "Paid / Premium" : "Pending / Free"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
