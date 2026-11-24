"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User as UserIcon, Phone, Lock, EyeOff, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLogin, useRegister, useSendOtp, useMe } from "@/hooks/api/useAuth";
import { useCreateOrder, useVerifyPayment } from "@/hooks/api/usePayment";
import { User } from "@/types/auth";
import Cookies from "js-cookie";
import Script from "next/script";
import { toast } from "sonner";

// Back Button Component - defined outside to prevent re-renders
const BackButton = ({
  onClick,
  shouldAnimate = true,
}: {
  onClick: () => void;
  shouldAnimate?: boolean;
}) => (
  <motion.button
    initial={shouldAnimate ? { opacity: 0, x: -20 } : false}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.2, duration: 0.3 }}
    onClick={onClick}
    className="fixed top-20 sm:top-24 left-4 sm:left-8 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-[#78350f] hover:text-[#c2410c] hover:bg-white transition-all font-medium"
  >
    <ArrowLeft className="w-5 h-5" />
    <span>Back</span>
  </motion.button>
);

// Join Family Screen - defined outside to prevent re-renders on input
const JoinFamilyScreen = ({
  inviteCode,
  setInviteCode,
  onBack,
  onJoin,
}: {
  inviteCode: string;
  setInviteCode: (value: string) => void;
  onBack: () => void;
  onJoin: () => void;
}) => (
  <motion.div
    key="joinFamily"
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="w-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-20 sm:pt-24 pb-8 relative"
  >
    <BackButton onClick={onBack} />

    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center mb-6 sm:mb-8"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-white leading-tight">
        Preserve your family legacy
      </h2>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 w-full max-w-lg mx-auto"
    >
      <h3 className="text-[#c2410c] text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
        Join Existing Family
      </h3>

      <div className="mb-4">
        <label className="text-[#c2410c] font-semibold text-base sm:text-lg block mb-2">
          Enter Invite Code
        </label>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          className="w-full px-4 py-4 rounded-lg bg-[#f8e8e0] border-2 border-[#e8d4cc] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30 focus:border-[#c2410c] transition-all text-gray-700 text-base sm:text-lg"
        />
      </div>

      <div className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
        <p>This invite gives you view-only access</p>
        <p>You cannot edit family data</p>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onJoin}
        className="w-full py-3.5 sm:py-4 bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-[#b45309] text-[#78350f] font-bold text-base sm:text-lg rounded-full shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transform transition-all hover:brightness-110"
      >
        Join Family
      </motion.button>
    </motion.div>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mt-6 sm:mt-8"
    >
      <p className="text-[#78350f] text-base sm:text-lg">
        Don&apos;t have an invite?{" "}
        <span className="text-[#c2410c] font-semibold underline cursor-pointer hover:text-[#b45309]">
          Ask your family admin
        </span>
      </p>
    </motion.div>
  </motion.div>
);

