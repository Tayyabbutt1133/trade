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
} from "lucide-react";
import { fonts } from "@/components/ui/font";
import { Alert, AlertDescription } from "@/components/ui/alert";
import withAuthCheck from "@/lib/withAuthCheck";

// ===================== Sidebar Items =====================
const sellerSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "RFQ", href: "/dashboard/rfq", icon: ShoppingCart },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: MessageSquare },
  { name: "Products", href: "/dashboard/products", icon: BoxesIcon },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

const buyerSidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  { name: "RFQ", href: "/dashboard/rfq", icon: ShoppingCart },
  { name: "Inquiry", href: "/dashboard/inquiries", icon: MessageSquare },
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
  {
    name: "Pending User",
    href: "/dashboard/pending-reg",
    icon: UserRoundCheck,
  },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

// ===================== SidebarItem Component =====================
const SidebarItem = ({ item, isActive, isCollapsed, onClick, userData }) => {
  const Icon = item.icon;

  // Check if navigation should be disabled
  const isPendingRegistration =
    userData &&
    (userData.type === "Seller" || userData.type === "buyer" ) &&
    (userData.body === "Pending Registeration" || userData.body === "Pending");

  const isDisabled =
    isPendingRegistration &&
    item.href !== "/dashboard/profile" &&
    item.href !== "/signin";

  // Handle clicks with navigation prevention for restricted items
  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      alert(
        "Your registration is pending. You can only access your profile until approved."
      );
      return;
    }

    if (onClick) {
      onClick();
    }
  };

  // For disabled items we use a div with styling similar to Link
  if (isDisabled) {
    return (
      <div className="cursor-not-allowed">
        <div
          className={cn(
            "group flex items-center rounded-lg px-4 py-3 transition-all",
            isActive
              ? "bg-white/10 text-white"
              : "text-gray-200 hover:text-white opacity-50",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Icon className={cn("h-5 w-5", isCollapsed ? "mr-0" : "mr-3")} />
          {!isCollapsed && (
            <span className={`font-medium ${fonts.montserrat}`}>
              {item.name}
            </span>
          )}
        </div>
      </div>
    );
  }

  // For enabled items we use normal Link
  return (
    <Link href={item.href} onClick={handleClick}>
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
          <span className={`font-medium ${fonts.montserrat}`}>{item.name}</span>
        )}
      </span>
    </Link>
  );
};

// ===================== Desktop Sidebar Component =====================
const Sidebar = ({ items, isCollapsed, onToggleCollapse, userData }) => {
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
              userData={userData}
            />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
};

// ===================== Mobile Sidebar Component =====================
const MobileSidebar = ({ items, userData }) => {
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
                  userData={userData}
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
  // State for user data
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // State for desktop sidebar collapse
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Function to fetch user data from API
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

  // Check if registration is pending
  const isPendingRegistration =
    userData &&
    (userData.type === "Seller" || userData.type === "buyer") &&
    (userData.body === "Pending Registeration" || userData.body === "Pending");

  // Redirect if trying to access restricted pages
  useEffect(() => {
    if (
      isPendingRegistration &&
      pathname !== "/dashboard/profile" &&
      pathname !== "/signin" &&
      pathname !== "/dashboard"
    ) {
      router.push("/dashboard/profile");
    }
  }, [isPendingRegistration, pathname, router]);

  if (isLoading || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  const sidebarItems =
    userData.type.toLowerCase() === "admin"
      ? ADMIN_ITEMS
      : userData.type.toLowerCase() === "seller"
      ? sellerSidebarItems
      : userData.type.toLowerCase() === "buyer"
      ? buyerSidebarItems
      : [];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar (visible on large screens) */}
      <Sidebar
        items={sidebarItems}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        userData={userData}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header (visible on small screens) */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-teal-700">
          <MobileSidebar items={sidebarItems} userData={userData} />
          {/* Placeholder for alignment */}
          <div className="w-8" />
        </div>

        {/* Pending Registration Alert */}
        {isPendingRegistration && (
          <Alert variant="destructive" className="m-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your registration is pending approval. You can only access your
              profile page until your account is approved.
            </AlertDescription>
          </Alert>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default withAuthCheck(DashboardLayout);
