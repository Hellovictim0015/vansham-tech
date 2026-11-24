"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Gem,
  Plus,
  Loader2,
  Crown,
  Calendar,
  User,
  X,
  Sparkles,
} from "lucide-react";
import { useKulRatnas, useAddKulRatna } from "@/hooks/api/useKulRatna";
import { useTreeMembers } from "@/hooks/api/useFamilyTree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequestBiopicDialog from "./components/RequestBiopicDialog";

export default function KulRatnaPage() {
  const { data: kulRatnas, isLoading } = useKulRatnas();
  const [showAdd, setShowAdd] = useState(false);
  const [biopicMember, setBiopicMember] = useState<{ id: number; name: string } | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 md:space-y-8 p-4 md:p-6"
    >
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-600 rounded-2xl md:rounded-3xl p-5 md:p-8 text-white shadow-2xl shadow-orange-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-40 h-40 rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <Gem className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-serif italic font-bold">
                  Kul Ratna
                </h1>
                <p className="text-amber-100 text-sm">
                  The Gems of Your Family
                </p>
              </div>
            </div>
            <p className="text-amber-100 max-w-lg mt-2">
              Celebrate outstanding achievements, milestones, and contributions
              that make your family proud. Honor the legacy-makers.
            </p>
          </div>

          <Button
            onClick={() => setShowAdd(true)}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold h-12 md:h-14 px-5 md:px-8 rounded-2xl shadow-lg text-sm md:text-base transition-all hover:scale-[1.02] w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Kul Ratna
          </Button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        </div>
      ) : !kulRatnas || kulRatnas.length === 0 ? (
        <EmptyState onAdd={() => setShowAdd(true)} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {kulRatnas.map((kr, index) => (
            <motion.div
              key={kr.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl border border-orange-50 overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card top strip */}
              <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />

              <div className="p-6 space-y-4">
                {/* Icon + Title */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <Crown className="w-7 h-7 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-slate-900 text-lg leading-tight tracking-tight">
                      {kr.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {kr.description}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Member + Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-slate-800">
                      {kr.full_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(kr.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <Button
                  onClick={() => setBiopicMember({ id: kr.member_id, name: kr.full_name })}
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 rounded-xl py-5 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-bold transition-all text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate AI Biopic
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <AddKulRatnaDialog isOpen={showAdd} onClose={() => setShowAdd(false)} />

      {/* Biopic Dialog */}
      {biopicMember && (
        <RequestBiopicDialog
          isOpen={true}
          onClose={() => setBiopicMember(null)}
          memberId={biopicMember.id}
          memberName={biopicMember.name}
        />
      )}
    </motion.div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-200 rounded-3xl flex items-center justify-center shadow-lg mb-6">
        <Gem className="w-12 h-12 text-amber-600" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
        No Kul Ratnas Yet
      </h2>
      <p className="text-slate-500 max-w-sm mb-6">
        Celebrate your family&apos;s achievers! Add the first Kul Ratna to honor
        outstanding contributions.
      </p>
      <Button
        onClick={onAdd}
        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold h-12 px-8 rounded-2xl shadow-lg"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add First Kul Ratna
      </Button>
    </div>
  );
}

function AddKulRatnaDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: treeData } = useTreeMembers();
  const addKulRatna = useAddKulRatna();

  const [memberId, setMemberId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (!memberId || !title.trim() || !description.trim()) return;
    await addKulRatna.mutateAsync({
      member_id: Number(memberId),
      title: title.trim(),
      description: description.trim(),
    });
    setMemberId("");
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-black">
            <Crown className="h-5 w-5 text-amber-600" />
            Add Kul Ratna
          </DialogTitle>
          <DialogDescription>
            Honor a family member for their outstanding achievement or
            contribution.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          {/* Member Picker */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase">
              Family Member
            </Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger className="border-slate-200">
                <SelectValue placeholder="Select a family member" />
              </SelectTrigger>
              <SelectContent>
                {treeData?.members?.map((m) => (
                  <SelectItem key={m.id} value={String(m.id)}>
                    {m.full_name}{" "}
                    <span className="text-slate-400 ml-1">({m.gender})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase">
              Achievement Title
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. First Doctor in Family"
              className="border-slate-200"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-[11px] font-bold text-slate-500 uppercase">
              Description
            </Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. MBBS Gold Medalist"
              className="border-slate-200"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !memberId ||
              !title.trim() ||
              !description.trim() ||
              addKulRatna.isPending
            }
            className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl font-bold"
          >
            {addKulRatna.isPending && (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            )}
            Add Kul Ratna
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
