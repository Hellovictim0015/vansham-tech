"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle } from "lucide-react";
import OrderDnaTestForm from "./components/OrderDnaTestForm";

const ANALYSIS_LEVELS = [
  {
    id: "basic",
    title: "Basic Scan",
    description: "Universal DNA insights only",
    color: "bg-orange-200",
  },
  {
    id: "advanced",
    title: "Advanced Scan",
    description: "Universal + family matching",
    color: "bg-orange-300",
  },
  {
    id: "complete",
    title: "Complete Scan",
    description: "Universal + Health + Aging",
    color: "bg-orange-400",
  },
];

const INSIGHTS_INFO = [
  {
    title: "Universal",
    items: [
      "Ancestral origins",
      "Family connections",
      "Migration patterns",
      "Ethnic composition",
    ],
  },
  {
    title: "Health",
    items: [
      "Genetic risk factors",
      "Nutrition insights",
      "Lifestyle recommend",
      "Carrier status",
    ],
  },
  {
    title: "Aging",
    items: [
      "Biological age",
      "Cellular aging speed",
      "Longevity markers",
      "Age-related insights",
    ],
  },
];

export default function DnaDiscoveryPage() {
  const [selectedLevel, setSelectedLevel] = useState("basic");
  const [showOrderForm, setShowOrderForm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-8 pb-10 relative p-4 md:p-6"
    >
      {/* Header */}
      <h1 className="text-2xl md:text-4xl font-serif font-bold text-[#9a3412] text-center mb-6 md:mb-8">
        DNA Discovery
      </h1>

      {/* Status Section */}
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-orange-100 p-6 flex items-center justify-center">
          <h2 className="text-xl font-bold text-gray-800">
            Status : <span className="text-gray-600">Not Tested</span>
          </h2>
        </div>
        <button
          onClick={() => setShowOrderForm(true)}
          className="flex-1 bg-[#9a3412] text-white rounded-xl shadow-lg shadow-orange-900/20 hover:bg-[#7c2d12] transition-colors p-6 text-xl font-bold"
        >
          Order DNA Test
        </button>
      </div>

      {/* Analysis Level Section */}
      <div className="bg-[#e7e5e4]/50 rounded-2xl md:rounded-3xl p-5 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-[#9a3412] mb-6">
          Choose DNA Analysis Level
        </h2>
        <div className="space-y-4">
          {ANALYSIS_LEVELS.map((level) => (
            <div
              key={level.id}
              onClick={() => setSelectedLevel(level.id)}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedLevel === level.id
                  ? "ring-2 ring-[#9a3412] shadow-md transform scale-[1.01]"
                  : "hover:bg-opacity-80"
              } ${level.color} rounded-lg p-6 flex items-center gap-4`}
            >
              <div className="flex-shrink-0">
                {selectedLevel === level.id ? (
                  <CheckCircle2 className="w-6 h-6 text-black" />
                ) : (
                  <Circle className="w-6 h-6 text-black/50" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#7c2d12]">
                  {level.title}
                </h3>
                <p className="text-[#7c2d12]/80 font-medium">
                  {level.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Information Section */}
      <div className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-[#9a3412] mb-8">
          DNA Insights Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {INSIGHTS_INFO.map((section) => (
            <div
              key={section.title}
              className="bg-orange-200/50 rounded-xl p-6 border border-orange-200"
            >
              <h3 className="text-xl font-bold text-[#9a3412] mb-4 border-b border-[#9a3412]/20 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.items.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="w-4 h-4 border border-gray-500 rounded flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-transparent" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Order DNA Test Form Modal */}
      <AnimatePresence>
        {showOrderForm && (
          <OrderDnaTestForm onClose={() => setShowOrderForm(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
