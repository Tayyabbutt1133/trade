"use client";

import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  Grid2x2
} from "lucide-react";
import { fonts } from '@/components/ui/font';
import roleAccessStore from '@/store/role-access-permission';

// Sidebar items for Seller and Buyer
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

const adminItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Sellers", href: "/dashboard/seller", icon: Store },
  { name: "Buyers", href: "/dashboard/buyers", icon: Users },
  { name: "RFQ", href: "/dashboard/rfq", icon: ShoppingCart },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  { name: "Email", href: "/dashboard/email", icon: Mail },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Audience", href: "/dashboard/audience", icon: BookUser },
  { name: "Products", href: "/dashboard/products", icon: BoxesIcon },
  { name: "Categories", href: "/dashboard/categories", icon: Grid2x2 },
  { name: "Expo Events", href: "/dashboard/expo-events", icon: Armchair },
  { name: "Users", href: "/dashboard/users", icon: User },
  { name: "Sign out", href: "/signin", icon: LogOut },
]


// SidebarItem Component
const SidebarItem = ({ item, isActive, isCollapsed, onClick }) => {
  const Icon = item.icon;
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <Link href={item.href} onClick={handleClick}>
      <span
        className={cn(
          "group relative flex items-center rounded-lg px-4 py-3 transition-all duration-200",
          "hover:bg-white/10",
          isActive ? "bg-white/10 text-white" : "text-gray-200 hover:text-white",
          isCollapsed ? "justify-center" : "justify-start"
        )}
      >
        <Icon className={cn("h-5 w-5 transition-all duration-200", isCollapsed ? "mr-0" : "mr-3")} />
        {!isCollapsed && (
          <span className={`font-medium ${fonts.montserrat} truncate`}>{item.name}</span>
        )}
      </span>
    </Link>
  );
};

// Desktop Sidebar Component
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
      <div
        className={cn(
          "flex items-center p-4 border-b border-white/10",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link href="/dashboard">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-white truncate">Panel</h2>
          )}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/10"
          onClick={onToggleCollapse}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
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

// Mobile Sidebar Component
const MobileSidebar = ({ items }) => {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleItemClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden p-2 absolute top-4 left-4">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetTitle />
      <SheetContent
        side="left"
        className="w-64 p-0 bg-gradient-to-b from-teal-600 to-teal-700"
        aria-describedby="sidebar"
      >
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Panel</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <nav className="p-4">
            {items.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={pathname === item.href}
                isCollapsed={false}
                onClick={handleItemClick}
              />
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// Dashboard Layout Component
const DashboardLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Retrieve role data from Zustand store
  const roleData = roleAccessStore((state) => state.role);
  console.log("Zustand Response in dashboard", roleData);

  // Determine sidebar items based on the user's role type.
  const sidebarItems =
  roleData && roleData.type === "seller"
    ? sellerSidebarItems
    : roleData && roleData.type === "buyer"
    ? buyerSidebarItems
    : roleData && roleData.type === "admin"
    ? adminItems
    : [];


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        items={sidebarItems}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
      />
      <MobileSidebar items={sidebarItems} />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
