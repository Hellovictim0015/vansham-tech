"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { V2LayoutNode } from "@/lib/family-tree-v2-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useFamilyTreeV2Store } from "@/hooks/useFamilyTreeV2Store";

const FamilyNodeV2 = ({ data, selected }: NodeProps<V2LayoutNode>) => {
  const isMale = data.gender.toLowerCase() === "male";
  const selectMember = useFamilyTreeV2Store((s) => s.selectMember);

  return (
    <div
      className="group cursor-pointer"
      onClick={() => selectMember(data.memberId)}
    >
      <div
        className={cn(
          "relative w-52 h-26 bg-white rounded-2xl shadow-lg border-2 overflow-hidden flex items-center p-3 gap-4 transition-all hover:shadow-xl hover:scale-[1.02]",
          isMale
            ? "border-sky-200 hover:border-sky-400"
            : "border-rose-200 hover:border-rose-400",
          selected &&
            (isMale
              ? "border-sky-500 ring-4 ring-sky-100"
              : "border-rose-500 ring-4 ring-rose-100"),
        )}
      >
        <Handle type="target" position={Position.Top} className="!opacity-0" />

        <div className="relative">
          <Avatar
            className={cn(
              "h-14 w-14 border-2 border-white shadow-md transition-transform group-hover:scale-105",
            )}
          >
            <AvatarFallback
              className={cn(
                "font-bold text-lg",
                isMale ? "bg-sky-50 text-sky-600" : "bg-rose-50 text-rose-600",
              )}
            >
              {data.full_name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Role badge */}
          {data.role === "ROOT" && (
            <div className="absolute -bottom-1 -right-1 bg-amber-500 border-2 border-white text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
              👑
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-extrabold text-sm truncate text-gray-900 tracking-tight">
            {data.full_name}
          </h3>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
            {data.role === "ROOT"
              ? "Patriarch / Matriarch"
              : data.role === "SPOUSE"
                ? "Spouse"
                : "Family Member"}
          </p>
          <span
            className={cn(
              "text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded-full w-fit",
              isMale ? "bg-sky-50 text-sky-600" : "bg-rose-50 text-rose-600",
            )}
          >
            {data.gender}
          </span>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!opacity-0"
        />
      </div>

      {/* Level Tag */}
      <div
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-bold shadow-sm border border-white",
          data.role === "ROOT"
            ? "bg-amber-600 text-white"
            : "bg-gray-800 text-white",
        )}
      >
        {data.role === "ROOT" ? "Root" : `Level ${data.level}`}
      </div>
    </div>
  );
};

export default React.memo(FamilyNodeV2);
