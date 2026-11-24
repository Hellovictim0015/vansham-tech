import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Person, RelationType } from "@/types/family-v2";

interface AddMemberDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Partial<Person> & {
      relationType?: RelationType;
      relativeId?: string;
    },
  ) => void;
  relative?: Person; // The person we are adding a relative TO
  relationType?: RelationType; // If we already know the relation (e.g. from context menu)
}

export function AddMemberDialog({
  isOpen,
  onClose,
  onSubmit,
  relative,
  relationType: initialRelationType,
}: AddMemberDialogProps) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [relation, setRelation] = useState<RelationType>(
    initialRelationType || "child",
  );
  const [dob, setDob] = useState("");
  const [gotra, setGotra] = useState("");
  const [nativePlace, setNativePlace] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      gender,
      dob,
      metadata: {
        isAlive: true,
        gotra,
        nativePlace,
      },
      relationType: relative ? relation : undefined,
      relativeId: relative?.id,
    });
    onClose();
    // Reset form
    setName("");
    setGender("male");
    setGotra("");
    setNativePlace("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {relative
              ? `Add ${relation} to ${relative.name}`
              : "Add New Member"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Relationship Type Selection (if relative exists but type not fixed) */}
          {relative && !initialRelationType && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="relation" className="text-right">
                Relation
              </Label>
              <Select
                value={relation}
                onValueChange={(val) => setRelation(val as RelationType)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="child">Child</SelectItem>
                  <SelectItem value="father">Father</SelectItem>
                  <SelectItem value="mother">Mother</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Gender</Label>
            <RadioGroup
              value={gender}
              onValueChange={(val) => setGender(val as "male" | "female")}
              className="flex gap-4 col-span-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">
              Birth Year
            </Label>
            <Input
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="col-span-3"
              placeholder="YYYY"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="gotra" className="text-right">
              Gotra
            </Label>
            <Input
              id="gotra"
              value={gotra}
              onChange={(e) => setGotra(e.target.value)}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="native" className="text-right">
              Native Place
            </Label>
            <Input
              id="native"
              value={nativePlace}
              onChange={(e) => setNativePlace(e.target.value)}
              className="col-span-3"
              placeholder="Optional"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Add Member</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
