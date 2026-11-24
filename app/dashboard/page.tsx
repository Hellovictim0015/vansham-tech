"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Plus,
  Maximize2,
  Share2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import AddMemberForm from "./components/AddMemberForm";
import InviteModal from "./components/InviteModal";
import AddMemoryModal from "./components/AddMemoryModal";
import { useMe } from "@/hooks/api/useAuth";
import { Sparkles, Copy, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Memory card component
const MemoryCard = ({
  image,
  tag,
  title,
  description,
  featured = false,
  delay = 0,
}: {
  image: string;
  tag: string;
  title: string;
  description: string;
  featured?: boolean;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer ${
      featured ? "" : "flex gap-3"
    }`}
  >
    <div
      className={`${
        featured ? "h-48" : "w-24 h-24 flex-shrink-0"
      } bg-gradient-to-br from-orange-200 to-amber-300 relative`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-50">
        👨‍👩‍👧‍👦
      </div>
    </div>
    <div className={`${featured ? "p-4" : "p-2 flex flex-col justify-center"}`}>
      <span
        className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
          tag === "BLOG" ? "bg-[#c2410c] text-white" : "bg-[#ea580c] text-white"
        } ${featured ? "mb-2" : "mb-1 text-[10px]"}`}
      >
        {tag}
      </span>
      <h4
        className={`font-bold text-gray-800 ${
          featured ? "text-lg mb-2" : "text-sm mb-1 line-clamp-2"
        }`}
      >
        {title}
      </h4>
      <p
        className={`text-gray-600 ${
          featured ? "text-sm line-clamp-2" : "text-xs line-clamp-2"
        }`}
      >
        {description}
      </p>
      {featured && (
        <button className="text-[#c2410c] text-sm font-medium mt-3 hover:underline">
          Read more
        </button>
      )}
    </div>
  </motion.div>
);

export default function DashboardHome() {
  const [showAddMember, setShowAddMember] = React.useState(false);
  const [showInvite, setShowInvite] = React.useState(false);
  const [showAddMemory, setShowAddMemory] = React.useState(false);
  const { data: user } = useMe();
  const [copied, setCopied] = React.useState(false);

  const copyReferralCode = () => {
    if (user?.my_referral_code) {
      navigator.clipboard.writeText(user.my_referral_code);
      setCopied(true);
      toast.success("Referral code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6">
      {/* Welcome & Profile Summary Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#c2410c] to-[#ea580c] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-orange-200 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32 rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif italic font-bold mb-2">
              Namaste, {user?.name || "Member"}!
            </h1>
            <p className="text-orange-100 max-w-md">
              Welcome back to your ancestral legacy. Your family tree is waiting
              for more stories to be told.
            </p>
          </div>

          {user?.my_referral_code && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col gap-2 min-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-orange-200">
                Your Referral Code
              </span>
              <div className="flex items-center justify-between gap-3 bg-white/10 rounded-xl px-3 py-2 border border-white/10">
                <code className="text-lg font-mono font-bold">
                  {user.my_referral_code}
                </code>
                <button
                  onClick={copyReferralCode}
                  className="hover:scale-110 active:scale-95 transition-transform"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-orange-200/80">
                Share this with family to join your tree.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Family Tree Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-sm border border-orange-100/50 overflow-hidden"
      >
        <div className="p-4 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 items-center">
          {/* Visual Preview Side */}
          <div className="w-full lg:w-1/2 relative group">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-[#fafafa] border border-orange-100 relative shadow-inner">
              {/* Abstract Tree Background */}
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "radial-gradient(#c2410c 1.5px, transparent 1.5px)",
                  backgroundSize: "30px 30px",
                }}
              />

              {/* Simplified Tree Nodes Mockup */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-full p-12 opacity-40"
                >
                  <g
                    stroke="#c2410c"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.4"
                  >
                    {/* Geometric bracket shape */}
                    <path d="M 100 100 L 100 140 L 300 140 L 300 100" />
                    <path d="M 200 140 L 200 220" />
                  </g>
                  <circle
                    cx="100"
                    cy="80"
                    r="12"
                    fill="#c2410c"
                    fillOpacity="0.1"
                  />
                  <circle
                    cx="300"
                    cy="80"
                    r="12"
                    fill="#c2410c"
                    fillOpacity="0.1"
                  />
                  <circle
                    cx="200"
                    cy="240"
                    r="16"
                    fill="#c2410c"
                    fillOpacity="0.2"
                  />
                </svg>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-orange-50/50 to-transparent" />

              {/* Stats Overlay */}
              <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white/70 backdrop-blur-md rounded-2xl p-3 md:p-4 border border-white/50 shadow-lg">
                <p className="text-slate-500 text-sm">
                  It&apos;s quiet here... Add some family memories!
                </p>{" "}
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-sm"
                    >
                      👤
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-[#c2410c] flex items-center justify-center text-[10px] font-bold text-white tracking-tighter">
                    +12
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Total Members
                  </p>
                  <p className="text-xl font-serif italic font-bold text-[#c2410c]">
                    17 Members
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Side */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif italic font-bold text-[#c2410c] leading-tight mb-4">
              Your Legacy, <br />
              <span className="text-gray-800 not-italic">
                Beautifully Preserved.
              </span>
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Dive into your family&apos;s history with our dedicated
              interactive tree workspace. Drag, zoom, and explore connections
              across generations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/dashboard/family-tree"
                className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#c2410c] to-[#ea580c] text-white font-bold rounded-2xl shadow-xl shadow-orange-100 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-98 transition-all text-sm md:text-base"
              >
                <Maximize2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Explore Family Tree
              </Link>
              <button
                onClick={() => setShowAddMember(true)}
                className="px-8 py-4 bg-white border-2 border-orange-100 text-[#c2410c] font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-orange-50 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Ancestor
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Memories Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-serif font-bold text-[#c2410c]">
            Memories That Bind Our Family
          </h2>
          <Button
            onClick={() => setShowAddMemory(true)}
            className="rounded-2xl bg-orange-50 text-[#c2410c] hover:bg-orange-100 border border-orange-100 font-bold px-6 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Memory
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Featured Memory */}
          <MemoryCard
            image="/placeholder.jpg"
            tag="BLOG"
            title="Celebrating Our Family's Cherished Moments."
            description="A collection of precious memories, milestones, and moments that define our family journey across generations."
            featured={true}
            delay={0.4}
          />

          {/* Side Memories */}
          <div className="space-y-4">
            <MemoryCard
              image="/placeholder.jpg"
              tag="PRESS RELEASE"
              title="Grandparents' Golden Anniversary Celebration"
              description="Remembering the beautiful day when our grandparents completed 50 years of togetherness."
              delay={0.5}
            />
            <MemoryCard
              image="/placeholder.jpg"
              tag="BLOG"
              title="Family Reunion – A Day to Remember"
              description="A joyful reunion filled with laughter, stories, and unforgettable family moments."
              delay={0.6}
            />
            <MemoryCard
              image="/placeholder.jpg"
              tag="BLOG"
              title="Our Ancestral Home & Traditions"
              description="Stories, traditions, and memories passed down through generations."
              delay={0.7}
            />
          </div>
        </div>
      </motion.section>

      {/* Modals */}
      {showAddMember && (
        <AddMemberForm onClose={() => setShowAddMember(false)} />
      )}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      {showAddMemory && (
        <AddMemoryModal onClose={() => setShowAddMemory(false)} />
      )}
    </div>
  );
}