// Registration Form - defined outside to prevent re-renders
const RegistrationForm = ({
  onLoginClick,
  onOtpSent,
}: {
  onLoginClick: () => void;
  onOtpSent: (data: {
    name: string;
    mobile_number: string;
    password?: string;
  }) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile_number: "",
    password: "",
  });

  const { mutate: sendOtp, isPending } = useSendOtp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendOtp(
      { mobile_number: formData.mobile_number },
      {
        onSuccess: () => {
          onOtpSent(formData);
        },
      },
    );
  };

  return (
    <motion.div
      key="registration"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex flex-col lg:flex-row"
    >
      <div className="w-full lg:w-1/2 relative order-1">
        <div className="absolute inset-0 bg-amber-100/50 backdrop-blur-sm" />

        <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-6 pt-16 sm:pt-20 lg:pt-24 flex flex-col justify-center min-h-[70vh] lg:min-h-screen">
          <form
            className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto"
            onSubmit={handleSubmit}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30 focus:border-[#c2410c] transition-all text-gray-600 placeholder-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-sm sm:text-base font-medium"
                required
              />
              <UserIcon
                className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ea580c]"
                strokeWidth={2.5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <input
                type="tel"
                placeholder="Mobile"
                value={formData.mobile_number}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_number: e.target.value })
                }
                className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30 focus:border-[#c2410c] transition-all text-gray-600 placeholder-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-sm sm:text-base font-medium"
                required
              />
              <Phone
                className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ea580c]"
                strokeWidth={2.5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30 focus:border-[#c2410c] transition-all text-gray-600 placeholder-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-sm sm:text-base font-medium"
                required
              />
              <div
                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-[#ea580c]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" strokeWidth={2.5} />
                ) : (
                  <Lock className="h-5 w-5" strokeWidth={2.5} />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center pt-4 sm:pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isPending}
                className="px-12 sm:px-20 py-3 sm:py-3.5 bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-[#b45309] text-[#78350f] font-bold text-base sm:text-lg rounded-xl shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transform transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Sending OTP..." : "Get OTP"}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-3 sm:pt-4"
            >
              <p className="text-[#c2410c] text-base text-center">
                Already have an account?{" "}
                <span
                  className="text-[#ea580c] font-semibold cursor-pointer hover:underline"
                  onClick={() => onLoginClick()}
                >
                  Login
                </span>
              </p>
            </motion.div>
          </form>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative order-2">
        <div className="absolute inset-0" />

        <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 text-white flex flex-col items-center justify-center min-h-[30vh] lg:min-h-screen text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-xs mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold mb-2 leading-tight">
              Preserve your family legacy
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-white/60 mx-auto my-3 sm:my-4" />

            <h3 className="text-base sm:text-lg font-medium mb-6 sm:mb-10 text-white/90">
              Create your Account
            </h3>

            <div className="flex gap-3 sm:gap-4 justify-center">
              {[
                {
                  src: "https://www.svgrepo.com/show/475656/google-color.svg",
                  alt: "Google",
                },
                {
                  src: "https://www.svgrepo.com/show/475647/facebook-color.svg",
                  alt: "Facebook",
                },
              ].map((social, index) => (
                <motion.button
                  key={social.alt}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <img
                    src={social.src}
                    alt={social.alt}
                    className="w-5 h-5 sm:w-7 sm:h-7"
                  />
                </motion.button>
              ))}

              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg cursor-pointer"
              >
                <svg
                  className="w-5 h-5 sm:w-7 sm:h-7 fill-black"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <g>
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </g>
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Login Form
const LoginForm = ({
  onBackToRegister,
  onLoginSuccess,
}: {
  onBackToRegister: () => void;
  onLoginSuccess: (user: User) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    mobile_number: "",
    password: "",
  });

  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData, {
      onSuccess: (data) => {
        onLoginSuccess(data.user);
      },
    });
  };

  return (
    <motion.div
      key="login"
      variants={fadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full flex flex-col lg:flex-row"
    >
      <div className="w-full lg:w-1/2 relative order-1">
        <div className="absolute inset-0 bg-amber-100/50 backdrop-blur-sm" />

        <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-6 pt-16 sm:pt-20 lg:pt-24 flex flex-col justify-center min-h-[70vh] lg:min-h-screen">
          <form
            className="space-y-4 sm:space-y-5 w-full max-w-md mx-auto"
            onSubmit={handleLogin}
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="relative"
            >
              <input
                type="tel"
                placeholder="Mobile Number"
                value={formData.mobile_number}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_number: e.target.value })
                }
                className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30 focus:border-[#c2410c] transition-all text-gray-600 placeholder-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-sm sm:text-base font-medium"
                required
              />
              <Phone
                className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#ea580c]"
                strokeWidth={2.5}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-4 sm:pl-6 pr-12 sm:pr-14 py-3 sm:py-4 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30 focus:border-[#c2410c] transition-all text-gray-600 placeholder-gray-400 shadow-[0_4px_20px_rgba(0,0,0,0.08)] text-sm sm:text-base font-medium"
                required
              />
              <div
                className="absolute right-5 top-1/2 -translate-y-1/2 cursor-pointer text-[#ea580c]"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" strokeWidth={2.5} />
                ) : (
                  <Lock className="h-5 w-5" strokeWidth={2.5} />
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center pt-4 sm:pt-6"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={isPending}
                className="px-12 sm:px-20 py-3 sm:py-3.5 bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-[#b45309] text-[#78350f] font-bold text-base sm:text-lg rounded-xl shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transform transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Logging in..." : "Login"}
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="pt-3 sm:pt-4"
            >
              <p className="text-[#c2410c] text-base text-center">
                Don&apos;t have an account?{" "}
                <span
                  className="text-[#ea580c] font-semibold cursor-pointer hover:underline"
                  onClick={onBackToRegister}
                >
                  Register
                </span>
              </p>
            </motion.div>
          </form>
        </div>
      </div>

      <div className="w-full lg:w-1/2 relative order-2">
        <div className="absolute inset-0" />
        <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12 text-white flex flex-col items-center justify-center min-h-[30vh] lg:min-h-screen text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-xs mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold mb-2 leading-tight">
              Preserve your family legacy
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-white/60 mx-auto my-3 sm:my-4" />
            <h3 className="text-base sm:text-lg font-medium mb-6 sm:mb-10 text-white/90">
              Welcome Back
            </h3>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Login Invite Screen
const LoginInviteScreen = ({
  inviteCode,
  setInviteCode,
  onBack,
  onNext,
}: {
  inviteCode: string;
  setInviteCode: (value: string) => void;
  onBack: () => void;
  onNext: () => void;
}) => (
  <motion.div
    key="loginInvite"
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="w-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-20 sm:pt-24 pb-8 relative"
  >
    <BackButton onClick={onBack} />

    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center mb-6 sm:mb-8"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-white leading-tight">
        Preserve your family legacy
      </h2>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 w-full max-w-lg mx-auto"
    >
      <h3 className="text-[#c2410c] text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">
        Enter Invite Code
      </h3>

      <div className="mb-8">
        <label className="text-[#c2410c] font-semibold text-base sm:text-lg block mb-2">
          Your Family Invite Code
        </label>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="Enter code here"
          className="w-full px-4 py-4 rounded-lg bg-[#f8e8e0] border-2 border-[#e8d4cc] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/30 focus:border-[#c2410c] transition-all text-gray-700 text-base sm:text-lg"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onNext}
        className="w-full py-3.5 sm:py-4 bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-[#b45309] text-[#78350f] font-bold text-base sm:text-lg rounded-full shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transform transition-all hover:brightness-110"
      >
        Continue to Dashboard
      </motion.button>
    </motion.div>
  </motion.div>
);

