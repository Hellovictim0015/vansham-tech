"use client";

import React from "react";
import { motion } from "motion/react";
import { Briefcase, Calendar, Repeat, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface MemberCardProps {
  name: string;
  relation?: string;
  birthYear: string;
  deathYear?: string;
  profession: string;
  imageUrl?: string;
  gender: "male" | "female" | "other";
  onAction?: () => void;
}

export default function MemberCard({
  name,
  birthYear,
  deathYear,
  profession,
  imageUrl,
  gender,
  onAction,
}: MemberCardProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const isMale = gender === "male";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group relative bg-white rounded-3xl p-6 border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
    >
      {/* Top Action */}
      <button
        onClick={onAction}
        className="absolute top-4 right-4 text-muted-foreground hover:text-accent p-2 rounded-xl hover:bg-muted transition-all"
      >
        <Repeat className="w-4 h-4" />
      </button>

      <div className="flex flex-col items-center text-center">
        {/* Profile Avatar Frame */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 bg-accent/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-1 ring-border">
            <AvatarImage src={imageUrl} alt={name} className="object-cover" />
            <AvatarFallback
              className={`text-2xl font-serif font-bold ${isMale ? "bg-primary/5 text-primary" : "bg-accent/5 text-accent"}`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[10px] text-white font-bold ${isMale ? "bg-primary" : "bg-accent"}`}
          >
            {isMale ? "♂" : "♀"}
          </div>
        </div>

        {/* Member Details */}
        <h3 className="text-lg font-serif font-bold text-primary mb-1 tracking-tight group-hover:text-accent transition-colors">
          {name}
        </h3>

        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {birthYear} {deathYear ? `— ${deathYear}` : ""}
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[9px] font-bold uppercase tracking-[0.15em] border-primary/10 text-primary/60 px-2 py-0"
          >
            {profession}
          </Badge>
        </div>
      </div>
    </motion.div>
  );
}
