"use client";

import React, { useState } from "react";
import { useFamilyTreeV2Store } from "@/hooks/useFamilyTreeV2Store";
import { useAddChild, useAddSpouse } from "@/hooks/api/useFamilyTree";
import { TreeMember } from "@/types/familyTreeV2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, X, Baby, Heart, Crown, Loader2, FileEdit } from "lucide-react";
import { MemberProfileDialog } from "@/components/family-tree-v2/MemberProfileDialog";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

interface EditorPanelV2Props {
  members: TreeMember[];
}

export function EditorPanelV2({ members }: EditorPanelV2Props) {
  const { selectedMemberId, selectMember } = useFamilyTreeV2Store();

  const member = selectedMemberId
    ? members.find((m) => m.id === selectedMemberId)
    : null;

  if (!member) {
    return (
      <Card className="h-full border-0 shadow-none bg-transparent flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-4">
          <User className="text-slate-300 w-8 h-8" />
        </div>
        <CardTitle className="text-slate-600">No Member Selected</CardTitle>
        <CardDescription>
          Click any person on the tree to view details or add relatives.
        </CardDescription>
      </Card>
    );
  }

  return (
    <EditorForm key={member.id} member={member} selectMember={selectMember} />
  );
}

function EditorForm({
  member,
  selectMember,
}: {
  member: TreeMember;
  selectMember: (id: number | null) => void;
}) {
  const addChildMutation = useAddChild();
  const addSpouseMutation = useAddSpouse();

  const [childName, setChildName] = useState("");
  const [childGender, setChildGender] = useState<"male" | "female">("male");
  const [spouseName, setSpouseName] = useState("");
  const [spouseGender, setSpouseGender] = useState<"male" | "female">(
    member.gender.toLowerCase() === "male" ? "female" : "male",
  );

  const isMale = member.gender.toLowerCase() === "male";
  const [showProfile, setShowProfile] = useState(false);

  const handleAddChild = async () => {
    if (!childName.trim()) return;
    await addChildMutation.mutateAsync({
      parent_id: member.id,
      full_name: childName.trim(),
      gender: childGender,
    });
    setChildName("");
  };

  const handleAddSpouse = async () => {
    if (!spouseName.trim()) return;
    await addSpouseMutation.mutateAsync({
      member_id: member.id,
      full_name: spouseName.trim(),
      gender: spouseGender,
    });
    setSpouseName("");
  };

  return (
    <div className="h-screen md:h-full flex flex-col bg-white border-l shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter">
            Member Details
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{member.full_name}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => selectMember(null)}
          className="text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        {/* Member Info */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-orange-600">
            <User className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">
              Information
            </h3>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Full Name
              </span>
              <span className="text-sm font-bold text-slate-900">
                {member.full_name}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Gender
              </span>
              <span
                className={`text-sm font-bold px-2 py-0.5 rounded-full ${
                  isMale
                    ? "bg-sky-100 text-sky-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {member.gender}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Role
              </span>
              <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                {member.role === "ROOT" && (
                  <Crown className="h-3 w-3 text-amber-500" />
                )}
                {member.role}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-slate-500 uppercase">
                Level
              </span>
              <span className="text-sm font-bold text-slate-900">
                {member.level}
              </span>
            </div>
          </div>
        </section>

        {/* Edit Full Profile Button */}
        <Button
          variant="outline"
          onClick={() => setShowProfile(true)}
          className="w-full justify-center gap-2 h-12 text-sm font-bold border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl"
        >
          <FileEdit className="h-4 w-4" />
          Edit Full Profile
        </Button>

        <Separator />

        {/* Add Child Section — available to all members */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-sky-600">
            <Baby className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">
              Add Child
            </h3>
          </div>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Child&apos;s Full Name
              </Label>
              <Input
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter child's name"
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Gender
              </Label>
              <RadioGroup
                value={childGender}
                onValueChange={(v) => setChildGender(v as "male" | "female")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="child-male" />
                  <Label htmlFor="child-male" className="text-xs">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="child-female" />
                  <Label htmlFor="child-female" className="text-xs">
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button
              onClick={handleAddChild}
              disabled={!childName.trim() || addChildMutation.isPending}
              className="w-full bg-sky-600 hover:bg-sky-700 font-bold h-11"
            >
              {addChildMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Baby className="h-4 w-4 mr-2" />
              )}
              Add Child
            </Button>
          </div>
        </section>

        {member.role !== "SPOUSE" && <Separator />}

        {/* Add Spouse Section — hidden for SPOUSE members */}
        {member.role !== "SPOUSE" && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <Heart className="h-4 w-4" />
              <h3 className="text-xs font-bold uppercase tracking-widest">
                Add Spouse
              </h3>
            </div>
            <div className="space-y-3">
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">
                  Spouse&apos;s Full Name
                </Label>
                <Input
                  value={spouseName}
                  onChange={(e) => setSpouseName(e.target.value)}
                  placeholder="Enter spouse's name"
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-bold text-slate-500 uppercase">
                  Gender
                </Label>
                <RadioGroup
                  value={spouseGender}
                  onValueChange={(v) => setSpouseGender(v as "male" | "female")}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="spouse-male" />
                    <Label htmlFor="spouse-male" className="text-xs">
                      Male
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="spouse-female" />
                    <Label htmlFor="spouse-female" className="text-xs">
                      Female
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button
                onClick={handleAddSpouse}
                disabled={!spouseName.trim() || addSpouseMutation.isPending}
                className="w-full bg-rose-600 hover:bg-rose-700 font-bold h-11"
              >
                {addSpouseMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Heart className="h-4 w-4 mr-2" />
                )}
                Add Spouse
              </Button>
            </div>
          </section>
        )}
      </div>

      <div className="p-6 bg-slate-50 border-t">
        <Button
          className="w-full bg-slate-900 hover:bg-black font-bold h-12 shadow-inner"
          onClick={() => selectMember(null)}
        >
          Close Panel
        </Button>
      </div>

      {/* Member Profile Dialog */}
      <MemberProfileDialog
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        member={member}
      />
    </div>
  );
}
