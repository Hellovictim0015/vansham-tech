"use client";

import { motion } from "motion/react";
import { Settings, User, Bell, Lock, Palette, Globe } from "lucide-react";

export default function SettingsPage() {
  const settingsItems = [
    {
      icon: User,
      label: "Profile Settings",
      description: "Update your personal information",
    },
    {
      icon: Bell,
      label: "Notifications",
      description: "Manage notification preferences",
    },
    {
      icon: Lock,
      label: "Privacy & Security",
      description: "Control who can see your data",
    },
    {
      icon: Palette,
      label: "Appearance",
      description: "Customize the look and feel",
    },
    { icon: Globe, label: "Language", description: "Change display language" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto p-4 md:p-6"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-8 h-8 text-[#c2410c]" />
          <h1 className="text-2xl font-serif font-bold text-[#c2410c]">
            Settings
          </h1>
        </div>
        <p className="text-gray-600">Customize your Vansham experience.</p>
        <div className="mt-8 space-y-3">
          {settingsItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-orange-50 rounded-xl p-4 flex items-center gap-4 hover:bg-orange-100 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <Icon className="w-5 h-5 text-[#c2410c]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
