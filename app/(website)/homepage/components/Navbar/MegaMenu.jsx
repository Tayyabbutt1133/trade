"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";
import Link from "next/link";
import { fonts } from "@/components/ui/font";

// 1. Slugify function
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")       // Replace spaces with -
    .replace(/[()]/g, "")       // Remove parentheses if you don't want them
    .replace(/[^a-z0-9-]/g, "") // Remove other special characters
    .replace(/-+/g, "-")        // Remove consecutive dashes
    .replace(/^-|-$/g, "");     // Remove leading/trailing dashes
}

const MegaMenu = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [categories, setCategories] = useState({});
  const menuRef = useRef(null);

  // Fetch and group API data by category
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/menu/"
        );
        const json = await res.json();
        const records = json.Records || [];

        // Group subcategories under each category
        const grouped = {};
        records.forEach((record) => {
          const cat = record.category;
          const sub = record.subcategory;
          if (!grouped[cat]) {
            grouped[cat] = new Set();
          }
          grouped[cat].add(sub);
        });

        // Convert each set to an array
        const groupedArr = {};
        Object.keys(grouped).forEach((cat) => {
          groupedArr[cat] = Array.from(grouped[cat]);
        });

        setCategories(groupedArr);
      } catch (error) {
        console.error("Error fetching mega menu data:", error);
      }
    };

    fetchData();
  }, []);

  // Trigger entrance animation
  useEffect(() => {
    setIsVisible(true);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before closing
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-40" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* MegaMenu Container */}
      <div
        ref={menuRef}
        className={`fixed top-[64px] left-0 right-0 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
        }`}
      >
        <div className="container mx-auto p-6">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Categories & Subcategories in 4-column grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Object.keys(categories).map((category, index) => {
              // 2. Slugify the category
              const categorySlug = slugify(category);

              return (
                <div
                  key={index}
                  className="transform transition-all duration-300 ease-in-out"
                  style={{
                    transitionDelay: `${index * 50}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateY(0)"
                      : "translateY(10px)",
                  }}
                >
                  {/* Category heading (clickable) */}
                  <Link
                    href={`/${categorySlug}`}
                    onClick={handleClose}
                    className={`text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 ${fonts.montserrat}`}
                  >
                    {category}
                  </Link>

                  {/* Subcategories */}
                  <ul className="mt-2 space-y-2 ml-2">
                    {categories[category].map((sub, subIndex) => {
                      // 3. Slugify the subcategory
                      const subSlug = slugify(sub);
                      return (
                        <li
                          key={subIndex}
                          style={{
                            transitionDelay: `${
                              index * 50 + subIndex * 30
                            }ms`,
                          }}
                        >
                          <Link
                            href={`/${categorySlug}/${subSlug}`}
                            className={`text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 ${fonts.montserrat}`}
                            onClick={handleClose}
                          >
                            {sub}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;
