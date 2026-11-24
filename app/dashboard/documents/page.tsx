"use client";

import { motion } from "motion/react";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-6"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[#c2410c]" />
          <h1 className="text-2xl font-serif font-bold text-[#c2410c]">
            Family Documents
          </h1>
        </div>
        <p className="text-gray-600">
          Store and access important family documents securely.
        </p>
        <div className="mt-8 space-y-3">
          {[
            "Birth Certificates",
            "Marriage Certificates",
            "Property Documents",
            "Family Records",
          ].map((doc) => (
            <div
              key={doc}
              className="bg-orange-50 rounded-xl p-4 flex items-center gap-4 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <FileText className="w-6 h-6 text-[#c2410c]" />
              <span className="font-medium text-gray-800">{doc}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