// PaymentScreen - defined outside to prevent re-renders
const PaymentScreen = ({
  onBack,
  onPay,
}: {
  onBack: () => void;
  onPay: (amount: number) => void;
}) => (
  <motion.div
    key="payment"
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="w-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-20 sm:pt-24 pb-8 relative"
  >
    <BackButton onClick={onBack} />

    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center mb-6 sm:mb-8"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-white leading-tight">
        Preserve your family legacy
      </h2>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 w-full max-w-2xl mx-auto"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8">
        <div className="space-y-4 sm:space-y-5">
          {[
            { icon: "👨‍👩‍👧‍👦", text: "Upto 5 Generations" },
            { icon: "👥", text: "Unlimited Family Member" },
            { icon: "🖼️", text: "Photos and Memories" },
            { icon: "🔒", text: "Secure and Private Data" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-[#333] font-semibold text-base sm:text-lg">
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#f8d5c8] rounded-xl px-6 sm:px-8 py-4 sm:py-5 text-center flex-shrink-0"
        >
          <p className="text-[#c2410c] font-semibold text-base sm:text-lg">
            Price:
          </p>
          <p className="text-[#c2410c] font-bold text-3xl sm:text-4xl">₹1</p>
          <p className="text-[#c2410c] font-semibold text-lg sm:text-xl">
            /Year
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-3 sm:gap-4 mt-8 sm:mt-10"
      >
        <div className="border-2 border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#c2410c] transition-colors">
          <div className="flex items-center gap-2">
            <div className="bg-[#5f259f] text-white text-xs font-bold px-1.5 py-0.5 rounded">
              UPI
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-medium">G Pay</span>
              <span className="text-xs font-medium">G Pay</span>
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-xl p-3 sm:p-4 flex items-center justify-center gap-2 cursor-pointer hover:border-[#c2410c] transition-colors">
          <div className="bg-[#eb6f2d] rounded p-1">
            <div className="w-4 h-3 bg-white rounded-sm"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-[#1a1f71] font-bold text-xs">VISA</span>
            <div className="flex">
              <div className="w-3 h-3 bg-[#eb001b] rounded-full -mr-1"></div>
              <div className="w-3 h-3 bg-[#f79e1b] rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-200 rounded-xl p-3 sm:p-4 flex items-center justify-center gap-2 cursor-pointer hover:border-[#c2410c] transition-colors">
          <span className="text-[#c2410c] text-xl">🏛️</span>
          <span className="text-[#333] font-medium text-xs sm:text-sm">
            Net Banking
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 sm:mt-10"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onPay(1)} // Amount in INR as requested
          className="w-full py-3.5 sm:py-4 bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-[#b45309] text-[#78350f] font-bold text-base sm:text-lg rounded-full shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transform transition-all hover:brightness-110"
        >
          Proceed to Secure Payment
        </motion.button>
      </motion.div>
    </motion.div>
  </motion.div>
);

// FamilyChoiceScreen - defined outside to prevent re-renders
const FamilyChoiceScreen = ({
  onPayment,
  onJoinFamily,
}: {
  onPayment: () => void;
  onJoinFamily: () => void;
}) => (
  <motion.div
    key="familyChoice"
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="w-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-16 sm:pt-20"
  >
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-center mb-6 sm:mb-8"
    >
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-white mb-3 leading-tight">
        Preserve your family legacy
      </h2>
      <h3 className="text-lg sm:text-xl font-serif italic font-semibold text-[#78350f] mt-4">
        How would you like to Continue?
      </h3>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 w-full max-w-2xl mx-auto"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onPayment}
            className="w-full px-6 py-3 sm:py-3.5 bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-[#b45309] text-[#78350f] font-bold text-base sm:text-lg rounded-full shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transform transition-all hover:brightness-110 mb-4 sm:mb-6"
          >
            Create New Family
          </motion.button>
          <div className="text-left w-full">
            <p className="text-[#c2410c] font-semibold text-base sm:text-lg mb-2">
              Full access (Admin)
            </p>
            <ul className="text-[#c2410c] text-sm sm:text-base space-y-1">
              <li>- Full control</li>
              <li>- Edit family tree</li>
              <li>- Manage members</li>
            </ul>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col items-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onJoinFamily}
            className="w-full px-6 py-3 sm:py-3.5 bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-[#b45309] text-[#78350f] font-bold text-base sm:text-lg rounded-full shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transform transition-all hover:brightness-110 mb-4 sm:mb-6"
          >
            Join Existing Family
          </motion.button>
          <div className="text-left w-full">
            <p className="text-[#c2410c] font-semibold text-base sm:text-lg mb-2">
              Viewer Access
            </p>
            <ul className="text-[#c2410c] text-sm sm:text-base space-y-1">
              <li>- View only</li>
              <li>- Invite Required</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
);

// Animation variants for smooth GPU-accelerated transitions
const pageVariants = {
  initial: {
    opacity: 0,
    x: 50,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const, // easeOutQuad for smooth feel
    },
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.98,
    transition: {
      duration: 0.2,
      ease: [0.55, 0.06, 0.68, 0.19] as const, // easeInQuad for snappy exit
    },
  },
};

// Fade variant for simpler transitions
const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
};

const OtpScreen = ({
  mobileNumber,
  isRegistering,
  onVerify,
  onBack,
  onResend,
}: {
  mobileNumber?: string;
  isRegistering: boolean;
  onVerify: (otpValue: string) => void;
  onBack: () => void;
  onResend: () => void;
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(30);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpAnimated = useRef(false);

  useEffect(() => {
    otpAnimated.current = true;
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const shouldAnimate = !otpAnimated.current;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      setResendTimer(30);
      setOtp(["", "", "", "", "", ""]);
      onResend();
    }
  };

  return (
    <motion.div
      key="otp"
      variants={pageVariants}
      initial={shouldAnimate ? "initial" : false}
      animate="animate"
      exit="exit"
      className="w-full min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 pt-20 sm:pt-24 relative"
    >
      <BackButton shouldAnimate={shouldAnimate} onClick={onBack} />

      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: -20 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif italic font-bold text-white mb-2 leading-tight">
          Preserve your family legacy
        </h2>
        <h3 className="text-lg sm:text-xl font-semibold text-[#c2410c] mt-4">
          Verify Account
        </h3>
      </motion.div>

      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="bg-white rounded-2xl shadow-2xl px-6 sm:px-10 py-8 sm:py-10 w-full max-w-md mx-auto"
      >
        <h4 className="text-[#c2410c] text-lg sm:text-xl font-semibold text-center mb-6 sm:mb-8">
          OTP Sent to {mobileNumber}
        </h4>

        <div className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-10">
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              ref={(el) => {
                otpInputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-lg bg-[#f8d5c8] border-2 border-[#f0b8a8] focus:outline-none focus:ring-2 focus:ring-[#c2410c]/50 focus:border-[#c2410c] transition-all text-[#78350f]"
            />
          ))}
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onVerify(otp.join(""))}
            disabled={isRegistering || otp.join("").length < 6}
            className="px-12 sm:px-16 py-3 sm:py-3.5 bg-gradient-to-b from-[#fcd34d] to-[#d97706] border-2 border-[#b45309] text-[#78350f] font-bold text-base sm:text-lg rounded-xl shadow-[0_4px_0_rgb(180,83,9)] active:shadow-none active:translate-y-[4px] transform transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isRegistering ? "Registering..." : "Verify & Register"}
          </motion.button>
        </div>
      </motion.div>

      <div className="mt-6 sm:mt-8">
        {resendTimer > 0 ? (
          <p className="text-[#78350f] text-base sm:text-lg font-medium">
            Resend OTP in{" "}
            <span className="font-bold text-[#c2410c]">{resendTimer}s</span>
          </p>
        ) : (
          <button
            onClick={handleResendOtp}
            className="text-[#c2410c] text-base sm:text-lg font-semibold hover:underline cursor-pointer"
          >
            Resend OTP
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default function RegistrationScreen() {
  const router = useRouter();
  const { data: user, isLoading: isSessionLoading } = useMe();
  const [isMounted, setIsMounted] = useState(false);
  const hasToken = isMounted ? Cookies.get("auth_token") : undefined;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user && user.payment === 1) {
      router.push("/dashboard");
    }
  }, [user, router, isMounted]);

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [showFamilyChoice, setShowFamilyChoice] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showJoinFamily, setShowJoinFamily] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showLoginInvite, setShowLoginInvite] = useState(false);

  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: verifyPayment } = useVerifyPayment();

  const handleRazorpayPayment = async (amount: number) => {
    if (typeof window === "undefined" || !(window as any).Razorpay) {
      toast.error(
        "Razorpay SDK is still loading. Please try again in a moment.",
      );
      return;
    }

    try {
      console.log("[Payment] Initiating order creation for amount:", amount);
      const orderData = await createOrder({ amount });

      if (!orderData || !orderData.success || !orderData.order) {
        console.error(
          "[Payment] Order creation failed or returned invalid data:",
          orderData,
        );
        toast.error("Failed to initiate payment. Please try again.");
        return;
      }

      console.log("[Payment] Order created successfully:", orderData.order.id);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Vansham",
        description: "Family Tree Subscription",
        order_id: orderData.order.id,
        handler: async (response: any) => {
          console.log(
            "[Payment] Success handler triggered:",
            response.razorpay_payment_id,
          );
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              console.log("[Payment] Verification successful");
              router.push("/dashboard");
            } else {
              console.error(
                "[Payment] Verification failed:",
                verification.message,
              );
              toast.error(
                verification.message || "Payment verification failed.",
              );
            }
          } catch (err) {
            console.error("[Payment] Verification error:", err);
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || registrationData?.name || "",
          contact: user?.mobile_number || registrationData?.mobile_number || "",
        },
        theme: {
          color: "#c2410c",
        },
        modal: {
          ondismiss: () => {
            console.log("[Payment] Checkout modal dismissed by user");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (response: any) => {
        console.error("[Payment] Payment failed event:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      console.error("[Payment] Critical initiation error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const [registrationData, setRegistrationData] = useState<{
    name: string;
    mobile_number: string;
    password?: string;
  } | null>(null);

  const { mutate: sendOtp } = useSendOtp();
  const { mutate: register, isPending: isRegistering } = useRegister();

  const handleVerifyOtp = (otpValue: string) => {
    if (registrationData && otpValue.length === 6) {
      register(
        {
          ...registrationData,
          otp: otpValue,
        },
        {
          onSuccess: () => {
            setShowFamilyChoice(true);
          },
        },
      );
    }
  };

  if (isMounted && hasToken && isSessionLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-orange-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          🌳
        </motion.div>
      </div>
    );
  }

  // Also prevent flash of content if we are about to redirect
  if (
    isMounted &&
    hasToken &&
    !isSessionLoading &&
    user &&
    user.payment === 1
  ) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-orange-50" />
    );
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/registration-bg.png')",
        }}
      />
      <div className="absolute inset-0 z-0 bg-orange-700/30" />

      <div className="relative z-10 w-full flex flex-col lg:flex-row overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-3 sm:top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white px-5 sm:px-8 py-2 sm:py-3 shadow-xl flex items-center gap-2 sm:gap-3">
            <div className="text-[#c2410c] text-2xl sm:text-3xl">🌳</div>
            <h1 className="text-lg sm:text-2xl font-serif text-[#c2410c] font-bold tracking-wider uppercase">
              VANSHAM
            </h1>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {showJoinFamily && (
            <JoinFamilyScreen
              inviteCode={inviteCode}
              setInviteCode={setInviteCode}
              onBack={() => setShowJoinFamily(false)}
              onJoin={() => router.push("/dashboard")}
            />
          )}
          {!showJoinFamily && showPayment && (
            <PaymentScreen
              onBack={() => setShowPayment(false)}
              onPay={handleRazorpayPayment}
            />
          )}
          {!showJoinFamily && !showPayment && showFamilyChoice && (
            <FamilyChoiceScreen
              onPayment={() => setShowPayment(true)}
              onJoinFamily={() => setShowJoinFamily(true)}
            />
          )}
          {!showJoinFamily &&
            !showPayment &&
            !showFamilyChoice &&
            showOtpScreen && (
              <OtpScreen
                mobileNumber={registrationData?.mobile_number}
                isRegistering={isRegistering}
                onVerify={handleVerifyOtp}
                onBack={() => setShowOtpScreen(false)}
                onResend={() => {
                  if (registrationData?.mobile_number) {
                    sendOtp({ mobile_number: registrationData.mobile_number });
                  }
                }}
              />
            )}
          {!showJoinFamily &&
            !showPayment &&
            !showFamilyChoice &&
            !showOtpScreen &&
            showLoginInvite && (
              <LoginInviteScreen
                inviteCode={inviteCode}
                setInviteCode={setInviteCode}
                onBack={() => setShowLoginInvite(false)}
                onNext={() => router.push("/dashboard")}
              />
            )}
          {!showJoinFamily &&
            !showPayment &&
            !showFamilyChoice &&
            !showOtpScreen &&
            !showLoginInvite &&
            showLogin && (
              <LoginForm
                onBackToRegister={() => setShowLogin(false)}
                onLoginSuccess={(user) => {
                  if (user.payment === 0) {
                    setShowFamilyChoice(true);
                    setShowLogin(false);
                  } else {
                    setShowLogin(false);
                    router.push("/dashboard");
                  }
                }}
              />
            )}
          {!showJoinFamily &&
            !showPayment &&
            !showFamilyChoice &&
            !showOtpScreen &&
            !showLoginInvite &&
            !showLogin && (
              <RegistrationForm
                onLoginClick={() => setShowLogin(true)}
                onOtpSent={(data) => {
                  setRegistrationData(data);
                  setShowOtpScreen(true);
                }}
              />
            )}
        </AnimatePresence>
      </div>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
