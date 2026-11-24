"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  Users,
  UserPlus,
} from "lucide-react";
import MemberCard from "./components/MemberCard";
import AddMemberForm from "../components/AddMemberForm";
import InviteModal from "../components/InviteModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock Data
const MOCK_MEMBERS = [
  // G1: Elders
  {
    id: 1,
    name: "Ramesh Sharma",
    relation: "Great Grandfather",
    birthYear: "1925",
    deathYear: "2005",
    profession: "Agriculturist",
    gender: "male" as const,
    generation: "G1",
    side: "paternal",
  },
  {
    id: 2,
    name: "Kamla Devi",
    relation: "Great Grandmother",
    birthYear: "1930",
    profession: "Homemaker",
    gender: "female" as const,
    generation: "G1",
    side: "paternal",
  },

  // G2: Grandparents
  {
    id: 3,
    name: "Rajesh Sharma",
    relation: "Grandfather",
    birthYear: "1952",
    profession: "Railway Engineer",
    gender: "male" as const,
    generation: "G2",
    side: "paternal",
  },
  {
    id: 4,
    name: "Sunita Sharma",
    relation: "Grandmother",
    birthYear: "1956",
    profession: "Teacher",
    gender: "female" as const,
    generation: "G2",
    side: "paternal",
  },
  {
    id: 10,
    name: "Suresh Sharma",
    relation: "Grand-Uncle",
    birthYear: "1955",
    profession: "Business Owner",
    gender: "male" as const,
    generation: "G2",
    side: "paternal",
  },
  {
    id: 11,
    name: "Meena Sharma",
    relation: "Grand-Aunt",
    birthYear: "1958",
    profession: "Homemaker",
    gender: "female" as const,
    generation: "G2",
    side: "paternal",
  },
  {
    id: 12,
    name: "Priya Verma",
    relation: "Grand-Aunt",
    birthYear: "1960",
    profession: "Artist",
    gender: "female" as const,
    generation: "G2",
    side: "maternal",
  },
  {
    id: 13,
    name: "Anil Verma",
    relation: "Grand-Uncle",
    birthYear: "1958",
    profession: "Lawyer",
    gender: "male" as const,
    generation: "G2",
    side: "maternal",
  },

  // G3: Parents / Uncles
  {
    id: 5,
    name: "Aman Sharma",
    relation: "Father",
    birthYear: "1980",
    profession: "Architect",
    gender: "male" as const,
    generation: "G3",
    side: "paternal",
  },
  {
    id: 6,
    name: "Shweta Sharma",
    relation: "Aunt",
    birthYear: "1984",
    profession: "Software Dev",
    gender: "female" as const,
    generation: "G3",
    side: "paternal",
  },
  {
    id: 14,
    name: "Vikram Sharma",
    relation: "Cousin (G3)",
    birthYear: "1982",
    profession: "Entrepreneur",
    gender: "male" as const,
    generation: "G3",
    side: "paternal",
  },
  {
    id: 15,
    name: "Ananya Sharma",
    relation: "Cousin (G3)",
    birthYear: "1985",
    profession: "Chef",
    gender: "female" as const,
    generation: "G3",
    side: "paternal",
  },
  {
    id: 16,
    name: "Ishan Verma",
    relation: "Cousin (G3)",
    birthYear: "1988",
    profession: "Marketing Head",
    gender: "male" as const,
    generation: "G3",
    side: "maternal",
  },

  // G4: Current Generation
  {
    id: 7,
    name: "Kabir Sharma",
    relation: "Me",
    birthYear: "2010",
    profession: "Student",
    gender: "male" as const,
    generation: "G4",
    side: "paternal",
  },
  {
    id: 8,
    name: "Myra Sharma",
    relation: "Sister",
    birthYear: "2014",
    profession: "Student",
    gender: "female" as const,
    generation: "G4",
    side: "paternal",
  },
  {
    id: 17,
    name: "Reyansh Sharma",
    relation: "Cousin (G4)",
    birthYear: "2016",
    profession: "Student",
    gender: "male" as const,
    generation: "G4",
    side: "paternal",
  },
];

const GENERATIONS = [
  { id: "all", label: "All Records" },
  { id: "G1", label: "G1: Elders" },
  { id: "G2", label: "G2: Grandparents" },
  { id: "G3", label: "G3: Parents" },
  { id: "G4", label: "G4: Current" },
];

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "paternal" | "maternal"
  >("all");
  const [activeGeneration, setActiveGeneration] = useState("all");
  const [showAddMember, setShowAddMember] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.relation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || member.side === activeFilter;
    const matchesGeneration =
      activeGeneration === "all" || member.generation === activeGeneration;

    return matchesSearch && matchesFilter && matchesGeneration;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-20 p-4 md:p-6">
      {/* Premium Header Architecture */}
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="bg-accent/5 text-accent border-accent/20 uppercase tracking-[0.2em] text-[10px] font-bold px-3 py-1"
            >
              Registry Archive
            </Badge>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-primary tracking-tight">
              Family Members
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Archiving {MOCK_MEMBERS.length} souls across generations.
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowInvite(true)}
              className="rounded-2xl h-10 md:h-12 px-4 md:px-6 border-border hover:bg-muted text-primary font-bold shadow-sm text-sm md:text-base"
            >
              Invite Lineage
            </Button>
            <Button
              onClick={() => setShowAddMember(true)}
              className="rounded-2xl h-10 md:h-12 px-4 md:px-6 bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex-1 md:flex-none text-sm md:text-base"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Search & Filter Controls */}
        <div className="flex flex-col gap-4 md:gap-6 items-start lg:items-center lg:flex-row justify-between">
          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <Input
              placeholder="Search by name, role or relation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 md:h-14 bg-white/50 backdrop-blur-sm rounded-2xl border-border focus-visible:ring-accent shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-1 scrollbar-hide">
            <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/50 shadow-inner">
              {(["all", "paternal", "maternal"] as const).map((filter) => (
                <Button
                  key={filter}
                  variant={activeFilter === filter ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-xl px-6 h-9 font-bold text-[10px] uppercase tracking-widest ${
                    activeFilter === filter
                      ? "bg-white text-primary shadow-md ring-1 ring-border/50"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Generation Selection */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {GENERATIONS.map((gen) => (
            <Button
              key={gen.id}
              variant={activeGeneration === gen.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveGeneration(gen.id)}
              className={`rounded-full h-10 px-5 font-bold text-[10px] uppercase tracking-[0.15em] transition-all ${
                activeGeneration === gen.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 border-none"
                  : "bg-white/50 border-border text-muted-foreground hover:border-accent hover:text-accent"
              }`}
            >
              {gen.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
        >
          {filteredMembers.map((member) => (
            <MemberCard
              key={member.id}
              {...member}
              onAction={() => console.log("Action clicked", member.id)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-muted/10 rounded-[3rem] border border-dashed border-border/60">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl border mb-6">
            <Users className="w-8 h-8 text-primary/20" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-primary mb-2">
            No Records Found
          </h3>
          <p className="text-muted-foreground max-w-xs text-sm font-medium">
            The archives reflect no such lineage. Try refining your search
            criteria.
          </p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("");
              setActiveFilter("all");
              setActiveGeneration("all");
            }}
            className="mt-4 text-accent font-bold uppercase tracking-widest text-[10px]"
          >
            Clear Registry Filters
          </Button>
        </div>
      )}

      <AnimatePresence>
        {showAddMember && (
          <AddMemberForm onClose={() => setShowAddMember(false)} />
        )}
        {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
      </AnimatePresence>
    </div>
  );
}
