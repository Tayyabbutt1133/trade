"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { MdChevronRight, MdArrowBack } from "react-icons/md";
import { fonts } from "@/components/ui/font";
import Link from 'next/link';

// 1. Slugify function (optional, if you need it elsewhere)
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")       // Replace spaces with -
    .replace(/[()]/g, "")       // Remove parentheses
    .replace(/[^a-z0-9-]/g, "") // Remove special characters
    .replace(/-+/g, "-")        // Replace consecutive dashes
    .replace(/^-|-$/g, "");     // Remove leading/trailing dashes
}

export default function SideMenu({ onclose }) {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  
  // navigationPath controls the current level in the nested menu.
  // Initial level is 'main'.
  const [navigationPath, setNavigationPath] = useState([{ level: 'main' }]);

  // categoriesData will store our API data.
  // The API is assumed to return an object inside "Records" where
  // keys are main categories and values are arrays of subcategory objects.
  const [categoriesData, setCategoriesData] = useState({});

  // Fetch API data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/menu/");
        const json = await res.json();
        const records = json.Records || [];
        if (records.length > 0) {
          // We assume the first element contains our categories data
          setCategoriesData(records[0]);
        }
      } catch (error) {
        console.error("Error fetching side menu data:", error);
      }
    };

    fetchData();
  }, []);

  // Handle click outside and trigger entrance animation
  useEffect(() => {
    setIsVisible(true);
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onclose();
    }, 300);
  };

  // getCurrentView returns the items to render based on the current navigation level.
  const getCurrentView = () => {
    const currentNav = navigationPath[navigationPath.length - 1];

    if (currentNav.level === 'main') {
      // For main level, return an array of objects representing main categories.
      // Each object: { id, label } where both are the main category name.
      return Object.keys(categoriesData).map(cat => ({ id: cat, label: cat }));
    }

    if (currentNav.level === 'category') {
      // For category level, currentNav.id is the main category name.
      // Return the array of subcategory objects.
      return categoriesData[currentNav.id] || [];
    }

    return [];
  };

  const handleNavigation = (item) => {
    const currentLevel = navigationPath[navigationPath.length - 1].level;

    if (currentLevel === 'main') {
      setNavigationPath([
        ...navigationPath,
        {
          level: 'category',
          id: item.id,
          title: item.label
        }
      ]);
    }
  };

  const handleBack = () => {
    if (navigationPath.length > 1) {
      setNavigationPath(navigationPath.slice(0, -1));
    }
  };

  const renderContent = () => {
    const currentView = getCurrentView();
    const currentLevel = navigationPath[navigationPath.length - 1].level;

    return (
      <div className="space-y-1">
        {currentView.map((item, index) => {
          if (currentLevel === 'main') {
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className="flex items-center justify-between w-full py-3 px-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`${fonts.montserrat} text-black font-medium`}>{item.label}</span>
                </div>
                <MdChevronRight size={20} className="text-gray-400" />
              </button>
            );
          } else if (currentLevel === 'category') {
            // When at category level, we show a Link without an arrow.
            // We use encodeURIComponent to build the URL so that the original text is preserved.
            return (
              <Link
                key={item.subcategory}
                href={`/${encodeURIComponent(navigationPath[1].id)}/${encodeURIComponent(item.subcategory)}`}
                className="block py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={handleClose}
              >
                <span className={`${fonts.montserrat} text-black font-medium`}>{item.subcategory}</span>
              </Link>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-50' : 'opacity-0'}`}
        onClick={handleClose}
      />
      
      <div 
        ref={menuRef}
        className={`fixed z-20 inset-y-0 left-0 w-[300px] sm:w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            {navigationPath.length > 1 && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <MdArrowBack size={24} className="text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <IoClose size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {/* Conditional Heading */}
          <div className="mb-4">
            {navigationPath[navigationPath.length - 1].level === 'main' ? (
              <h1 className={`${fonts.montserrat} text-black text-xl font-bold`}>Categories</h1>
            ) : (
              <h1 className={`${fonts.montserrat} text-black text-xl font-bold`}>
                {navigationPath[navigationPath.length - 1].title}
              </h1>
            )}
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}
