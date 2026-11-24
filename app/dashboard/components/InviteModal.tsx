"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check, Share2 } from "lucide-react";

interface InviteModalProps {
  onClose: () => void;
  inviteCode?: string;
}

export default function InviteModal({
  onClose,
  inviteCode = "VAN-H-2026",
}: InviteModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-orange-100 to-amber-50 -z-10" />

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
              <Share2 className="w-6 h-6 text-[#c2410c]" />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-black/5 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">
              Invite Family Members
            </h3>
            <p className="text-gray-500">
              Share this unique code with your family members to let them join
              your tree.
            </p>
          </div>

          <div className="bg-orange-50 border-2 border-orange-100 rounded-2xl p-6 mb-8 text-center">
            <span className="block text-xs font-bold text-orange-400 uppercase tracking-widest mb-2">
              Unique Invite Code
            </span>
            <div className="flex items-center justify-center gap-4">
              <span className="text-3xl font-mono font-bold text-[#c2410c] tracking-wider italic">
                {inviteCode}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 bg-white rounded-xl shadow-sm border border-orange-100 text-[#c2410c] hover:bg-orange-50 transition-all active:scale-95"
              >
                {copied ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Copy className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCopy}
              className="w-full py-4 bg-[#c2410c] text-white font-bold rounded-xl shadow-lg shadow-orange-900/20 hover:bg-[#a6370a] transition-all flex items-center justify-center gap-2"
            >
              {copied ? "Code Copied!" : "Copy Invite Link"}
            </button>

            <p className="text-center text-xs text-gray-400">
              This code allows viewers to see your family tree. <br />
              Admin access must be granted separately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
