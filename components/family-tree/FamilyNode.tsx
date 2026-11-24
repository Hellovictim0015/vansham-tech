import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { LayoutNode } from "@/types/family-v2";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useFamilyStore } from "@/hooks/useFamilyStore";

const FamilyNode = ({ data, selected }: NodeProps<LayoutNode>) => {
  const isMale = data.gender === "male";
  const selectMember = useFamilyStore((state) => state.selectMember);

  return (
    <div className="group cursor-pointer" onClick={() => selectMember(data.id)}>
      <div
        className={cn(
          "relative w-52 h-26 bg-white rounded-2xl shadow-lg border-2 overflow-hidden flex items-center p-3 gap-4 transition-all hover:shadow-xl",
          isMale ? "border-sky-100" : "border-rose-100",
          selected &&
            (isMale
              ? "border-sky-500 ring-4 ring-sky-50"
              : "border-rose-500 ring-4 ring-rose-50"),
        )}
      >
        <Handle type="target" position={Position.Top} className="!opacity-0" />

        <div className="relative">
          <Avatar className="h-14 w-14 border-2 border-white shadow-md">
            <AvatarImage src={data.photoUrl} />
            <AvatarFallback
              className={cn(
                "font-bold text-lg",
                isMale ? "bg-sky-50 text-sky-600" : "bg-rose-50 text-rose-600",
              )}
            >
              {data.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {data.metadata?.isAlive === false && (
            <div className="absolute -bottom-1 -right-1 bg-gray-600 border-2 border-white text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
              †
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 flex-1">
          <h3 className="font-extrabold text-sm truncate text-gray-900 tracking-tight">
            {data.name}
          </h3>
          <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
            {data.metadata?.gotra || "Family Member"}
          </p>
          {data.metadata?.nativePlace && (
            <span className="text-[9px] text-gray-400 truncate mt-1 italic">
              {data.metadata.nativePlace}
            </span>
          )}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!opacity-0"
        />
      </div>

      {/* Modern Generation Tag */}
      <div
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm border border-white",
          "bg-gray-800 text-white",
        )}
      >
        Generation {data.generation}
      </div>
    </div>
  );
};

export default React.memo(FamilyNode);
