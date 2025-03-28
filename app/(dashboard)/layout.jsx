"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname, useRouter } from "next/navigation";
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
  AlertCircle,
  UserRoundCheck,
  LockIcon,
} from "lucide-react";
import { fonts } from "@/components/ui/font";
import withAuthCheck from "@/lib/withAuthCheck";
import { FaHome } from "react-icons/fa";

// ===================== Sidebar Items =====================
const sellerSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, requiresApproval: true },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "RFQ", href: "/dashboard/rfq", icon: ShoppingCart, requiresApproval: true },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare, requiresApproval: true },
  { name: "Products", href: "/dashboard/products", icon: BoxesIcon, requiresApproval: true },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

const buyerSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, requiresApproval: true },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "RFQ", href: "/dashboard/rfq", icon: ShoppingCart, requiresApproval: true },
  { name: "Inquiry", href: "/dashboard/inquiries", icon: MessageSquare, requiresApproval: true },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

const adminSidebarItems = [
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
  { name: "Pending User", href: "/dashboard/pending-reg", icon: UserRoundCheck },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

// ===================== SidebarItem Component =====================
const SidebarItem = ({ item, isActive, isCollapsed, onClick, userData }) => {
  const Icon = item.icon;
  const router = useRouter();
  
  // Check if user is pending registration
  const isPending = userData?.body === "Pending Registeration" || userData?.body === "Pending";
  
  // Check if this item should be locked for pending users
  const isLocked = isPending && item.requiresApproval;

  // Example: handle restricted or sign-out logic
  const handleClick = async (e) => {
    // If item is locked, prevent navigation
    if (isLocked) {
      e.preventDefault();
      return;
    }
    
    // If it's "Sign out", delete cookies & redirect
    if (item.name === "Sign out") {
      e.preventDefault();
      await fetch("/api/auth/user", { method: "DELETE" });
      router.push("/");
      return;
    }
    // Otherwise, run any custom onClick
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="relative">
      <Link href={isLocked ? "#" : item.href} onClick={handleClick}>
        <span
          className={cn(
            "group flex items-center rounded-lg px-4 py-3 transition-all",
            isActive ? (isLocked ? "bg-white/5 text-gray-400" : "bg-white/10 text-white") : 
                      (isLocked ? "text-gray-400 cursor-not-allowed" : "text-gray-200 hover:text-white"),
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3", isLocked && "opacity-50")} />
          {!isCollapsed && (
            <span className={`font-medium ${fonts.montserrat} ${isLocked ? "opacity-50" : ""}`}>
              {item.name}
            </span>
          )}
          
          {/* Show lock icon for locked items */}
          {isLocked && !isCollapsed && (
            <LockIcon className="h-4 w-4 ml-auto text-gray-400" />
          )}
        </span>
      </Link>
      
      {/* Show lock icon in tooltip for collapsed sidebar */}
      {isLocked && isCollapsed && (
        <div className="absolute right-1 top-1">
          <LockIcon className="h-3 w-3 text-gray-400" />
        </div>
      )}
    </div>
  );
};

// ===================== Desktop Sidebar (≥1024px) =====================
const DesktopSidebar = ({ items, isCollapsed, onToggleCollapse, userData }) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
        "bg-gradient-to-b from-teal-600 to-teal-700 shadow-xl"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {/* "Go Main" link is inside sidebar for desktop */}
        {!isCollapsed && (
          <Link
            href="/"
            className="flex items-center gap-2 bg-gradient-to-r from-green-800 to-green-950
                       hover:scale-105 transition-all px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
          >
            <FaHome className="text-2xl text-yellow-400" />
            <h2 className={`text-lg ${fonts.montserrat} font-bold text-white`}>
              Go Main
            </h2>
          </Link>
        )}
        <Button variant="ghost" className="text-white" onClick={onToggleCollapse}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Display pending status if applicable */}
      {(userData?.body === "Pending Registeration" || userData?.body === "Pending") && !isCollapsed && (
        <div className="mx-3 mt-3 p-2 bg-yellow-600/30 rounded-md text-yellow-200 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>Pending approval. Only Profile is accessible.</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <ScrollArea className="flex-1 px-3">
        <nav className="flex flex-col gap-1 py-4">
          {items.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
              isCollapsed={isCollapsed}
              userData={userData}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

// ===================== Mobile Sidebar (<1024px) =====================
const MobileSidebar = ({ items, userData }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Hamburger Button visible on mobile (LEFT side) */}
      <Button variant="ghost" className="text-white" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar & Overlay Container */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Slide-in Sidebar Panel */}
        <div
          className={cn(
            "w-64 bg-gradient-to-b from-teal-600 to-teal-700 h-full shadow-xl transform transition-transform duration-300",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-end p-4 border-b border-white/10">
            {/* Close the sidebar */}
            <Button
              variant="ghost"
              className="text-white"
              onClick={() => setOpen(false)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Display pending status if applicable */}
          {(userData?.body === "Pending Registeration" || userData?.body === "Pending") && (
            <div className="mx-3 mt-3 p-2 bg-yellow-600/30 rounded-md text-yellow-200 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>Pending approval. Only Profile is accessible.</span>
            </div>
          )}
          
          <ScrollArea className="flex-1 px-3">
            <nav className="flex flex-col gap-1 py-4">
              {items.map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                  isCollapsed={false}
                  onClick={() => setOpen(false)}
                  userData={userData}
                />
              ))}
            </nav>
          </ScrollArea>
        </div>
        {/* Transparent overlay to close sidebar */}
        <div className="flex-1" onClick={() => setOpen(false)} />
      </div>
    </>
  );
};

// ===================== Dashboard Layout =====================
const DashboardLayout = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();
        if (data.userData) {
          setUserData(data.userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (isLoading || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  // Determine which sidebar items to show
  let sidebarItems;
  const userType = userData.type?.toLowerCase() || "";
  if (userType === "admin") {
    sidebarItems = adminSidebarItems;
  } else if (userType === "seller") {
    sidebarItems = sellerSidebarItems;
  } else if (userType === "buyer") {
    sidebarItems = buyerSidebarItems;
  } else {
    sidebarItems = [];
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 
        1) Desktop Sidebar (≥1024px) 
        "Go Main" is inside the sidebar header.
      */}
      <DesktopSidebar
        items={sidebarItems}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        userData={userData}
      />

      {/* 
        2) Main Content Area 
      */}
      <div className="flex flex-col flex-1">
        {/* 
          Mobile Header (<1024px)
          - Hamburger (left side)
          - "Go Main" link (right side)
        */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-teal-700">
          {/* Hamburger + mobile sidebar drawer on the left */}
          <MobileSidebar items={sidebarItems} userData={userData} />

          {/* "Go Main" link on the right */}
          <Link
            href="/"
            className="flex items-center gap-2 bg-gradient-to-r from-green-800 to-green-950 
                       hover:scale-105 transition-all px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
          >
            <FaHome className="text-2xl text-yellow-400" />
            <h2 className={`text-lg ${fonts.montserrat} font-bold text-white`}>
              Go Main
            </h2>
          </Link>
        </div>

        {/* Pending registration warning banner - show on all pages */}
        {(userData?.body === "Pending Registeration" || userData?.body === "Pending") && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
              <p>Your registration is pending approval. Only your Profile page is accessible until approved.</p>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default withAuthCheck(DashboardLayout);