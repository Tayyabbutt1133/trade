import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { MdChevronRight, MdArrowBack } from "react-icons/md";
import { fonts } from "@/components/ui/font";
import { menuData } from '@/app/menudata';

export default function SideMenu({ onclose }) {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef(null);
  
  // Track navigation state with a single array
  const [navigationPath, setNavigationPath] = useState([{
    level: 'main',
    // title: 'Main Menu'
  }]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    // Trigger entrance animation on mount
    setIsVisible(true);

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle closing with animation
  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before calling onclose
    setTimeout(() => {
      onclose();
    }, 300); // Match this with CSS transition duration
  };

  const getCurrentView = () => {
    const currentNav = navigationPath[navigationPath.length - 1];
    
    if (currentNav.level === 'main') {
      return menuData.sidebar;
    }
    
    if (currentNav.level === 'category') {
      return menuData.megaMenu[currentNav.id].categories;
    }
    
    if (currentNav.level === 'subcategory') {
      const category = menuData.megaMenu[currentNav.categoryId].categories
        .find(cat => cat.title === currentNav.title);
      return category.items;
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
    } else if (currentLevel === 'category') {
      setNavigationPath([
        ...navigationPath,
        {
          level: 'subcategory',
          categoryId: navigationPath[navigationPath.length - 1].id,
          title: item.title
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
                  <span className="text-xl">{item.icon}</span>
                  <span className={`${fonts.montserrat} text-black font-medium`}>{item.label}</span>
                </div>
                <MdChevronRight size={20} className="text-gray-400" />
              </button>
            );
          } else if (currentLevel === 'category') {
            return (
              <button
                key={item.title}
                onClick={() => handleNavigation(item)}
                className="flex items-center justify-between w-full py-3 px-4 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className={`${fonts.montserrat} text-black font-medium`}>{item.title}</span>
                <MdChevronRight size={20} className="text-gray-400" />
              </button>
            );
          } else {
            return (
              // We need to set link here to route to product listing page
              <div
                key={item}
                className="py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span className={`${fonts.montserrat} font-medium text-black`}>{item}</span>
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />
      
      {/* Menu */}
      <div 
        ref={menuRef}
        className={`fixed z-20 inset-y-0 left-0 w-[300px] sm:w-[400px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
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

        <div className="p-6">
          <div className="mb-4">
            <h2 className={`text-lg ${fonts.montserrat} font-medium`}>
              {navigationPath[navigationPath.length - 1].title}
            </h2>
          </div>
          {renderContent()}
        </div>
      </div>
    </>
  );
}