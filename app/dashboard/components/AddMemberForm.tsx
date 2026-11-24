"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  User,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Check,
  Skull,
  Plus,
  Trash2,
  Award,
  ScrollText,
  BookOpen,
  Milestone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AddMemberFormProps {
  onClose: () => void;
}

// --- Repeatable Entry Types ---
interface EducationEntry {
  degreeTitle: string;
  highestQualification: string;
  fieldOfStudy: string;
  specialization: string;
  university: string;
  yearCompleted: string;
  achievements: string;
}
interface CareerEntry {
  profession: string;
  jobTitle: string;
  organization: string;
  status: string;
  startYear: string;
  endYear: string;
  yearsOfService: string;
  highlights: string;
}
interface AwardEntry {
  name: string;
  year: string;
  awardedBy: string;
  description: string;
}
interface MilestoneEntry {
  year: string;
  title: string;
  description: string;
}

const emptyEducation = (): EducationEntry => ({
  degreeTitle: "",
  highestQualification: "",
  fieldOfStudy: "",
  specialization: "",
  university: "",
  yearCompleted: "",
  achievements: "",
});
const emptyCareer = (): CareerEntry => ({
  profession: "",
  jobTitle: "",
  organization: "",
  status: "Active",
  startYear: "",
  endYear: "",
  yearsOfService: "",
  highlights: "",
});
const emptyAward = (): AwardEntry => ({
  name: "",
  year: "",
  awardedBy: "",
  description: "",
});
const emptyMilestone = (): MilestoneEntry => ({
  year: "",
  title: "",
  description: "",
});

