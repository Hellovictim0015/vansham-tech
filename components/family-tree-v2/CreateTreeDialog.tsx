"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCreateTree, useAddRootMember } from "@/hooks/api/useFamilyTree";
import { Loader2, TreeDeciduous, UserPlus } from "lucide-react";

interface CreateTreeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  hasTree: boolean; // If true, show "Add Root Member" instead of "Create Tree"
}

export function CreateTreeDialog({
  isOpen,
  onClose,
  hasTree,
}: CreateTreeDialogProps) {
  // Create Tree state
  const [treeName, setTreeName] = useState("");
  const createTreeMutation = useCreateTree();

  // Add Root Member state
  const [rootName, setRootName] = useState("");
  const [rootGender, setRootGender] = useState<"male" | "female">("male");
  const addRootMutation = useAddRootMember();

  const handleCreateTree = async () => {
    if (!treeName.trim()) return;
    await createTreeMutation.mutateAsync({ tree_name: treeName.trim() });
    setTreeName("");
    onClose();
  };

  const handleAddRoot = async () => {
    if (!rootName.trim()) return;
    await addRootMutation.mutateAsync({
      full_name: rootName.trim(),
      gender: rootGender,
    });
    setRootName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-black">
            {hasTree ? (
              <>
                <UserPlus className="h-5 w-5 text-orange-600" />
                Add Root Member
              </>
            ) : (
              <>
                <TreeDeciduous className="h-5 w-5 text-orange-600" />
                Create Family Tree
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {hasTree
              ? "Add the first ancestor (root) to your family tree."
              : "Give your family tree a name to get started."}
          </DialogDescription>
        </DialogHeader>

        {hasTree ? (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Full Name
              </Label>
              <Input
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                placeholder="e.g. Ramesh Sharma"
                className="border-slate-200"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Gender
              </Label>
              <RadioGroup
                value={rootGender}
                onValueChange={(v) => setRootGender(v as "male" | "female")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="root-male" />
                  <Label htmlFor="root-male" className="text-xs">
                    Male
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="root-female" />
                  <Label htmlFor="root-female" className="text-xs">
                    Female
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="text-[11px] font-bold text-slate-500 uppercase">
                Tree Name
              </Label>
              <Input
                value={treeName}
                onChange={(e) => setTreeName(e.target.value)}
                placeholder="e.g. My Heritage Tree"
                className="border-slate-200"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          {hasTree ? (
            <Button
              onClick={handleAddRoot}
              disabled={!rootName.trim() || addRootMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700 rounded-xl font-bold"
            >
              {addRootMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Add Root Member
            </Button>
          ) : (
            <Button
              onClick={handleCreateTree}
              disabled={!treeName.trim() || createTreeMutation.isPending}
              className="bg-orange-600 hover:bg-orange-700 rounded-xl font-bold"
            >
              {createTreeMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Create Tree
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
