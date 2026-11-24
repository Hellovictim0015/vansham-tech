"use client";

import { motion } from "motion/react";
import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-6"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-[#c2410c]" />
          <h1 className="text-2xl font-serif font-bold text-[#c2410c]">
            Admin Panel
          </h1>
        </div>
        <p className="text-gray-600">
          Manage your family tree settings and member permissions.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: "👥", label: "Manage Members", count: 24 },
            { icon: "📧", label: "Pending Invites", count: 3 },
            { icon: "🔒", label: "Privacy Settings", count: null },
            { icon: "📊", label: "Family Stats", count: null },
            { icon: "💳", label: "Subscription", count: null },
            { icon: "🗑️", label: "Deleted Items", count: 2 },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-orange-50 rounded-xl p-4 flex items-center gap-4 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.label}</p>
              </div>
              {item.count !== null && (
                <span className="bg-[#c2410c] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {item.count}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
