"use client";

import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoChevronDown } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";

import SideMenu from "./SideMenu/SideMenu";
import { fonts } from "@/components/ui/font";
import { menuData } from "@/app/menudata";
import MegaMenu from "./MegaMenu";
import Link from "next/link";
import Suppliers from "./Suppliers";

export function Menubar() {
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSideMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle MegaMenu open/close
  const handleMegaMenuToggle = () => {
    setActiveMegaMenu(activeMegaMenu ? null : "tradeCategories");
  };

  return (
    <>
      <hr className="lg:block hidden" />
      <nav className="lg:flex py-1 hidden items-center justify-between text-white px-4 relative">
        <div className="flex items-center">
          <RxHamburgerMenu
            className="cursor-pointer mx-4"
            onClick={handleSideMenu}
            size={20}
          />
          {/* Checking open/close state of menu and passing it to SideMenu */}
          {isMenuOpen && <SideMenu onclose={() => setIsMenuOpen(false)} />}

          {/* Single button for Trade Categories */}
          {/* handling mega menu toggle here */}

          <button
            className="flex items-center gap-1 px-4 text-white py-2 focus:outline-none"
            onClick={handleMegaMenuToggle}
          >
            <p className={`text-[13px] font-semibold ${fonts.montserrat}`}>
              Trade Categories
            </p>
            <IoChevronDown className="h-4 w-4 opacity-50" />
          </button>

          {/* Some extra categories data showing in menu bar */}
          <div className="flex items-center gap-1 ml-4">
            {menuData.sidebar.slice(2).map((item) => (
              <Link
                key={item.id}
                href={`/${item.id}`}
                className="text-white border border-none bg-[#404C4D] text-sm rounded-2xl px-3 py-1 hover:border-white"
              >
                <p className={`text-[12px] ${fonts.montserrat}`}>
                  {item.label}
                </p>
              </Link>
            ))}
            {/* <button
              className="text-white p-2 focus:outline-none"
              onClick={() => {}}
            >
              <HiDotsHorizontal className="h-5 w-5" />
              <span className="sr-only">More options</span>
            </button> */}
          </div>
        </div>

        {/* TradeTropper for suppliers */}
        {/* <Suppliers /> */}
      </nav>

      {/* MegaMenu is opened if activeMegaMenu is truthy */}
      {activeMegaMenu && (
        <div className="absolute left-0 right-0 bg-white z-50">
          <MegaMenu onClose={() => setActiveMegaMenu(null)} />
        </div>
      )}
    </>
  );
}
