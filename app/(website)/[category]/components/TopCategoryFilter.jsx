"use client";
import { CALLFILTER } from "@/app/actions/callTopfilters";
import React, { useState, useEffect, useRef } from "react";
import { ChartNoAxesCombined, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { fonts } from "@/components/ui/font";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

const TopCategoryFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [topCategories, setTopCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownref = useRef();

  // Fisher–Yates shuffle
  const shuffleArray = (array) => {
    const shuffled = [...array]; // clone array to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CALLFILTER();
        const get_response_object = response.data[0];
        // Extract top-level categories and shuffle them
        setTopCategories(shuffleArray(Object.entries(get_response_object)));
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSelectedCategory(null);
    }
  };

  const selectCategory = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownref.current && !dropdownref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup on unmount or when dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (isLoading) {
    return <div><RouteTransitionLoader/></div>;
  }

  return (
    <>
      {/* Browse our top categories */}
      <div>
        <h1 className={`text-3xl font-bold ${fonts.montserrat}`}>
          Browse Categories
        </h1>
        <div className="flex flex-wrap gap-3 mt-6">
          {topCategories.map(([topCategory]) => (
            <div key={topCategory}>
              <Link href={`/${topCategory}`}>
                <p className="cursor-pointer inline-flex items-center px-4 py-2 rounded-full border border-gray-200 font-serif bg-white hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
                  <ChartNoAxesCombined className="w-4 h-4 mr-2" />
                  {topCategory}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Browse our Main Categories - as a dropdown */}
      <div className="mt-10">
        <h1 className={`text-3xl font-bold ${fonts.montserrat}`}>
          Browse Main Categories
        </h1>
        <div className="mt-6" ref={dropdownref}>
          {/* Main dropdown button */}
          <button
            onClick={toggleDropdown}
            className="inline-flex items-center justify-between px-2 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm font-medium gap-2"
          >
            <div className="flex gap-2">
              <ChartNoAxesCombined className="w-4 h-4" />
              <span>Applications</span>
            </div>
            {isOpen ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Dropdown menu */}
          {isOpen && (
            <div className="mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10 relative">
              <div className="p-2 max-h-96 overflow-y-auto">
                {topCategories.map(([topCategory, secondLevelArray]) => (
                  <div key={topCategory} className="mb-2">
                    <button
                      onClick={() => selectCategory(topCategory)}
                      className="flex justify-between w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-md"
                    >
                      <span className="capitalize">{topCategory}</span>
                      {selectedCategory === topCategory ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    {selectedCategory === topCategory &&
                      Array.isArray(secondLevelArray) &&
                      secondLevelArray.length > 0 && (
                        <div className="pl-4 py-1">
                          {Object.keys(secondLevelArray[0]).map(
                            (subCategory) => (
                              <Link
                                key={`${topCategory}-${subCategory}`}
                                href={`/${topCategory}/${subCategory}`}
                              >
                                <div className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer rounded-md">
                                  <div className="flex items-center">
                                    <ChartNoAxesCombined className="w-3 h-3 mr-2" />
                                    {subCategory}
                                  </div>
                                </div>
                              </Link>
                            )
                          )}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TopCategoryFilter;
