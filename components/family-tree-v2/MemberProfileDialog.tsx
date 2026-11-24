"use client";

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
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  ScrollText,
  Milestone,
  MapPin,
  CalendarDays,
  Plus,
  Trash2,
  Save,
  User,
  X,
} from "lucide-react";
import { TreeMember } from "@/types/familyTreeV2";
import { toast } from "sonner";

// ---------- Data Types ----------

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
  status: "Active" | "Retired" | "Not Working";
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

interface ProfileFormData {
  // Personal Details (excluding name & gender, already captured)
  dateOfBirth: string;
  placeOfBirth: string;
  currentCity: string;
  familyRole: string;
  relationType: string;

  // Education
  education: EducationEntry[];

  // Career
  careers: CareerEntry[];

  // Awards
  awards: AwardEntry[];

  // Personal Story
  earlyLife: string;
  personalPhilosophy: string;
  legacy: string;

  // Biography
  biography: string;

  // Milestones
  milestones: MilestoneEntry[];
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

const initialFormData: ProfileFormData = {
  dateOfBirth: "",
  placeOfBirth: "",
  currentCity: "",
  familyRole: "",
  relationType: "",
  education: [emptyEducation()],
  careers: [emptyCareer()],
  awards: [emptyAward()],
  earlyLife: "",
  personalPhilosophy: "",
  legacy: "",
  biography: "",
  milestones: [emptyMilestone()],
};

// ---------- Helpers ----------

const SectionHeader = ({
  icon: Icon,
  title,
  color,
}: {
  icon: React.ElementType;
  title: string;
  color: string;
}) => (
  <div className="flex items-center gap-2.5 pt-2">
    <div
      className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}
    >
      <Icon className="w-4 h-4 text-white" />
    </div>
    <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
      {title}
    </h3>
  </div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
    {children}
  </Label>
);

const TextArea = ({
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
    className="flex w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-400 transition-colors resize-none"
  />
);

// ---------- Main Component ----------

interface MemberProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  member: TreeMember;
}

