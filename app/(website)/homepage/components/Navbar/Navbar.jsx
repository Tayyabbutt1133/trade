"use client";

import React, { useEffect } from "react";

import { useState } from "react";
import { Menubar } from "./Menubar";
import { RxHamburgerMenu } from "react-icons/rx";
import SideMenu from "./SideMenu/SideMenu";
import { fonts } from "@/components/ui/font";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoChevronDown } from "react-icons/io5";
import Link from "next/link";
import SearchBar from "./Search";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();

        if (data.userData) {
          setUserData(data.userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleToggle = () => {
    setisMenuOpen(!isMenuOpen);
  };

  const pathname = usePathname();

  return (
    <header className="bg-[#37bfb1] sticky top-0 z-50">
      <div className="flex flex-row py-3 px-8 items-center justify-between">
        {/* Logo */}
        <div className="flex gap-3 items-center">
          <RxHamburgerMenu
            size={25}
            className="lg:hidden block text-white"
            onClick={handleToggle}
          />
          {isMenuOpen && <SideMenu onclose={() => setisMenuOpen(false)} />}

          <Link href={"/"}>
            <h1
              className={`text-white ${fonts.montserrat} text-[18px] lg:text-xl font-bold`}
            >
              Trade
            </h1>
          </Link>
        </div>
        {/* Search bar */}
        <div className="lg:block hidden w-[65%] lg:w-[70%]">
          <SearchBar />
        </div>

        {/* Auth buttons + Cart */}
        <div className="flex items-center gap-0 md:gap-2">
          {/* <button className="text-white sm:block transition hidden hover:scale-110">
            <MdShoppingCart size={25} />
          </button> */}

          {/* signup/signin buttons */}
          <div className="flex gap-4">
            <Link href={userData?.id ? "/dashboard" : "/signin"}>
              <button
                className={`
            text-sm font-bold px-5 text-white ${
              fonts.montserrat
            } py-2 rounded-md transition-all
            ${
              pathname === "/signin"
                ? "bg-green-600"
                : "bg-transparent hover:bg-[#081023CC]"
            } 
            hover:scale-105
          `}
              >
                {userData?.id ? "Dashboard" : "Sign in"}
              </button>
            </Link>
            <Link href={userData?.id ? "" : "/signup"}>
              <button
                onClick={
                  userData?.id
                    ? async () => {
                        await fetch("/api/auth/user", { method: "DELETE" });
                        window.location.href = window.location.pathname;
                      }
                    : null
                }
                className={`
      text-sm text-white ${
        fonts.montserrat
      } px-5 py-2 rounded-md font-bold transition-all capitalize
      ${
        pathname === "/signin"
          ? "bg-transparent"
          : pathname === "/signup"
          ? "bg-green-600"
          : "bg-[#081023CC]"
      }
      hover:scale-105 hover:bg-[#081023CC]
    `}
              >
                {userData?.id ? "sign out" : "Sign up"}
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* Menu bar */}
      <Menubar />

      {/* Mobile */}
      <div className="lg:hidden flex px-2">
        <div className=" w-full mx-2 my-2">
          <SearchBar />
        </div>
        {/* suppliers content */}
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
      </div>
    </header>
  );
};

export default Navbar;
