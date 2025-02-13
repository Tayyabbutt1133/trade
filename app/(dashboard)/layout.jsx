"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Store,
  ShoppingCart,
  MessageSquare,
  Mail,
  Megaphone,
  User,
  BoxesIcon,
  Menu,
  LayoutDashboard,
  LogOut,
  Armchair,
  BookUser,
} from "lucide-react";
import { fonts } from "@/components/ui/font";
import roleAccessStore from "@/store/role-access-permission";

// ===================== Sidebar Items =====================
const sellerSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Seller", href: "/dashboard/seller", icon: User },
  { name: "RFQ", href: "/dashboard/rfq", icon: ShoppingCart },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  { name: "Products", href: "/dashboard/products", icon: BoxesIcon },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

const buyerSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Buyer", href: "/dashboard/buyer", icon: User },
  { name: "RFQ", href: "/dashboard/rfq", icon: ShoppingCart },
  { name: "Inquiry", href: "/dashboard/inquiry", icon: MessageSquare },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

const ADMIN_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sellers", href: "/dashboard/seller", icon: Store },
  { name: "Buyers", href: "/dashboard/buyer", icon: Users },
  { name: "RFQ", href: "/dashboard/rfq", icon: ShoppingCart },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  { name: "Email", href: "/dashboard/email", icon: Mail },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Audience", href: "/dashboard/audience", icon: BookUser },
  { name: "Products", href: "/dashboard/products", icon: BoxesIcon },
  { name: "Expo Events", href: "/dashboard/expo-events", icon: Armchair },
  { name: "Users", href: "/dashboard/users", icon: User },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

// ===================== SidebarItem Component =====================
// Accepts an optional onClick handler which is used in the mobile sidebar.
const SidebarItem = ({ item, isActive, isCollapsed, onClick }) => {
  const Icon = item.icon;
  return (
    <Link href={item.href} onClick={onClick}>
      <span
        className={cn(
          "group flex items-center rounded-lg px-4 py-3 transition-all",
          isActive
            ? "bg-white/10 text-white"
            : "text-gray-200 hover:text-white",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <Icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
        {!isCollapsed && (
          <span className={`font-medium ${fonts.montserrat}`}>
            {item.name}
          </span>
        )}
      </span>
    </Link>
  );
};

// ===================== Desktop Sidebar Component =====================
const Sidebar = ({ items, isCollapsed, onToggleCollapse }) => {
  const pathname = usePathname();
  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
        "bg-gradient-to-b from-teal-600 to-teal-700 shadow-xl"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <Link href="/dashboard">
          {/* {!isCollapsed && (
            // <h2 className="text-xl font-bold text-white">Panel</h2>
          )} */}
        </Link>
        <Button
          variant="ghost"
          className="text-white"
          onClick={onToggleCollapse}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-1 py-4">
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

// ===================== Mobile Sidebar Component =====================
// Uses Tailwind CSS transitions (without external packages) and closes on item click.
const MobileSidebar = ({ items }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger Button */}
      <Button
        variant="ghost"
        className="text-white"
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar & Overlay Container */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Sidebar Panel */}
        <div
          className={cn(
            "w-64 bg-gradient-to-b from-teal-600 to-teal-700 h-full shadow-xl transform transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link href="/dashboard">
              {/* <h2 className="text-xl font-bold text-white">Panel</h2> */}
            </Link>
            <Button
              variant="ghost"
              className="text-white"
              onClick={() => setOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3">
            <nav className="flex flex-col gap-1 py-4">
              {items.map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  isCollapsed={false}
                  onClick={() => setOpen(false)}
                />
              ))}
            </nav>
          </ScrollArea>
        </div>
        {/* Transparent Overlay */}
        <div className="flex-1" onClick={() => setOpen(false)} />
      </div>
    </>
  );
};

// ===================== Dashboard Layout Component =====================
const DashboardLayout = ({ children }) => {
  // Retrieve and update the role from localStorage.
  const storedRole =
    typeof window !== "undefined" ? localStorage.getItem("role") : null;
  const [roleType, setRoleType] = useState(storedRole);
  const roleData = roleAccessStore((state) => state.role);

  // State for desktop sidebar collapse.
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (roleData?.type) {
      localStorage.setItem("role", roleData.type);
      setRoleType(roleData.type);
    }
  }, [roleData]);

  if (!roleType) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  const sidebarItems =
    roleType === "admin"
      ? ADMIN_ITEMS
      : roleType === "seller"
      ? sellerSidebarItems
      : roleType === "buyer"
      ? buyerSidebarItems
      : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar (visible on large screens) */}
      <Sidebar
        items={sidebarItems}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header (visible on small screens) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-teal-700">
          <MobileSidebar items={sidebarItems} />
          {/* <h2 className="text-xl font-bold text-white">Panel</h2> */}
          {/* Placeholder for alignment */}
          <div className="w-8" />
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