const StyledTextArea = ({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows?: number;
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="flex w-full rounded-xl border border-border bg-white/50 focus:bg-white px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:border-accent transition-colors resize-none"
  />
);

export default function AddMemberForm({ onClose }: AddMemberFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "male",
    dobDay: "",
    dobMonth: "",
    dobYear: "",
    placeOfBirth: "",
    currentCity: "",
    familyRole: "",
    relationType: "ancestor",
    gotra: "",
    nativePlace: "",
    phone: "",
    profession: "",
    isDeceased: false,
    dodDay: "",
    dodMonth: "",
    dodYear: "",
    earlyLife: "",
    personalPhilosophy: "",
    legacy: "",
    biography: "",
  });

  const [education, setEducation] = useState<EducationEntry[]>([
    emptyEducation(),
  ]);
  const [careers, setCareers] = useState<CareerEntry[]>([emptyCareer()]);
  const [awards, setAwards] = useState<AwardEntry[]>([emptyAward()]);
  const [milestones, setMilestones] = useState<MilestoneEntry[]>([
    emptyMilestone(),
  ]);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) =>
    (currentYear - i).toString(),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative bg-white rounded-[2.5rem] p-12 text-center shadow-2xl border border-border overflow-hidden max-w-sm w-full"
        >
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-primary mb-2">
            Heritage Saved
          </h3>
          <p className="text-muted-foreground text-sm font-medium">
            The record has been added to your family archive.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-3xl bg-[#fdfbf7] rounded-[2.5rem] shadow-2xl border border-border overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header Section */}
        <div className="p-8 border-b bg-white flex justify-between items-center relative z-10">
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary tracking-tight">
              Add Family Record
            </h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground mt-1">
              Vansham Registry • Archive Entry
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar relative">
          {/* Subtle Background Texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, var(--accent) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />

          <form className="relative z-10 space-y-12" onSubmit={handleSubmit}>
            {/* Section: Personal Basics */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Personal Identity
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Full Name
                  </label>
                  <Input
                    required
                    placeholder="Enter official name"
                    className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Gender
                  </label>
                  <div className="flex bg-muted/30 p-1.5 rounded-xl gap-2">
                    {["Male", "Female", "Other"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, gender: g.toLowerCase() })
                        }
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.gender === g.toLowerCase() ? "bg-white text-accent shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Date of Birth
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="flex-1 h-12 rounded-xl border border-border bg-white px-3 text-xs font-bold"
                      value={formData.dobDay}
                      onChange={(e) =>
                        setFormData({ ...formData, dobDay: e.target.value })
                      }
                    >
                      <option value="">Day</option>
                      {days.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <select
                      className="flex-1 h-12 rounded-xl border border-border bg-white px-3 text-xs font-bold"
                      value={formData.dobMonth}
                      onChange={(e) =>
                        setFormData({ ...formData, dobMonth: e.target.value })
                      }
                    >
                      <option value="">Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      className="flex-1 h-12 rounded-xl border border-border bg-white px-3 text-xs font-bold"
                      value={formData.dobYear}
                      onChange={(e) =>
                        setFormData({ ...formData, dobYear: e.target.value })
                      }
                    >
                      <option value="">Year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Place of Birth
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="City, State"
                      className="h-12 pl-12 rounded-xl bg-white/50 focus:bg-white border-border"
                      value={formData.placeOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          placeOfBirth: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/70 ml-1">
                  Current City / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="e.g. New Delhi"
                    className="h-12 pl-12 rounded-xl bg-white/50 focus:bg-white border-border"
                    value={formData.currentCity}
                    onChange={(e) =>
                      setFormData({ ...formData, currentCity: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/70 ml-1">
                  Family Role
                </label>
                <Input
                  placeholder="e.g. Father, Daughter, Grandfather"
                  className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                  value={formData.familyRole}
                  onChange={(e) =>
                    setFormData({ ...formData, familyRole: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-primary/70 ml-1">
                Relation Type
              </label>
              <div className="flex bg-muted/30 p-1.5 rounded-xl gap-2">
                {["Ancestor", "Descendant", "Sibling", "Spouse"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        relationType: r.toLowerCase(),
                      })
                    }
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.relationType === r.toLowerCase() ? "bg-white text-accent shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Section: Ancestral & Indian Context */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Heritage Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Gotra / Clan
                  </label>
                  <Input
                    placeholder="e.g. Vatsa, Shandilya"
                    className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                    value={formData.gotra}
                    onChange={(e) =>
                      setFormData({ ...formData, gotra: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Native Place (Mool Niwas)
                  </label>
                  <Input
                    placeholder="Ancestral village or city"
                    className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                    value={formData.nativePlace}
                    onChange={(e) =>
                      setFormData({ ...formData, nativePlace: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/70 ml-1">
                  Archival Status
                </label>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-dashed border-border">
                  <div
                    className={`p-2 rounded-lg ${formData.isDeceased ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}
                  >
                    <Skull className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary">
                      Mark as Deceased
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Adds archival death records to this profile
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        isDeceased: !prev.isDeceased,
                      }))
                    }
                    className={`w-12 h-6 rounded-full relative transition-colors ${formData.isDeceased ? "bg-red-500" : "bg-muted"}`}
                  >
                    <motion.div
                      animate={{ x: formData.isDeceased ? 26 : 2 }}
                      className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {formData.isDeceased && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-xs font-bold text-primary/70 ml-1">
                      Date of Death (Approx)
                    </label>
                    <div className="flex gap-2">
                      <select className="flex-1 h-12 rounded-xl border border-border bg-white px-3 text-xs font-bold">
                        <option value="">Day</option>
                        {days.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <select className="flex-1 h-12 rounded-xl border border-border bg-white px-3 text-xs font-bold">
                        <option value="">Month</option>
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select className="flex-1 h-12 rounded-xl border border-border bg-white px-3 text-xs font-bold">
                        <option value="">Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Section: Professional & Contact */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Professional & Contact
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Profession
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. Civil Servant, Engineer"
                      className="h-12 pl-12 rounded-xl bg-white/50 focus:bg-white border-border"
                      value={formData.profession}
                      onChange={(e) =>
                        setFormData({ ...formData, profession: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="+91 ...."
                      className="h-12 pl-12 rounded-xl bg-white/50 focus:bg-white border-border"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Education */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Education Details
                </h3>
              </div>
              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 rounded-2xl p-5 space-y-4 border border-border/50 relative"
                >
                  {education.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setEducation(education.filter((_, i) => i !== idx))
                      }
                      className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">
                    Education {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Degree Title
                      </label>
                      <Input
                        placeholder="e.g. MBBS, B.Tech"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={edu.degreeTitle}
                        onChange={(e) => {
                          const u = [...education];
                          u[idx] = { ...u[idx], degreeTitle: e.target.value };
                          setEducation(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Highest Qualification
                      </label>
                      <Input
                        placeholder="e.g. Post Graduate"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={edu.highestQualification}
                        onChange={(e) => {
                          const u = [...education];
                          u[idx] = {
                            ...u[idx],
                            highestQualification: e.target.value,
                          };
                          setEducation(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Field of Study
                      </label>
                      <Input
                        placeholder="e.g. Medicine"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={edu.fieldOfStudy}
                        onChange={(e) => {
                          const u = [...education];
                          u[idx] = { ...u[idx], fieldOfStudy: e.target.value };
                          setEducation(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Specialization
                      </label>
                      <Input
                        placeholder="e.g. Cardiology"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={edu.specialization}
                        onChange={(e) => {
                          const u = [...education];
                          u[idx] = {
                            ...u[idx],
                            specialization: e.target.value,
                          };
                          setEducation(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        University / Institution
                      </label>
                      <Input
                        placeholder="e.g. AIIMS Delhi"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={edu.university}
                        onChange={(e) => {
                          const u = [...education];
                          u[idx] = { ...u[idx], university: e.target.value };
                          setEducation(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Year Completed
                      </label>
                      <Input
                        placeholder="e.g. 2010"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={edu.yearCompleted}
                        onChange={(e) => {
                          const u = [...education];
                          u[idx] = { ...u[idx], yearCompleted: e.target.value };
                          setEducation(u);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary/70 ml-1">
                      Academic Achievements
                    </label>
                    <StyledTextArea
                      value={edu.achievements}
                      onChange={(v) => {
                        const u = [...education];
                        u[idx] = { ...u[idx], achievements: v };
                        setEducation(u);
                      }}
                      placeholder="e.g. Gold Medalist, Topper"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setEducation([...education, emptyEducation()])}
                className="w-full py-3 border-2 border-dashed border-accent/30 text-accent rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>

            {/* Section: Career (expanded) */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Career Information
                </h3>
              </div>
              {careers.map((career, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 rounded-2xl p-5 space-y-4 border border-border/50 relative"
                >
                  {careers.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setCareers(careers.filter((_, i) => i !== idx))
                      }
                      className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">
                    Career {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Primary Profession
                      </label>
                      <Input
                        placeholder="e.g. Doctor, Engineer"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={career.profession}
                        onChange={(e) => {
                          const u = [...careers];
                          u[idx] = { ...u[idx], profession: e.target.value };
                          setCareers(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Job Title
                      </label>
                      <Input
                        placeholder="e.g. Senior Surgeon"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={career.jobTitle}
                        onChange={(e) => {
                          const u = [...careers];
                          u[idx] = { ...u[idx], jobTitle: e.target.value };
                          setCareers(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Organization / Institution
                      </label>
                      <Input
                        placeholder="e.g. Apollo Hospitals"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={career.organization}
                        onChange={(e) => {
                          const u = [...careers];
                          u[idx] = { ...u[idx], organization: e.target.value };
                          setCareers(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Career Status
                      </label>
                      <div className="flex bg-muted/30 p-1 rounded-xl gap-1">
                        {["Active", "Retired", "Not Working"].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => {
                              const u = [...careers];
                              u[idx] = { ...u[idx], status: s };
                              setCareers(u);
                            }}
                            className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${career.status === s ? "bg-white text-accent shadow-sm" : "text-muted-foreground hover:text-primary"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Start Year
                      </label>
                      <Input
                        placeholder="e.g. 2005"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={career.startYear}
                        onChange={(e) => {
                          const u = [...careers];
                          u[idx] = { ...u[idx], startYear: e.target.value };
                          setCareers(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        End Year
                      </label>
                      <Input
                        placeholder="e.g. 2023 or Present"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={career.endYear}
                        onChange={(e) => {
                          const u = [...careers];
                          u[idx] = { ...u[idx], endYear: e.target.value };
                          setCareers(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Years of Service
                      </label>
                      <Input
                        placeholder="e.g. 18"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={career.yearsOfService}
                        onChange={(e) => {
                          const u = [...careers];
                          u[idx] = {
                            ...u[idx],
                            yearsOfService: e.target.value,
                          };
                          setCareers(u);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary/70 ml-1">
                      Career Highlights
                    </label>
                    <StyledTextArea
                      value={career.highlights}
                      onChange={(v) => {
                        const u = [...careers];
                        u[idx] = { ...u[idx], highlights: v };
                        setCareers(u);
                      }}
                      placeholder="Key achievements and highlights"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCareers([...careers, emptyCareer()])}
                className="w-full py-3 border-2 border-dashed border-accent/30 text-accent rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Career
              </button>
            </div>

            {/* Section: Awards & Recognitions */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Awards & Recognitions
                </h3>
              </div>
              {awards.map((award, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 rounded-2xl p-5 space-y-4 border border-border/50 relative"
                >
                  {awards.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setAwards(awards.filter((_, i) => i !== idx))
                      }
                      className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">
                    Award {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Award Name
                      </label>
                      <Input
                        placeholder="e.g. Padma Shri"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={award.name}
                        onChange={(e) => {
                          const u = [...awards];
                          u[idx] = { ...u[idx], name: e.target.value };
                          setAwards(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Award Year
                      </label>
                      <Input
                        placeholder="e.g. 2015"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={award.year}
                        onChange={(e) => {
                          const u = [...awards];
                          u[idx] = { ...u[idx], year: e.target.value };
                          setAwards(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Awarded By
                      </label>
                      <Input
                        placeholder="e.g. Government of India"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={award.awardedBy}
                        onChange={(e) => {
                          const u = [...awards];
                          u[idx] = { ...u[idx], awardedBy: e.target.value };
                          setAwards(u);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary/70 ml-1">
                      Description
                    </label>
                    <StyledTextArea
                      value={award.description}
                      onChange={(v) => {
                        const u = [...awards];
                        u[idx] = { ...u[idx], description: v };
                        setAwards(u);
                      }}
                      placeholder="Brief description of the award"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setAwards([...awards, emptyAward()])}
                className="w-full py-3 border-2 border-dashed border-accent/30 text-accent rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Award
              </button>
            </div>

            {/* Section: Personal Story */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Personal Story
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Early Life
                  </label>
                  <StyledTextArea
                    value={formData.earlyLife}
                    onChange={(v) => setFormData({ ...formData, earlyLife: v })}
                    placeholder="Childhood, upbringing, formative experiences..."
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Personal Philosophy
                  </label>
                  <StyledTextArea
                    value={formData.personalPhilosophy}
                    onChange={(v) =>
                      setFormData({ ...formData, personalPhilosophy: v })
                    }
                    placeholder="Values, beliefs, guiding principles..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-primary/70 ml-1">
                    Legacy / Contribution
                  </label>
                  <StyledTextArea
                    value={formData.legacy}
                    onChange={(v) => setFormData({ ...formData, legacy: v })}
                    placeholder="Lasting impact and contributions to family..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Section: Biography */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <ScrollText className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Personal Biography
                </h3>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary/70 ml-1">
                  Biography
                </label>
                <StyledTextArea
                  value={formData.biography}
                  onChange={(v) => setFormData({ ...formData, biography: v })}
                  placeholder="A comprehensive biography covering the person's life journey, achievements, and legacy..."
                  rows={6}
                />
              </div>
            </div>

            {/* Section: Historic Milestones */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <Milestone className="h-4 w-4 text-accent" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">
                  Historic Milestones
                </h3>
              </div>
              {milestones.map((ms, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 rounded-2xl p-5 space-y-4 border border-border/50 relative"
                >
                  {milestones.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setMilestones(milestones.filter((_, i) => i !== idx))
                      }
                      className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest">
                    Milestone {idx + 1}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Year
                      </label>
                      <Input
                        placeholder="e.g. 1990"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={ms.year}
                        onChange={(e) => {
                          const u = [...milestones];
                          u[idx] = { ...u[idx], year: e.target.value };
                          setMilestones(u);
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-primary/70 ml-1">
                        Milestone Title
                      </label>
                      <Input
                        placeholder="e.g. First in Family to Graduate"
                        className="h-12 rounded-xl bg-white/50 focus:bg-white border-border"
                        value={ms.title}
                        onChange={(e) => {
                          const u = [...milestones];
                          u[idx] = { ...u[idx], title: e.target.value };
                          setMilestones(u);
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-primary/70 ml-1">
                      Description
                    </label>
                    <StyledTextArea
                      value={ms.description}
                      onChange={(v) => {
                        const u = [...milestones];
                        u[idx] = { ...u[idx], description: v };
                        setMilestones(u);
                      }}
                      placeholder="What happened and why it matters..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setMilestones([...milestones, emptyMilestone()])}
                className="w-full py-3 border-2 border-dashed border-accent/30 text-accent rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-accent/5 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Milestone
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <Button
                type="submit"
                className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-bold shadow-2xl shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Create Legacy Record
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
