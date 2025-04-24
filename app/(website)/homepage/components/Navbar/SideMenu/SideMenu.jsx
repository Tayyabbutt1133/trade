"use client";

import React, { useState, useEffect, useRef } from "react";
import { IoClose, IoAdd } from "react-icons/io5";
import { MdChevronRight, MdArrowBack, MdExpandMore } from "react-icons/md";
import { fonts } from "@/components/ui/font";
import Link from "next/link";

// Helper to create URL-friendly strings
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function SideMenu({ onclose }) {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);

  // Navigation path tracks our current nested level
  const [navigationPath, setNavigationPath] = useState([{ level: "main" }]);

  // Expanded root items (Chemicals or Equipment)
  const [expandedItems, setExpandedItems] = useState({
    Chemicals: false,
    Equipment: false,
  });

  // API data
  const [recordsData, setRecordsData] = useState({});
  const [equipmentsData, setEquipmentsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentDataSource, setCurrentDataSource] = useState(""); // 'records' or 'equipments'

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/menu/"
        );
        const json = await res.json();
        const records = json.Records || [];
        const equipments = json.Equipments || [];

        // console.log("Records data:", records);
        // console.log("Equipment data:", equipments);

        if (records.length > 0) {
          setRecordsData(records[0]);
        }

        if (equipments.length > 0) {
          setEquipmentsData(equipments[0]);
        }
      } catch (error) {
        console.error("Error fetching side menu data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Trigger sidebar entrance and detect outside clicks
  useEffect(() => {
    setIsVisible(true);
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smoothly close the sidebar
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onclose();
    }, 300);
  };

  // Toggle dropdown for root items (Chemicals or Equipment)
  const toggleDropdown = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));

    // Set the current data source based on the selected item
    if (item === "Chemicals") {
      setCurrentDataSource("records");
    } else if (item === "Equipment") {
      setCurrentDataSource("equipments");
    }
  };

  // Handle navigation for deeper levels (after the root dropdown)
  const handleNavigation = (item, dataSource) => {
    const currentLevel = navigationPath[navigationPath.length - 1].level;

    if (currentLevel === "main") {
      // This now represents navigating to a category from the expanded dropdown
      setCurrentDataSource(dataSource);
      setNavigationPath([
        { level: "main" },
        {
          level: "category",
          id: item.id,
          title: item.label,
          dataSource: dataSource === "records" ? "Chemicals" : "Equipment",
        },
      ]);
    } else if (currentLevel === "category") {
      // Going from category to subcategory
      setNavigationPath([
        ...navigationPath,
        { level: "subcategory", id: item.id, title: item.label },
      ]);
    }
  };

  // Go back one level
  const handleBack = () => {
    if (navigationPath.length > 1) {
      const newPath = navigationPath.slice(0, -1);
      setNavigationPath(newPath);

      // Reset currentDataSource if going back to main menu
      if (newPath.length === 1) {
        setCurrentDataSource("");
      }
    }
  };

  // Get the current active data based on the selected data source
  const getCurrentData = () => {
    return currentDataSource === "records"
      ? recordsData
      : currentDataSource === "equipments"
      ? equipmentsData
      : {};
  };

  // Get categories from the selected data source
  const getCategoriesFromSource = (dataSource) => {
    const data = dataSource === "records" ? recordsData : equipmentsData;
    return Object.keys(data).map((cat) => ({
      id: cat,
      label: cat,
    }));
  };

  // Returns the list of items for a given page index
  const getViewAtIndex = (index) => {
    // First level - Root categories (only used for rendering)
    if (index === 0) {
      return [
        { id: "Chemicals", label: "Chemicals" },
        { id: "Equipment", label: "Equipment" },
      ];
    }

    // Category level (first slide after main)
    if (index === 1) {
      const activeData = getCurrentData();
      const mainCategory = navigationPath[1]?.id;
      const categoryData = activeData[mainCategory];

      if (
        Array.isArray(categoryData) &&
        categoryData.length > 0 &&
        typeof categoryData[0] === "object"
      ) {
        return Object.keys(categoryData[0]).map((key) => ({
          id: key,
          label: key,
        }));
      }
      return [];
    }

    // Subcategory level (items within selected subcategory)
    if (index === 2) {
      const activeData = getCurrentData();
      const mainCategory = navigationPath[1]?.id;
      const subCategory = navigationPath[2]?.id;
      const categoryData = activeData[mainCategory];

      if (
        Array.isArray(categoryData) &&
        categoryData.length > 0 &&
        typeof categoryData[0] === "object" &&
        Array.isArray(categoryData[0][subCategory])
      ) {
        const subItems = categoryData[0][subCategory] || [];
        return subItems.map((item) => ({
          id: slugify(item),
          label: item,
        }));
      }
      return [];
    }

    return [];
  };

  // Check if a specific item is "No Record" and if we're in equipments data
  const isNoRecordInEquipment = (item) => {
    return currentDataSource === "equipments" && item.label === "No Record";
  };

  // Render the root level with dropdowns
  const renderRootLevel = () => {
    const rootItems = [
      { id: "Chemicals", label: "Chemicals", dataSource: "records" },
      { id: "Equipment", label: "Equipment", dataSource: "equipments" },
    ];

    return (
      <div className="space-y-1">
        {rootItems.map((item) => (
          <div key={item.id} className="mb-2">
            <div className="flex items-center justify-between w-full py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
              <Link href={``} onClick={handleClose} className="flex-grow">
                <span className={`${fonts.montserrat} text-black font-medium`}>
                  {item.label}
                </span>
              </Link>
              <button
                onClick={() => toggleDropdown(item.id)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label={`Toggle ${item.label} dropdown`}
              >
                {expandedItems[item.id] ? (
                  <MdExpandMore size={20} className="text-gray-600" />
                ) : (
                  <IoAdd size={20} className="text-gray-600" />
                )}
              </button>
            </div>

            {/* Dropdown content */}
            {expandedItems[item.id] && (
              <div className="ml-4 pl-4 border-l border-gray-200 mt-1 space-y-1 transition-all duration-300 ease-in-out">
                {isLoading ? (
                  <div className="py-2 text-gray-500">Loading...</div>
                ) : (
                  getCategoriesFromSource(item.dataSource).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between w-full py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Link
                        href={`/${encodeURIComponent(category.id)}`}
                        onClick={handleClose}
                        className="flex-grow"
                      >
                        <span className={`${fonts.montserrat} text-black`}>
                          {category.label}
                        </span>
                      </Link>
                      <button
                        onClick={() =>
                          handleNavigation(category, item.dataSource)
                        }
                        className="p-1"
                      >
                        <MdChevronRight size={18} className="text-gray-400" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Renders the deeper level pages (categories, subcategories)
  const renderDeeperPages = (pageIndex) => {
    const items = getViewAtIndex(pageIndex);
    const level = navigationPath[pageIndex]?.level;
    const dataSource = navigationPath[1]?.dataSource || "";

    if (isLoading) {
      return (
        <div className="py-4 text-center text-gray-500">
          Loading menu items...
        </div>
      );
    }

    if (items.length === 0 && !isLoading) {
      return (
        <div className="py-4 text-center text-gray-500">No items found</div>
      );
    }

    // Category level
    if (level === "category") {
      return (
        <div className="space-y-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between w-full py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Link
                href={`/${encodeURIComponent(
                  navigationPath[1].id
                )}/${encodeURIComponent(item.id)}`}
                onClick={handleClose}
              >
                <span className={`${fonts.montserrat} text-black font-medium`}>
                  {item.label}
                </span>
              </Link>
              <button onClick={() => handleNavigation(item)} className="p-2">
                <MdChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      );
    }

    // Subcategory level
    if (level === "subcategory") {
      const category = navigationPath[1]?.id;
      const subcategory = navigationPath[2]?.id;
      return (
        <div className="space-y-1">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${encodeURIComponent(category)}/${encodeURIComponent(
                subcategory
              )}/${encodeURIComponent(item.label)}`}
              className="block py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={handleClose}
            >
              <span className={`${fonts.montserrat} text-black font-medium`}>
                {currentDataSource === "equipments" &&
                item.label === "No Record" ? (
                  <em className="text-amber-600">
                    This website is in development and data uploading stage
                  </em>
                ) : (
                  item.label
                )}
              </span>
            </Link>
          ))}
        </div>
      );
    }

    return null;
  };

  // Render all pages in a sliding container
  const renderPages = () => {
    // Always render the root level with dropdowns
    if (navigationPath.length === 1) {
      return renderRootLevel();
    }

    // For deeper levels, use sliding pages
    const pages = [];
    for (let i = 1; i < navigationPath.length; i++) {
      pages.push(
        <div key={i} className="w-full flex-shrink-0">
          {renderDeeperPages(i)}
        </div>
      );
    }

    return (
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${(navigationPath.length - 2) * 100}%)`,
          }}
        >
          {pages}
        </div>
      </div>
    );
  };

  // Breadcrumb header with clickable links for each level
  const renderBreadcrumbs = () => {
    const crumbs = [];

    // If we're in a deeper level, include data source
    if (navigationPath.length > 1) {
      const dataSource = navigationPath[1]?.dataSource;
      if (dataSource) {
        crumbs.push(
          <span key="sep0" className="mx-1">
            /
          </span>
        );
        crumbs.push(
          <span key="datasource" className={`${fonts.montserrat}`}>
            <Link href={`/${encodeURIComponent(dataSource)}`}>
              {dataSource}
            </Link>
          </span>
        );
      }

      // Add each navigation level to breadcrumbs
      for (let i = 1; i < navigationPath.length; i++) {
        crumbs.push(
          <span key={`sep${i}`} className="mx-1">
            /
          </span>
        );

        // Build URL based on all previous levels
        let url = "";
        if (dataSource) {
          url += `/${encodeURIComponent(dataSource)}`;
        }
        for (let j = 1; j <= i; j++) {
          url += `/${encodeURIComponent(navigationPath[j].id)}`;
        }

        crumbs.push(
          <span key={`level${i}`} className={`${fonts.montserrat}`}>
            <Link href={url}>{navigationPath[i].title}</Link>
          </span>
        );
      }
    }

    return <nav className="text-sm font-medium text-gray-500">{crumbs}</nav>;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isVisible ? "opacity-50" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Side menu */}
      <div
        ref={menuRef}
        className={`fixed z-20 inset-y-0 left-0 top-9 w-[300px] sm:w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-4">
            {navigationPath.length > 1 && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-gray-100 rounded-full"
                aria-label="Go back"
              >
                <MdArrowBack size={24} className="text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close menu"
          >
            <IoClose size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="mb-4">{renderBreadcrumbs()}</div>
          {renderPages()}
        </div>
      </div>
    </>
  );
}
