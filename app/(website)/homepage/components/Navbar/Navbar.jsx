"use client";

import React, { useEffect, useState, useCallback, useMemo, memo } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoChevronDown } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { Menubar } from "./Menubar";
import SideMenu from "./SideMenu/SideMenu";
import SearchBar from "./Search";
import ProfileDropdown from "./ProfileDropdown";

import { fonts } from "@/components/ui/font";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import trade_logo from "../../../../../public/ttlogo.png";

// Memoized authentication buttons component
const AuthButtons = memo(({ userData, pathname, webcode }) => {
  if (userData?.webcode) {
    return (
      <>
        <Link href="/dashboard">
          <button
            className={`
              text-[15px] font-bold px-5 text-white ${
                fonts.montserrat
              } py-2 rounded-md transition-all
              ${
                pathname === "/signin"
                  ? "bg-green-600"
                  : "bg-transparent hover:bg-[#3a7791cc]"
              } 
              hover:scale-105
            `}
          >
            Dashboard
          </button>
        </Link>
        <Link href="">
          <button
            className={`
              text-sm text-white ${
                fonts.montserrat
              } px-5 py-2 rounded-md border border-white hover:border-none font-bold transition-all capitalize
              ${
                pathname === "/signin"
                  ? "bg-transparent"
                  : pathname === "/signup"
                  ? "bg-green-600"
                  : "hover:hover:bg-[#3a7791cc]"
              }
              hover:scale-105 hover:hover:bg-[#3a7791cc]
            `}
          >
            <ProfileDropdown webcode={webcode} />
          </button>
        </Link>
      </>
    );
  }

  return (
    <>
      <Link href="/signin">
        <button
          className={`
            text-[15px] font-bold px-5 text-white ${
              fonts.montserrat
            } py-2 rounded-md transition-all
            ${
              pathname === "/signin"
                ? "bg-green-600"
                : "bg-transparent hover:bg-[#3a7791cc]"
            } 
            hover:scale-105
          `}
        >
          Sign in
        </button>
      </Link>
      <Link href="/signup">
        <button
          className={`
            text-sm text-white ${
              fonts.montserrat
            } px-5 py-2 rounded-md border border-white hover:border-none font-bold transition-all capitalize
            ${
              pathname === "/signin"
                ? "bg-transparent"
                : pathname === "/signup"
                ? "bg-green-600"
                : "hover:hover:bg-[#3a7791cc]"
            }
            hover:scale-105 hover:hover:bg-[#3a7791cc]
          `}
        >
          Sign up
        </button>
      </Link>
    </>
  );
});

// Ensure displayName is set for React DevTools
AuthButtons.displayName = "AuthButtons";

// Memoized supplier dropdown for mobile view
const SupplierDropdown = memo(() => (
  <div className="md:block hidden">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex ${fonts.montserrat} items-center gap-1 text-white px-3 py-2 focus:outline-none text-sm`}
        >
          Knowde for Suppliers
          <IoChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-[#1B2637] border-gray-700"
      >
        <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">
          Supplier Dashboard
        </DropdownMenuItem>
        <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">
          Analytics
        </DropdownMenuItem>
        <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
));

// Ensure displayName is set for React DevTools
SupplierDropdown.displayName = "SupplierDropdown";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [iswebcode, setIsWebcode] = useState("");

  const router = useRouter();
  const pathname = usePathname();

  // Memoize toggle function to prevent recreation on each render
  const handleToggle = useCallback(() => {
    setIsMenuOpen((prevState) => !prevState);
  }, []);

  // Memoize close menu function
  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (!isMounted) return;

        if (data.userData) {
          setUserData(data.userData);
          setIsWebcode(data?.userData?.webcode || "");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();

    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Only render the SideMenu when it's open to save on render costs
  const sideMenuComponent = useMemo(() => {
    return isMenuOpen ? <SideMenu onclose={handleCloseMenu} /> : null;
  }, [isMenuOpen, handleCloseMenu]);

  return (
    <header className="bg-[#37bfb1] sticky top-0 z-50 pt-28 md:pt-16">
      <div className="flex flex-row py-3 px-8 items-center justify-between">
        {/* Logo */}
        <div className="flex gap-3 items-center">
          <RxHamburgerMenu
            size={25}
            className="lg:hidden block text-white"
            onClick={handleToggle}
          />
          {sideMenuComponent}

          <Link href={"/"}>
            <Image src={trade_logo} alt="logo" width={95} height={95} />
          </Link>
        </div>

        {/* Search bar */}
        <div className="lg:block hidden w-[65%] lg:w-[70%]">
          <SearchBar />
        </div>

        {/* Auth buttons + Cart */}
        <div className="flex items-center gap-0 md:gap-2">
          <div className="flex gap-4">
            <AuthButtons
              userData={userData}
              pathname={pathname}
              webcode={iswebcode}
            />
          </div>
        </div>
      </div>

      {/* Menu bar */}
      <Menubar />

      {/* Mobile */}
      <div className="lg:hidden flex px-2">
        <div className="w-full mx-2 my-2">
          <SearchBar />
        </div>
        {/* suppliers content */}
        <SupplierDropdown />
      </div>
    </header>
  );
};

export default Navbar;
