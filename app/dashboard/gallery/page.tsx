"use client";

import { motion } from "motion/react";
import {
  Camera,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Archive,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import React from "react";
import AddMemoryModal from "../components/AddMemoryModal";
import { useGallery } from "@/hooks/api/useGallery";

export default function GalleryPage() {
  const [showAddMemory, setShowAddMemory] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState("All Archives");
  const { data: items, isLoading } = useGallery();
  
  const categories = [
    "All Archives",
    "Weddings",
    "Elders",
    "Ancestral Home",
    "Travels",
  ];

  const filteredItems = React.useMemo(() => {
    if (!items) return [];
    if (selectedCategory === "All Archives") return items;
    return items.filter((item: any) => item.purpose === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 md:space-y-12 pb-20 p-4 md:p-6">
      {/* Premium Header */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="bg-accent/5 text-accent border-accent/20 uppercase tracking-[0.2em] text-[10px] font-bold px-3 py-1"
            >
              Visual Archive
            </Badge>
            <h1 className="text-2xl md:text-4xl font-serif font-bold text-primary tracking-tight">
              Family Gallery
            </h1>
            <p className="text-muted-foreground text-sm font-medium">
              Capturing the physical essence of your lineage.
            </p>
          </div>

          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="rounded-2xl h-10 md:h-12 px-4 md:px-6 border-border hover:bg-muted text-primary font-bold shadow-sm text-sm md:text-base"
            >
              Bulk Archive
            </Button>
            <Button
              onClick={() => setShowAddMemory(true)}
              className="rounded-2xl h-10 md:h-12 px-4 md:px-6 bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform flex-1 md:flex-none text-sm md:text-base"
            >
              <Camera className="w-5 h-5 mr-2" />
              New Memory
            </Button>
          </div>
        </div>

        <Separator className="opacity-50" />

        {/* Categories / Albums */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category, i) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-6 font-bold text-[10px] uppercase tracking-widest ${selectedCategory === category ? "bg-primary" : "bg-white border-border text-muted-foreground hover:text-primary hover:border-accent"}`}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-[2rem] bg-muted/20 animate-pulse border border-border"
            />
          ))
        ) : filteredItems?.length ? (
          filteredItems.map((item: any, i: number) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative aspect-[4/5] bg-muted/20 rounded-[2rem] border border-border overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
            >
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
                  <Archive className="h-10 w-10 text-orange-300" />
                </div>
              )}

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end transform transition-transform duration-300">
                <p className="text-[10px] text-white/70 font-bold uppercase tracking-[0.2em] mb-1">
                  {item.purpose || "Archive"}
                </p>
                <h4 className="text-lg font-serif font-bold text-white tracking-tight line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-white/60 text-xs mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.description}
                </p>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-xl"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-200">
              <Archive className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-gray-800">
                Gallery Empty
              </h3>
              <p className="text-slate-500 text-sm">
                No memories have been archived yet. Start your family's visual
                legacy!
              </p>
            </div>
          </div>
        )}
      </div>

      {showAddMemory && (
        <AddMemoryModal onClose={() => setShowAddMemory(false)} />
      )}

      {/* Legacy Footer */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-px w-24 bg-border mb-8" />
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary/30">
          Curated Generations • Vansham Archive
        </p>
      </div>
    </div>
  );
}