export function MemberProfileDialog({
  isOpen,
  onClose,
  member,
}: MemberProfileDialogProps) {
  const [form, setForm] = useState<ProfileFormData>(initialFormData);

  const update = (key: keyof ProfileFormData, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // --- Education ---
  const updateEdu = (idx: number, key: keyof EducationEntry, val: string) => {
    const updated = [...form.education];
    updated[idx] = { ...updated[idx], [key]: val };
    update("education", updated);
  };
  const addEdu = () =>
    update("education", [...form.education, emptyEducation()]);
  const removeEdu = (idx: number) => {
    if (form.education.length <= 1) return;
    update(
      "education",
      form.education.filter((_, i) => i !== idx),
    );
  };

  // --- Career ---
  const updateCareer = (idx: number, key: keyof CareerEntry, val: string) => {
    const updated = [...form.careers];
    updated[idx] = { ...updated[idx], [key]: val };
    update("careers", updated);
  };
  const addCareer = () => update("careers", [...form.careers, emptyCareer()]);
  const removeCareer = (idx: number) => {
    if (form.careers.length <= 1) return;
    update(
      "careers",
      form.careers.filter((_, i) => i !== idx),
    );
  };

  // --- Awards ---
  const updateAward = (idx: number, key: keyof AwardEntry, val: string) => {
    const updated = [...form.awards];
    updated[idx] = { ...updated[idx], [key]: val };
    update("awards", updated);
  };
  const addAward = () => update("awards", [...form.awards, emptyAward()]);
  const removeAward = (idx: number) => {
    if (form.awards.length <= 1) return;
    update(
      "awards",
      form.awards.filter((_, i) => i !== idx),
    );
  };

  // --- Milestones ---
  const updateMilestone = (
    idx: number,
    key: keyof MilestoneEntry,
    val: string,
  ) => {
    const updated = [...form.milestones];
    updated[idx] = { ...updated[idx], [key]: val };
    update("milestones", updated);
  };
  const addMilestone = () =>
    update("milestones", [...form.milestones, emptyMilestone()]);
  const removeMilestone = (idx: number) => {
    if (form.milestones.length <= 1) return;
    update(
      "milestones",
      form.milestones.filter((_, i) => i !== idx),
    );
  };

  const handleSave = () => {
    console.log("Profile data:", { memberId: member.id, ...form });
    toast.success("Profile saved locally! (API integration pending)");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-8 pt-8 pb-4 border-b bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-3xl">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight">
                Member Profile
              </DialogTitle>
              <p className="text-slate-400 text-sm mt-1">
                {member.full_name} • {member.gender} • {member.role}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
          {/* ============ 1. PERSONAL DETAILS ============ */}
          <section className="space-y-4">
            <SectionHeader
              icon={User}
              title="Personal Details"
              color="bg-orange-600"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FieldLabel>Date of Birth</FieldLabel>
                <Input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Place of Birth</FieldLabel>
                <Input
                  value={form.placeOfBirth}
                  onChange={(e) => update("placeOfBirth", e.target.value)}
                  placeholder="e.g. Varanasi, UP"
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Current City / Location</FieldLabel>
                <Input
                  value={form.currentCity}
                  onChange={(e) => update("currentCity", e.target.value)}
                  placeholder="e.g. New Delhi"
                  className="border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Family Role</FieldLabel>
                <Input
                  value={form.familyRole}
                  onChange={(e) => update("familyRole", e.target.value)}
                  placeholder="e.g. Grandfather, Father, Daughter"
                  className="border-slate-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <FieldLabel>Relation Type</FieldLabel>
              <RadioGroup
                value={form.relationType}
                onValueChange={(v) => update("relationType", v)}
                className="flex flex-wrap gap-4"
              >
                {["Ancestor", "Descendant", "Sibling", "Spouse"].map((r) => (
                  <div className="flex items-center space-x-2" key={r}>
                    <RadioGroupItem value={r} id={`rel-${r}`} />
                    <Label htmlFor={`rel-${r}`} className="text-xs font-medium">
                      {r}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </section>

          <Separator />

          {/* ============ 2. EDUCATION ============ */}
          <section className="space-y-4">
            <SectionHeader
              icon={GraduationCap}
              title="Education Details"
              color="bg-sky-600"
            />
            {form.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100 relative"
              >
                {form.education.length > 1 && (
                  <button
                    onClick={() => removeEdu(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Education {idx + 1}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel>Degree Title</FieldLabel>
                    <Input
                      value={edu.degreeTitle}
                      onChange={(e) =>
                        updateEdu(idx, "degreeTitle", e.target.value)
                      }
                      placeholder="e.g. MBBS, B.Tech"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Highest Qualification</FieldLabel>
                    <Input
                      value={edu.highestQualification}
                      onChange={(e) =>
                        updateEdu(idx, "highestQualification", e.target.value)
                      }
                      placeholder="e.g. Post Graduate"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Field of Study</FieldLabel>
                    <Input
                      value={edu.fieldOfStudy}
                      onChange={(e) =>
                        updateEdu(idx, "fieldOfStudy", e.target.value)
                      }
                      placeholder="e.g. Medicine"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Specialization</FieldLabel>
                    <Input
                      value={edu.specialization}
                      onChange={(e) =>
                        updateEdu(idx, "specialization", e.target.value)
                      }
                      placeholder="e.g. Cardiology"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>University / Institution</FieldLabel>
                    <Input
                      value={edu.university}
                      onChange={(e) =>
                        updateEdu(idx, "university", e.target.value)
                      }
                      placeholder="e.g. AIIMS Delhi"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Year Completed</FieldLabel>
                    <Input
                      value={edu.yearCompleted}
                      onChange={(e) =>
                        updateEdu(idx, "yearCompleted", e.target.value)
                      }
                      placeholder="e.g. 2010"
                      className="border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Academic Achievements</FieldLabel>
                  <TextArea
                    value={edu.achievements}
                    onChange={(v) => updateEdu(idx, "achievements", v)}
                    placeholder="e.g. Gold Medalist, Topper"
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addEdu}
              className="w-full border-dashed border-sky-300 text-sky-600 hover:bg-sky-50 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Education
            </Button>
          </section>

          <Separator />

          {/* ============ 3. CAREER ============ */}
          <section className="space-y-4">
            <SectionHeader
              icon={Briefcase}
              title="Career Information"
              color="bg-emerald-600"
            />
            {form.careers.map((career, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100 relative"
              >
                {form.careers.length > 1 && (
                  <button
                    onClick={() => removeCareer(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Career {idx + 1}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel>Primary Profession</FieldLabel>
                    <Input
                      value={career.profession}
                      onChange={(e) =>
                        updateCareer(idx, "profession", e.target.value)
                      }
                      placeholder="e.g. Doctor, Engineer"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Job Title</FieldLabel>
                    <Input
                      value={career.jobTitle}
                      onChange={(e) =>
                        updateCareer(idx, "jobTitle", e.target.value)
                      }
                      placeholder="e.g. Senior Surgeon"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Organization / Institution</FieldLabel>
                    <Input
                      value={career.organization}
                      onChange={(e) =>
                        updateCareer(idx, "organization", e.target.value)
                      }
                      placeholder="e.g. Apollo Hospitals"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Career Status</FieldLabel>
                    <Select
                      value={career.status}
                      onValueChange={(v) => updateCareer(idx, "status", v)}
                    >
                      <SelectTrigger className="border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Retired">Retired</SelectItem>
                        <SelectItem value="Not Working">Not Working</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Start Year</FieldLabel>
                    <Input
                      value={career.startYear}
                      onChange={(e) =>
                        updateCareer(idx, "startYear", e.target.value)
                      }
                      placeholder="e.g. 2005"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>End Year</FieldLabel>
                    <Input
                      value={career.endYear}
                      onChange={(e) =>
                        updateCareer(idx, "endYear", e.target.value)
                      }
                      placeholder="e.g. 2023 or Present"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Years of Service</FieldLabel>
                    <Input
                      value={career.yearsOfService}
                      onChange={(e) =>
                        updateCareer(idx, "yearsOfService", e.target.value)
                      }
                      placeholder="e.g. 18"
                      className="border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Career Highlights</FieldLabel>
                  <TextArea
                    value={career.highlights}
                    onChange={(v) => updateCareer(idx, "highlights", v)}
                    placeholder="Key achievements and highlights"
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addCareer}
              className="w-full border-dashed border-emerald-300 text-emerald-600 hover:bg-emerald-50 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Career
            </Button>
          </section>

          <Separator />

          {/* ============ 4. AWARDS ============ */}
          <section className="space-y-4">
            <SectionHeader
              icon={Award}
              title="Awards & Recognitions"
              color="bg-amber-600"
            />
            {form.awards.map((award, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100 relative"
              >
                {form.awards.length > 1 && (
                  <button
                    onClick={() => removeAward(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Award {idx + 1}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel>Award Name</FieldLabel>
                    <Input
                      value={award.name}
                      onChange={(e) => updateAward(idx, "name", e.target.value)}
                      placeholder="e.g. Padma Shri"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Award Year</FieldLabel>
                    <Input
                      value={award.year}
                      onChange={(e) => updateAward(idx, "year", e.target.value)}
                      placeholder="e.g. 2015"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <FieldLabel>Awarded By</FieldLabel>
                    <Input
                      value={award.awardedBy}
                      onChange={(e) =>
                        updateAward(idx, "awardedBy", e.target.value)
                      }
                      placeholder="e.g. Government of India"
                      className="border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Description</FieldLabel>
                  <TextArea
                    value={award.description}
                    onChange={(v) => updateAward(idx, "description", v)}
                    placeholder="Brief description of the award"
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addAward}
              className="w-full border-dashed border-amber-300 text-amber-600 hover:bg-amber-50 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Award
            </Button>
          </section>

          <Separator />

          {/* ============ 5. PERSONAL STORY ============ */}
          <section className="space-y-4">
            <SectionHeader
              icon={BookOpen}
              title="Personal Story"
              color="bg-violet-600"
            />
            <div className="space-y-4">
              <div className="space-y-2">
                <FieldLabel>Early Life</FieldLabel>
                <TextArea
                  value={form.earlyLife}
                  onChange={(v) => update("earlyLife", v)}
                  placeholder="Childhood, upbringing, formative experiences..."
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Personal Philosophy</FieldLabel>
                <TextArea
                  value={form.personalPhilosophy}
                  onChange={(v) => update("personalPhilosophy", v)}
                  placeholder="Values, beliefs, guiding principles..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <FieldLabel>Legacy / Contribution</FieldLabel>
                <TextArea
                  value={form.legacy}
                  onChange={(v) => update("legacy", v)}
                  placeholder="Lasting impact and contributions to family..."
                  rows={3}
                />
              </div>
            </div>
          </section>

          <Separator />

          {/* ============ 6. BIOGRAPHY ============ */}
          <section className="space-y-4">
            <SectionHeader
              icon={ScrollText}
              title="Personal Biography"
              color="bg-rose-600"
            />
            <div className="space-y-2">
              <FieldLabel>Biography</FieldLabel>
              <TextArea
                value={form.biography}
                onChange={(v) => update("biography", v)}
                placeholder="A comprehensive biography covering the person's life journey, achievements, and legacy..."
                rows={6}
              />
            </div>
          </section>

          <Separator />

          {/* ============ 7. MILESTONES ============ */}
          <section className="space-y-4">
            <SectionHeader
              icon={Milestone}
              title="Historic Milestones"
              color="bg-indigo-600"
            />
            {form.milestones.map((ms, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100 relative"
              >
                {form.milestones.length > 1 && (
                  <button
                    onClick={() => removeMilestone(idx)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Milestone {idx + 1}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FieldLabel>Year</FieldLabel>
                    <Input
                      value={ms.year}
                      onChange={(e) =>
                        updateMilestone(idx, "year", e.target.value)
                      }
                      placeholder="e.g. 1990"
                      className="border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <FieldLabel>Milestone Title</FieldLabel>
                    <Input
                      value={ms.title}
                      onChange={(e) =>
                        updateMilestone(idx, "title", e.target.value)
                      }
                      placeholder="e.g. First in Family to Graduate"
                      className="border-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <FieldLabel>Description</FieldLabel>
                  <TextArea
                    value={ms.description}
                    onChange={(v) => updateMilestone(idx, "description", v)}
                    placeholder="What happened and why it matters..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addMilestone}
              className="w-full border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-xl"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Milestone
            </Button>
          </section>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-8 py-5 border-t bg-slate-50 rounded-b-3xl flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-xl px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 rounded-xl font-bold px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
