"use client";

import React, { useState, useEffect, useRef } from "react";
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
const IndustryManufacturerItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiresApproval: true,
  },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  {
    name: "RFQ",
    href: "/dashboard/rfq",
    icon: ShoppingCart,
    requiresApproval: true,
  },
  {
    name: "Inquiries",
    href: "/dashboard/inquiries",
    icon: MessageSquare,
    requiresApproval: true,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: BoxesIcon,
    requiresApproval: true,
  },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

const buyerSidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiresApproval: true,
  },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  {
    name: "RFQ",
    href: "/dashboard/rfq",
    icon: ShoppingCart,
    requiresApproval: true,
  },
  {
    name: "Inquiries",
    href: "/dashboard/inquiries",
    icon: MessageSquare,
    requiresApproval: true,
  },
  { name: "Sign out", href: "/signin", icon: LogOut },
];

const tradingCompaniesItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    requiresApproval: true,
  },
  { name: "Profile", href: "/dashboard/profile", icon: User },
  {
    name: "RFQ",
    href: "/dashboard/rfq",
    icon: ShoppingCart,
    requiresApproval: true,
  },
  {
    name: "Inquiries",
    href: "/dashboard/inquiries",
    icon: MessageSquare,
    requiresApproval: true,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: BoxesIcon,
    requiresApproval: true,
  },
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
  const router = useRouter();

  const isPending =
    userData?.status === "Pending Registeration" ||
    userData?.status === "Pending";

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
            isActive
              ? isLocked
                ? "bg-white/5 text-gray-400"
                : "bg-white/10 text-white"
              : isLocked
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-200 hover:text-white",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              isCollapsed ? "mr-0" : "mr-3",
              isLocked && "opacity-50"
            )}
          />
          {!isCollapsed && (
            <span
              className={`font-medium ${fonts.montserrat} ${
                isLocked ? "opacity-50" : ""
              }`}
            >
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

  // Cleaned and normalized userType and status
  const userType = userData?.type?.trim().toLowerCase() || "";
  const status = userData?.status?.trim().toLowerCase() || "";

  // Determine if the user is in a pending state
  const isPending = status === "pending" || status === "pending registeration";

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
        <Button
          variant="ghost"
          className="text-white"
          onClick={onToggleCollapse}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Only show for non-admin and if status is pending */}
      {isPending && userType !== "admin" && !isCollapsed && (
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

  // Normalize values
  const userType = userData?.type?.trim().toLowerCase() || "";
  const status = userData?.status?.trim().toLowerCase() || "";
  const isPending =
    (status === "pending" || status === "pending registeration") &&
    userType !== "admin";

  return (
    <>
      {/* Hamburger Button visible on mobile (LEFT side) */}
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

          {/* Show "Pending approval" message if conditions met */}
          {isPending && (
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
  const [userWebcode, setUserWebcode] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);
  // Add this new state right here
  const [showConstructionAlert, setShowConstructionAlert] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // 1️⃣ Fetch webcode from cookies (/api/auth/user)
  useEffect(() => {
    const fetchWebcodeFromCookie = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();
        const webcode = data?.userData?.webcode;

        if (webcode) {
          setUserWebcode(webcode);
        }
      } catch (error) {
        console.error("Failed to fetch user webcode:", error);
      }
    };
    fetchWebcodeFromCookie();
  }, []);

  // 2️⃣ Fetch full user data using webcode
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userWebcode) return;

        const formdata = new FormData();
        formdata.append("code", userWebcode);

        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/profile/",
          {
            method: "POST",
            body: formdata,
          }
        );
        const json_data = await response.json();
        const userData = json_data?.Registeration?.[0];

        if (userData) {
          const currentStatus = userData.status;
          const previousStatus = localStorage.getItem("previousStatus");

          // ✅ Show approval message if transitioned from Pending to Approved
          if (
            previousStatus &&
            (previousStatus === "Pending Registeration" ||
              previousStatus === "Pending") &&
            currentStatus !== previousStatus
          ) {
            setShowApprovalMessage(true);
            setTimeout(() => setShowApprovalMessage(false), 5000);
          }

          localStorage.setItem("previousStatus", currentStatus);
          setUserData(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userWebcode]);

  // Add this effect after the existing useEffect hooks
  useEffect(() => {
    // Check if the current route is RFQ or Inquiries
    const isConstructionPage =
      pathname.includes("/rfq") || pathname.includes("/inquiries");

    // Only show for non-admin users
    const isAdmin = userData?.type?.toLowerCase() === "admin";

    // Set the state to control alert visibility
    setShowConstructionAlert(isConstructionPage && !isAdmin);
  }, [pathname, userData]);

  // 3️⃣ Show loading state
  if (isLoading || !userData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-xl animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  // 4️⃣ Determine sidebar items based on user type
  const userType = userData?.type?.toLowerCase() || "";
  const normalizedUserType = decodeURIComponent(userType)
    .toLowerCase()
    .replace(/\s+/g, "_");

  let sidebarItems = [];
  if (userType === "admin") {
    sidebarItems = adminSidebarItems;
  } else if (normalizedUserType === "industrial_manufacturer") {
    sidebarItems = IndustryManufacturerItems;
  } else if (normalizedUserType === "trading_companies") {
    sidebarItems = tradingCompaniesItems;
  } else if (normalizedUserType === "buyer") {
    sidebarItems = buyerSidebarItems;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 1) Desktop Sidebar */}
      <DesktopSidebar
        items={sidebarItems}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        userData={userData}
      />

      {/* 2) Main Content */}
      <div className="flex flex-col flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-teal-700">
          <MobileSidebar items={sidebarItems} userData={userData} />
          <Link
            href="/"
            className="flex items-center gap-2 bg-gradient-to-r from-green-800 to-green-950 
                       hover:scale-105 transition-all px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
          >
            <FaHome className="text-2xl text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Go Main</h2>
          </Link>
        </div>

        {/* ✅ Approval Message Banner */}
        {showApprovalMessage && (
          <div className="bg-green-100 border-l-4 border-green-600 text-green-800 p-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <span role="img" aria-label="party">
                🎉
              </span>
              <p>
                Congratulations! Your profile has been approved. You now have
                full access to the dashboard.
              </p>
            </div>
          </div>
        )}

        {/* ⚠️ Pending Registration Banner */}
        {(userData?.status === "Pending Registeration" ||
          userData?.status === "Pending") &&
          userType !== "admin" && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                <p>
                  Your registration is pending approval. Only your Profile page
                  is accessible until approved.
                </p>
              </div>
            </div>
          )}

        {/* Construction Alert - Add this here */}
        {showConstructionAlert && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
              <p>
                <strong>Please note:</strong> Some features will not respond as
                long as website is under development/construction stage.
              </p>
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
