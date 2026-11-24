import React, { useState } from "react";
import { useFamilyStore } from "@/hooks/useFamilyStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Trash2,
  UserPlus,
  Heart,
  Baby,
  ArrowUp,
  X,
  MapPin,
  Hash,
} from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Person } from "@/types/family-v2";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function EditorPanel() {
  const { selectedMemberId, people, selectMember, updateMember } =
    useFamilyStore();

  const member = selectedMemberId ? people[selectedMemberId] : null;

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
  member: Person;
  selectMember: (id: string | null) => void;
}) {
  const { updateMember, deleteMember, addMember } = useFamilyStore();

  // Local state for editing - reset when key (member.id) changes
  const [formData, setFormData] = useState<Partial<Person>>({ ...member });

  const handleUpdate = (updates: Partial<Person>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    updateMember(member.id, updates);
  };

  const handleAddField = (field: string, value: string) => {
    handleUpdate({
      metadata: {
        ...member.metadata,
        [field]: value,
        isAlive: true, // Default
      },
    });
  };

  return (
    <div className="h-screen md:h-full flex flex-col bg-white border-l shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tighter">
            Member Editor
          </h2>
          <p className="text-xs text-slate-400">Editing: {member.name}</p>
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
        {/* Basic Info */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-[#c2410c]">
            <User className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">
              General Information
            </h3>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Full Name
              </Label>
              <Input
                value={formData.name || ""}
                onChange={(e) => handleUpdate({ name: e.target.value })}
                className="font-bold border-slate-200 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Gender
              </Label>
              <RadioGroup
                value={member.gender}
                onValueChange={(val: "male" | "female") =>
                  handleUpdate({ gender: val })
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="g-male" />
                  <Label htmlFor="g-male" className="text-xs">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="g-female" />
                  <Label htmlFor="g-female" className="text-xs">
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </section>

        <Separator />

        {/* Indian Context */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-orange-600">
            <Hash className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">
              Heritage & Roots
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <Hash className="h-3 w-3" /> Gotra
              </Label>
              <Input
                value={member.metadata?.gotra || ""}
                onChange={(e) => handleAddField("gotra", e.target.value)}
                placeholder="Ex: Kashyap"
                className="text-xs border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Native Place
              </Label>
              <Input
                value={member.metadata?.nativePlace || ""}
                onChange={(e) => handleAddField("nativePlace", e.target.value)}
                placeholder="Ex: Varanasi"
                className="text-xs border-slate-200"
              />
            </div>
          </div>
        </section>

        <Separator />

        {/* Quick Add Actions */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600">
            <UserPlus className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">
              Add Relationships
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-start gap-2 h-12 text-xs font-bold hover:border-rose-200 hover:bg-rose-50 border-slate-200"
              onClick={() =>
                addMember(
                  {
                    name: "New Spouse",
                    gender: member.gender === "male" ? "female" : "male",
                    id: "",
                  },
                  member.id,
                  "spouse",
                )
              }
            >
              <Heart className="h-4 w-4 text-rose-500" /> Add Spouse
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2 h-12 text-xs font-bold hover:border-sky-200 hover:bg-sky-50 border-slate-200"
              onClick={() =>
                addMember(
                  { name: "New Child", gender: "male", id: "" },
                  member.id,
                  "child",
                )
              }
            >
              <Baby className="h-4 w-4 text-sky-500" /> Add Child
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2 h-12 text-xs font-bold hover:border-amber-200 hover:bg-amber-50 border-slate-200"
              onClick={() =>
                addMember(
                  { name: "New Parent", gender: "male", id: "" },
                  member.id,
                  "father",
                )
              }
            >
              <ArrowUp className="h-4 w-4 text-amber-500" /> Add Father
            </Button>
            <Button
              variant="outline"
              className="justify-start gap-2 h-12 text-xs font-bold hover:border-amber-200 hover:bg-amber-50 border-slate-200"
              onClick={() =>
                addMember(
                  { name: "New Parent", gender: "female", id: "" },
                  member.id,
                  "mother",
                )
              }
            >
              <ArrowUp className="h-4 w-4 text-amber-500" /> Add Mother
            </Button>
          </div>
        </section>

        <Separator />

        {/* Danger Zone */}
        <section className="pt-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 text-xs transition-colors"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this member?")
              ) {
                deleteMember(member.id);
              }
            }}
          >
            <Trash2 className="h-4 w-4" /> Remove Member from Tree
          </Button>
        </section>
      </div>

      <div className="p-6 bg-slate-50 border-t">
        <Button
          className="w-full bg-slate-900 hover:bg-black font-bold h-12 shadow-inner"
          onClick={() => selectMember(null)}
        >
          Save & Finish Editing
        </Button>
      </div>
    </div>
  );
}
