"use client";
import { CALLFILTER } from "@/app/actions/callTopfilters";
import React, { useState, useEffect, useRef } from "react";
import { ChartNoAxesCombined, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { fonts } from "@/components/ui/font";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import ProductsGrid from "./ProductsGrid";

const TopCategoryFilter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState({});
  const [mainDropdownOpen, setMainDropdownOpen] = useState(false);
  const [selectedTopCategory, setSelectedTopCategory] = useState(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState(null);
  const [subCategoriesOpen, setSubCategoriesOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [totalSubCategories, setTotalSubCategories] = useState(0);
  const [showProductGrid, setShowProductGrid] = useState(false);

  const mainDropdownRef = useRef();
  const subDropdownRef = useRef();

  // Get top level categories (catid)
  const topCategories = Object.keys(categories);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CALLFILTER();
        const data = response.data[0];
        setCategories(data);
        console.log("Fetched category data:", data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle top category selection
  const handleTopCategoryClick = (topCategory) => {
    setSelectedTopCategory(topCategory);
    setSelectedMainCategory(null);
    setSelectedSubCategory(null);
    setSubCategoriesOpen(false);
    setMainDropdownOpen(false);
    setShowProductGrid(false);

    // Get main categories for this top category
    const topCategoryData = categories[topCategory];

    if (topCategoryData && Array.isArray(topCategoryData)) {
      // Extract all unique main category names from the array
      const uniqueMainCategories = new Set();

      topCategoryData.forEach((item) => {
        // Each item in the array should be an object with a single key
        // that represents the main category name
        const mainCategoryNames = Object.keys(item);
        mainCategoryNames.forEach((name) => uniqueMainCategories.add(name));
      });

      setMainCategories(Array.from(uniqueMainCategories));
      console.log(
        "Main categories for",
        topCategory,
        ":",
        Array.from(uniqueMainCategories)
      );

      // Count total subcategories across all main categories in this top category
      let totalCount = 0;
      topCategoryData.forEach((item) => {
        const mainCatName = Object.keys(item)[0];
        if (Array.isArray(item[mainCatName])) {
          totalCount += item[mainCatName].length;
        }
      });
      setTotalSubCategories(totalCount);
      console.log("Total subcategories in", topCategory, ":", totalCount);
    }
  };

  // Handle main category selection
  const handleMainCategoryClick = (mainCategory) => {
    // Close the main dropdown when an option is selected
    setMainDropdownOpen(false);

    if (selectedMainCategory === mainCategory) {
      setSelectedMainCategory(null);
      setSubCategoriesOpen(false);
      setSelectedSubCategory(null);
      setShowProductGrid(false);
    } else {
      setSelectedMainCategory(mainCategory);
      setSelectedSubCategory(null);
      setShowProductGrid(false);

      // Find subcategories for this main category
      const topCategoryData = categories[selectedTopCategory];

      if (topCategoryData && Array.isArray(topCategoryData)) {
        // Find all objects that have the selected main category as a key
        const relevantObjects = topCategoryData.filter((item) =>
          Object.keys(item).includes(mainCategory)
        );

        // Combine all subcategories from these objects
        let allSubCategories = [];
        relevantObjects.forEach((obj) => {
          if (Array.isArray(obj[mainCategory])) {
            allSubCategories = [...allSubCategories, ...obj[mainCategory]];
          }
        });

        // Remove duplicates
        const uniqueSubCategories = [...new Set(allSubCategories)];

        setSubCategories(uniqueSubCategories);

        // Update subcategory count for this specific main category
        setTotalSubCategories(uniqueSubCategories.length);
        console.log(
          "Number of subcategories in",
          mainCategory,
          ":",
          uniqueSubCategories.length
        );

        console.log(
          "Subcategories for",
          mainCategory,
          ":",
          uniqueSubCategories
        );
      }
    }
  };

  // Handle subcategory selection
  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);
    setSubCategoriesOpen(false); // Close subcategories dropdown after selection
    setShowProductGrid(true);
  };

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutsideMain = (event) => {
      if (
        mainDropdownRef.current &&
        !mainDropdownRef.current.contains(event.target)
      ) {
        setMainDropdownOpen(false);
      }
    };

    const handleClickOutsideSub = (event) => {
      if (
        subDropdownRef.current &&
        !subDropdownRef.current.contains(event.target)
      ) {
        setSubCategoriesOpen(false);
      }
    };

    if (mainDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutsideMain);
    }

    if (subCategoriesOpen) {
      document.addEventListener("mousedown", handleClickOutsideSub);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutsideMain);
      document.removeEventListener("mousedown", handleClickOutsideSub);
    };
  }, [mainDropdownOpen, subCategoriesOpen]);

  // Toggle main dropdown
  const toggleMainDropdown = () => {
    setMainDropdownOpen(!mainDropdownOpen);
    if (mainDropdownOpen === false) {
      setSubCategoriesOpen(false);
    }
  };

  // Toggle subcategories dropdown
  const toggleSubDropdown = () => {
    setSubCategoriesOpen(!subCategoriesOpen);
    if (subCategoriesOpen === false) {
      setMainDropdownOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <RouteTransitionLoader />
      </div>
    );
  }

  return (
    <>
      {/* Browse our top categories */}
      <div>
        <h1 className={`text-3xl font-bold ${fonts.montserrat}`}>
          Browse Categories
        </h1>
        <div className="flex flex-wrap gap-3 mt-6">
          {topCategories.map((topCategory) => (
            <div key={topCategory}>
              <button
                onClick={() => handleTopCategoryClick(topCategory)}
                className={`cursor-pointer inline-flex items-center px-4 py-2 rounded-full border border-gray-200 font-serif bg-white hover:bg-gray-50 transition-colors text-sm whitespace-nowrap
                  ${
                    selectedTopCategory === topCategory
                      ? "bg-blue-50 border-blue-300"
                      : ""
                  }`}
              >
                <ChartNoAxesCombined className="w-4 h-4 mr-2" />
                {topCategory}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Display all three dropdowns together */}
      <div className="mt-10">
        <h1 className={`text-3xl font-bold ${fonts.montserrat}`}>
          Refine your Search
          {selectedTopCategory && ` with ${selectedTopCategory}`}
        </h1>
        <div className="mt-6 flex flex-wrap gap-4">
          {/* Main categories dropdown - always visible */}
          <div className="relative" ref={mainDropdownRef}>
            <button
              onClick={toggleMainDropdown}
              className={`inline-flex items-center justify-between px-4 py-2 rounded-md border transition-colors text-sm font-medium gap-2 w-64
                ${
                  selectedMainCategory
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              disabled={!selectedTopCategory}
            >
              <div className="flex gap-2">
                <span className={fonts.montserrat}>
                  {selectedMainCategory
                    ? selectedMainCategory
                    : selectedTopCategory
                    ? `Browse ${selectedTopCategory}`
                    : "Select a category first"}
                </span>
              </div>
              {selectedTopCategory && (
                <>
                  {mainDropdownOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </>
              )}
            </button>

            {/* Main dropdown menu */}
            {mainDropdownOpen && selectedTopCategory && (
              <div className="mt-2 rounded-md shadow-lg w-64 bg-white ring-1 ring-black ring-opacity-5 z-30 absolute animate-fadeIn">
                <div className="p-2 max-h-96 overflow-y-auto">
                  {mainCategories.length > 0 ? (
                    mainCategories.map((mainCategory, index) => (
                      <div key={`main-${index}`} className="mb-2">
                        <button
                          onClick={() => handleMainCategoryClick(mainCategory)}
                          className={`flex justify-between w-full text-left px-3 py-2 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 rounded-md
                            ${
                              selectedMainCategory === mainCategory
                                ? "bg-blue-50 text-blue-700"
                                : "text-gray-700"
                            }`}
                        >
                          <span className="capitalize">{mainCategory}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500">
                      No options available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Subcategories dropdown - always visible */}
          <div className="relative" ref={subDropdownRef}>
            <button
              onClick={toggleSubDropdown}
              className={`inline-flex items-center justify-between px-4 py-2 rounded-md border transition-colors text-sm font-medium gap-2 w-64
                ${
                  selectedSubCategory
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              disabled={!selectedMainCategory}
            >
              <span className={fonts.montserrat}>
                {selectedSubCategory
                  ? selectedSubCategory
                  : selectedMainCategory
                  ? `Select from ${subCategories.length} items`
                  : "Select a subcategory"}
              </span>
              {selectedMainCategory && (
                <>
                  {subCategoriesOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </>
              )}
            </button>

            {/* Subcategories dropdown menu */}
            {subCategoriesOpen && selectedMainCategory && (
              <div className="mt-2 rounded-md shadow-lg w-64 bg-white ring-1 ring-black ring-opacity-5 z-20 absolute animate-fadeIn">
                <div className="p-2 max-h-96 overflow-y-auto">
                  {subCategories.length > 0 ? (
                    subCategories.map((subCategory, index) => (
                      <button
                        key={`sub-${index}`}
                        onClick={() => handleSubCategoryClick(subCategory)}
                        className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 hover:text-gray-900 rounded-md
                          ${
                            selectedSubCategory === subCategory
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-700"
                          }`}
                      >
                        {subCategory}
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500">
                      No subcategories available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ProductsGrid - only shown when all three layers are selected */}
      {showProductGrid &&
        selectedTopCategory &&
        selectedMainCategory &&
        selectedSubCategory && (
          <div className="mt-10">
            <ProductsGrid
              catid={selectedTopCategory}
              maincatid={selectedMainCategory}
              subcatid={selectedSubCategory}
              totalProducts={totalSubCategories}
            />
          </div>
        )}
    </>
  );
};

export default TopCategoryFilter;
