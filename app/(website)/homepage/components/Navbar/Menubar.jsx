"use client";

import React, { useState, useEffect, useRef } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoChevronDown } from "react-icons/io5";
import { HiDotsHorizontal } from "react-icons/hi";
import SideMenu from "./SideMenu/SideMenu";
import { fonts } from "@/components/ui/font";
import MegaMenu from "./MegaMenu";
import Link from "next/link";
import Suppliers from "./Suppliers";

// (Optional) Slugify function if needed for other purposes.
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")     
    .replace(/&/g, "and")     
    .replace(/[^\w-]+/g, "")   
    .replace(/--+/g, "-")      
    .replace(/^-|-$/g, "");
}

export function Menubar() {
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [topCategories, setTopCategories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSideMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle MegaMenu open/close
  const handleMegaMenuToggle = () => {
    setActiveMegaMenu(activeMegaMenu ? null : "tradeCategories");
  };

  // Fetch top categories from API endpoint on mount
  useEffect(() => {
    async function fetchTopCategories() {
      try {
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/topcategories/",
          { cache: "no-cache" }
        );
        const data = await res.json();
        // Assuming data.Records is an array of objects with a "category" field.
        const categories = data.Records.map((record) => record.category);
        setTopCategories(categories);
      } catch (error) {
        console.error("Error fetching top categories", error);
      }
    }
    fetchTopCategories();
  }, []);

  // Close the dropdown if clicking outside of it
  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // Derive visible and extra categories
  const visibleCategories = topCategories.slice(0, 7);
  const extraCategories = topCategories.slice(7);

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
          {/* Show SideMenu if open */}
          {isMenuOpen && <SideMenu onclose={() => setIsMenuOpen(false)} />}
         
          {/* Mega menu handling */}
          {/* <button
            className="flex items-center gap-1 px-4 text-white py-2 focus:outline-none"
            onClick={handleMegaMenuToggle}
          >
            <p className={`text-[13px] font-semibold ${fonts.montserrat}`}>
              Trade Categories
            </p>
            <IoChevronDown className="h-4 w-4 opacity-50" />
          </button> */}

          {/* Render Top Categories */}
          <div className="relative flex items-center gap-1 ml-4">
            {visibleCategories.map((category, index) => (
              <Link
                key={index}
                href={`/topmenu/${encodeURIComponent(category)}`}
                className="text-white bg-[#404C4D] text-sm rounded-md px-3 py-1 hover:border-white"
              >
                <p className={`text-[12px] ${fonts.montserrat}`}>{category}</p>
              </Link>
            ))}
            {extraCategories.length > 0 && (
              <>
                <button
                  className="text-white p-2 focus:outline-none"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <HiDotsHorizontal className="h-6 w-6" />
                  <span className="sr-only">More options</span>
                </button>
                {showDropdown && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full mt-2 right-0 bg-[#404C4D] rounded-lg shadow-lg p-2 z-50"
                  >
                    {extraCategories.map((category, index) => (
                      <Link
                        key={index}
                        href={`/topmenu/${encodeURIComponent(category)}`}
                        className={`block ${fonts.montserrat} text-white text-sm rounded-2xl px-3 py-1 hover:bg-[#505C5D] mb-1`}
                        onClick={() => setShowDropdown(false)}
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Optionally include suppliers or other elements */}
        {/* <Suppliers /> */}
      </nav>

      {/* MegaMenu */}
      {activeMegaMenu && (
        <div className="absolute left-0 right-0 bg-white z-50">
          <MegaMenu onClose={() => setActiveMegaMenu(null)} />
        </div>
      )}
    </>
  );
}
