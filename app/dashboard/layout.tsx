"use client";

import React from "react";
import { motion } from "motion/react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/api/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useMe();
  const router = useRouter();
  const [isMounted, setIsMounted] = React.useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !user) {
      router.push("/");
    }
  }, [user, isLoading, router, isMounted]);

  if (!isMounted || isLoading) {
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background font-sans">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          {/* Enhanced Top Navigation */}
          <header className="sticky top-0 z-30 flex h-14 md:h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-3 md:px-6">
            <div className="flex items-center gap-2 md:gap-4">
              <SidebarTrigger className="text-primary hover:bg-accent/50 rounded-xl" />
              <div className="h-6 w-px bg-border hidden sm:block" />
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-border shadow-sm ring-offset-background transition-all hover:ring-2 hover:ring-accent/20 cursor-pointer">
                <AvatarFallback className="bg-primary text-primary-foreground font-bold text-[10px] md:text-xs uppercase">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : "???"}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 transition-all duration-300">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
