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
    .replace(/[()]/g, "")       // Remove parentheses
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-")        // Remove consecutive dashes
    .replace(/^-|-$/g, "");     // Remove leading/trailing dashes
}

const MegaMenu = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  // We'll store the fetched data as an object with keys as main categories
  const [categories, setCategories] = useState({});
  const menuRef = useRef(null);

  // Fetch API data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/menu/"
        );
        const json = await res.json();
        const records = json.Records || [];
        if (records.length > 0) {
          // The API response contains an object of categories in the first element.
          setCategories(records[0]);
        }
      } catch (error) {
        console.error("Error fetching mega menu data:", error);
      }
    };

    fetchData();
  }, []);

  // Trigger entrance animation and handle click outside
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
        {/* Added max-h and overflow-y-auto so the menu scrolls if it's too tall */}
        <div className="container mx-auto p-6 max-h-[80vh] overflow-y-auto">
          {/* Close Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <IoClose size={24} />
            </button>
          </div>

          {/* Main Categories & Their Subcategories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {Object.keys(categories).map((mainCat, index) => {
              // Slugify the main category name
              const categorySlug = slugify(mainCat);
              // Get the array of subcategory objects
              const subcategories = categories[mainCat];

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
                  {/* Main Category heading (clickable) */}
                  <Link
                    href={`/${categorySlug}`}
                    onClick={handleClose}
                    className={`text-lg font-medium text-gray-800 hover:text-blue-600 transition-colors duration-200 ${fonts.montserrat}`}
                  >
                    {mainCat.trim()}
                  </Link>

                  {/* Map over subcategories */}
                  <ul className="mt-2 space-y-2 ml-2">
                    {subcategories.map((item, subIndex) => {
                      // Slugify subcategory name
                      const subSlug = slugify(item.subcategory);
                      return (
                        <li
                          key={subIndex}
                          style={{
                            transitionDelay: `${index * 50 + subIndex * 30}ms`,
                          }}
                        >
                          <Link
                            href={`/${categorySlug}/${subSlug}`}
                            className={`text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 ${fonts.montserrat}`}
                            onClick={handleClose}
                          >
                            {item.subcategory}
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
