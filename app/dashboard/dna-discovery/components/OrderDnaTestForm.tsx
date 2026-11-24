"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

interface OrderDnaTestFormProps {
  onClose: () => void;
}

export default function OrderDnaTestForm({ onClose }: OrderDnaTestFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    shippingAddress: "",
    city: "",
    zip: "",
    collectionMethod: "home",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // You would typically handle API submission here
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[#fdfbf7] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#c2410c] text-center w-full">
              Order DNA Test
            </h2>
            <button
              onClick={onClose}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-black/5 transition-colors text-[#78350f]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#facfb6] rounded-lg border-none placeholder-[#78350f]/60 text-[#78350f] focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-[#facfb6] rounded-lg border-none placeholder-[#78350f]/60 text-[#78350f] focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#facfb6] rounded-lg border-none placeholder-[#78350f]/60 text-[#78350f] focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                required
              />
            </div>

            {/* Shipping Address */}
            <div className="space-y-2">
              <textarea
                placeholder="Shipping Address"
                value={formData.shippingAddress}
                onChange={(e) =>
                  setFormData({ ...formData, shippingAddress: e.target.value })
                }
                rows={3}
                className="w-full px-4 py-3 bg-[#facfb6] rounded-lg border-none placeholder-[#78350f]/60 text-[#78350f] focus:outline-none focus:ring-2 focus:ring-[#c2410c] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#facfb6] rounded-lg border-none placeholder-[#78350f]/60 text-[#78350f] focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                required
              />

              {/* Zip */}
              <input
                type="text"
                placeholder="Zip"
                value={formData.zip}
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
                className="w-full px-4 py-3 bg-[#facfb6] rounded-lg border-none placeholder-[#78350f]/60 text-[#78350f] focus:outline-none focus:ring-2 focus:ring-[#c2410c]"
                required
              />
            </div>

            {/* Collection Method */}
            <div className="space-y-4 pt-2">
              <label className="block text-[#c2410c] font-bold text-lg">
                Collection Method
              </label>
              <div className="flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="collectionMethod"
                      value="home"
                      checked={formData.collectionMethod === "home"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          collectionMethod: e.target.value,
                        })
                      }
                      className="peer appearance-none w-5 h-5 border-2 border-[#c2410c] rounded-full checked:bg-white checked:border-[#c2410c] transition-all"
                    />
                    <div className="absolute w-2.5 h-2.5 bg-[#c2410c] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-[#c2410c] font-bold text-lg group-hover:text-[#9a3412] transition-colors">
                    Home Collection
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="collectionMethod"
                      value="lab"
                      checked={formData.collectionMethod === "lab"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          collectionMethod: e.target.value,
                        })
                      }
                      className="peer appearance-none w-5 h-5 border-2 border-[#c2410c] rounded-full checked:bg-white checked:border-[#c2410c] transition-all"
                    />
                    <div className="absolute w-2.5 h-2.5 bg-[#c2410c] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-[#c2410c] font-bold text-lg group-hover:text-[#9a3412] transition-colors">
                    Lab Visit
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 mt-8 bg-gradient-to-bx from-[#c2410c] to-[#9a3412] bg-[#c2410c] text-white font-bold text-xl rounded-xl shadow-lg shadow-orange-900/20 active:scale-[0.98] transform transition-all hover:brightness-110"
            >
              Book Now
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
