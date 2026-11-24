"use client";

import * as React from "react";
import {
  TreeDeciduous,
  Users,
  User,
  Image,
  FileText,
  Dna,
  Gem,
  Shield,
  Settings,
  LogOut,
  ChevronUp,
  Network,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMe, useLogout } from "@/hooks/api/useAuth";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  {
    name: "Family Tree",
    href: "/dashboard/family-tree",
    icon: Network,
  },
  { name: "Members", href: "/dashboard/members", icon: Users },
  { name: "Gallery", href: "/dashboard/gallery", icon: Image },
  { name: "Document", href: "/dashboard/documents", icon: FileText },
  { name: "DNA Discovery", href: "/dashboard/dna-discovery", icon: Dna },
  { name: "Kul Ratna", href: "/dashboard/kul-ratna", icon: Gem },
  { name: "Admin", href: "/dashboard/admin", icon: Shield },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { data: user } = useMe();
  const logout = useLogout();

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-sidebar-border bg-sidebar"
    >
      <SidebarHeader className="p-0 pt-4 group-data-[collapsible=icon]:items-center">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem>
            <div className="flex items-center">
              <div className="flex bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8 shrink-0 items-center justify-center rounded-lg shadow-lg shadow-sidebar-primary/20 transition-transform group-hover/sidebar-header:scale-105 group-data-[collapsible=icon]:size-8">
                <TreeDeciduous className="size-5" />
              </div>
              <div className="flex flex-col items-start gap-0.5 ml-3 overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:opacity-0">
                <span className="font-serif text-lg font-bold leading-none tracking-tight text-sidebar-foreground">
                  VANSHAM
                </span>
                <span className="text-[10px] font-medium tracking-widest text-sidebar-foreground/50 uppercase">
                  Registry
                </span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:p-0">
          <SidebarGroupLabel className="text-sidebar-foreground/30 font-bold tracking-[0.2em] uppercase text-[10px] px-4 py-4 group-data-[collapsible=icon]:hidden">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2 space-y-1 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.name}
                    className="h-11 rounded-xl data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm hover:bg-sidebar-accent/50 transition-all duration-200"
                  >
                    <Link href={item.href}>
                      <item.icon className="size-5 shrink-0" />
                      <span className="font-semibold text-[13px] tracking-tight">
                        {item.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0 mb-4 group-data-[collapsible=icon]:items-center">
        <SidebarMenu className="group-data-[collapsible=icon]:items-center">
          <SidebarMenuItem className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl h-14 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                >
                  <Avatar className="h-10 w-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 shrink-0 border-2 border-sidebar-border shadow-sm transition-all rounded-lg group-data-[collapsible=icon]:rounded-lg">
                    <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground font-bold text-xs uppercase rounded-lg">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start gap-0.5 ml-3 overflow-hidden transition-all group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:opacity-0">
                    <span className="text-[13px] font-bold truncate text-sidebar-foreground">
                      {user?.name || "Loading..."}
                    </span>
                    <span className="text-[10px] font-medium text-sidebar-foreground/40 truncate uppercase tracking-widest">
                      {user?.my_referral_code
                        ? `Ref: ${user.my_referral_code}`
                        : "Member"}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 text-sidebar-foreground/40 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={12}
                className="w-56 rounded-2xl p-2 border-sidebar-border shadow-2xl bg-sidebar font-sans"
              >
                <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40">
                  Account Management
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-sidebar-border/50" />
                <DropdownMenuItem
                  asChild
                  className="rounded-xl px-3 py-2 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground cursor-pointer"
                >
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center w-full"
                  >
                    <User className="w-4 h-4 mr-2 opacity-50" />
                    <span className="text-[13px] font-medium">My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-3 py-2 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground cursor-pointer">
                  <Settings className="w-4 h-4 mr-2 opacity-50" />
                  <span className="text-[13px] font-medium">
                    Global Settings
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="rounded-xl px-3 py-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="w-4 h-4 mr-2 opacity-50" />
                  <span className="text-[13px] font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
