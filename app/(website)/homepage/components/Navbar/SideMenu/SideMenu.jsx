"use client";

import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { MdChevronRight, MdArrowBack } from "react-icons/md";
import { fonts } from "@/components/ui/font";
import Link from 'next/link';

// Helper to create URL-friendly strings.
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

  // navigationPath tracks our current nested level.
  // The initial level is 'main' (index 0). Then index 1 is a main category,
  // and index 2 is a subcategory.
  const [navigationPath, setNavigationPath] = useState([{ level: 'main' }]);

  // API data – expects the first element of Records to hold the categories.
  const [categoriesData, setCategoriesData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/menu/");
        const json = await res.json();
        const records = json.Records || [];
        if (records.length > 0) {
          setCategoriesData(records[0]);
        }
      } catch (error) {
        console.error("Error fetching side menu data:", error);
      }
    };

    fetchData();
  }, []);

  // Trigger sidebar entrance and detect outside clicks.
  useEffect(() => {
    setIsVisible(true);
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smoothly close the sidebar.
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onclose();
    }, 300);
  };

  // Only clicking on the arrow button pushes a new nested level.
  const handleNavigation = (item) => {
    const currentLevel = navigationPath[navigationPath.length - 1].level;
    if (currentLevel === 'main') {
      setNavigationPath([...navigationPath, { level: 'category', id: item.id, title: item.label }]);
    } else if (currentLevel === 'category') {
      setNavigationPath([...navigationPath, { level: 'subcategory', id: item.id, title: item.label }]);
    }
  };

  // Go back one level.
  const handleBack = () => {
    if (navigationPath.length > 1) {
      setNavigationPath(navigationPath.slice(0, -1));
    }
  };

  // Returns the list of items for a given page index.
  // Index 0: main view; 1: category view; 2: subcategory view.
  const getViewAtIndex = (index) => {
    if (index === 0) {
      return Object.keys(categoriesData).map(cat => ({ id: cat, label: cat }));
    }
    if (index === 1) {
      // navigationPath[1].id is the main category selected.
      const mainCategory = navigationPath[1]?.id;
      const mainData = categoriesData[mainCategory];
      if (Array.isArray(mainData) && mainData.length > 0 && typeof mainData[0] === 'object') {
        return Object.keys(mainData[0]).map(key => ({ id: key, label: key }));
      }
      return [];
    }
    if (index === 2) {
      const mainCategory = navigationPath[1]?.id;
      const subCategory = navigationPath[2]?.id;
      const mainData = categoriesData[mainCategory];
      if (Array.isArray(mainData) && mainData.length > 0 && typeof mainData[0] === 'object') {
        const subItems = mainData[0][subCategory] || [];
        return subItems.map(item => ({ id: slugify(item), label: item }));
      }
      return [];
    }
    return [];
  };

  // Renders the page for a given level.
  const renderPage = (pageIndex) => {
    const items = getViewAtIndex(pageIndex);
    // Determine level type.
    const level = pageIndex === 0 ? 'main' : pageIndex === 1 ? 'category' : 'subcategory';

    if (level === 'main') {
      return (
        <div className="space-y-1">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between w-full py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
              {/* Clicking the label links to the main category page and closes sidebar */}
              <Link href={`/${encodeURIComponent(item.id)}`} onClick={handleClose}>
                <span className={`${fonts.montserrat} text-black font-medium`}>{item.label}</span>
              </Link>
              {/* Only arrow click pushes into nested view */}
              <button onClick={() => handleNavigation(item)} className="p-2">
                <MdChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      );
    }
    if (level === 'category') {
      const mainCategory = navigationPath[1]?.id;
      return (
        <div className="space-y-1">
          {items.map(item => (
            <div key={item.id} className="flex items-center justify-between w-full py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
              <Link href={`/${encodeURIComponent(mainCategory)}/${encodeURIComponent(item.id)}`} onClick={handleClose}>
                <span className={`${fonts.montserrat} text-black font-medium`}>{item.label}</span>
              </Link>
              <button onClick={() => handleNavigation(item)} className="p-2">
                <MdChevronRight size={20} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      );
    }
    if (level === 'subcategory') {
      const mainCategory = navigationPath[1]?.id;
      const category = navigationPath[2]?.id;
      return (
        <div className="space-y-1">
          {items.map(item => (
            <Link
              key={item.id}
              href={`/${encodeURIComponent(mainCategory)}/${encodeURIComponent(category)}/${encodeURIComponent(item.label)}`}
              className="block py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={handleClose}
            >
              <span className={`${fonts.montserrat} text-black font-medium`}>{item.label}</span>
            </Link>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render all pages in a sliding container.
  const renderPages = () => {
    const pages = [];
    for (let i = 0; i < navigationPath.length; i++) {
      pages.push(
        <div key={i} className="w-full flex-shrink-0">
          {renderPage(i)}
        </div>
      );
    }
    return (
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${(navigationPath.length - 1) * 100}%)` }}
        >
          {pages}
        </div>
      </div>
    );
  };

  // Breadcrumb header with clickable links for each level.
  const renderBreadcrumbs = () => {
    const crumbs = [];
    // Root breadcrumb
    crumbs.push(
      <span key="all" className={`${fonts.montserrat}`}>
        <Link href="/">Categories</Link>
      </span>
    );
    // Second layer : subcategory
    if (navigationPath.length > 1) {
      crumbs.push(<span key="sep1" className="mx-1">/</span>);
      crumbs.push(
        <span className={`${fonts.montserrat}`} key="main">
          <Link href={`/${encodeURIComponent(navigationPath[1].id)}`}>
            {navigationPath[1].title}
          </Link>
        </span>
      );
    }
    // Third layer : product category
    if (navigationPath.length > 2) {
      crumbs.push(<span key="sep2" className="mx-1">/</span>);
      crumbs.push(
        <span key="sub" className={`${fonts.montserrat}`}>
          <Link href={`/${encodeURIComponent(navigationPath[1].id)}/${encodeURIComponent(navigationPath[2].id)}`}>
            {navigationPath[2].title}
          </Link>
        </span>
      );
    }
    return <nav className="text-sm font-medium text-gray-500">{crumbs}</nav>;
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
          <div className="mb-4">
            {renderBreadcrumbs()}
          </div>
          {renderPages()}
        </div>
      </div>
    </>
  );
}
