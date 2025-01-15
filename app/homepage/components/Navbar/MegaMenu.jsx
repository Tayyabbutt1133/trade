import React, { useState, useEffect, useRef } from 'react';
import { IoChevronForward, IoClose } from 'react-icons/io5';
import { menuData } from '@/app/menudata';
import { fonts } from '@/components/ui/font';
import Link from 'next/link';

const Sidebar = ({ items, onHover, onClose }) => {
  return (
    <div className="w-72 my-4 bg-white border-r border-gray-200 overflow-y-auto overflow-hidden h-[400px]">
      {items.map((item) => (
        <Link href={`/${item.id}`} key={item.id} onClick={onClose}>
          <div
            onMouseEnter={() => onHover(item.id)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
          >
            <span className="text-xl">{item.icon}</span>
            <span className={`text-gray-800 ${fonts.montserrat} text-sm`}>
              {item.label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

const MegaMenu = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedSidebarId, setSelectedSidebarId] = useState(menuData.sidebar[0].id);
  const [menuContent, setMenuContent] = useState(menuData.megaMenu[selectedSidebarId]);
  const menuRef = useRef(null);

  useEffect(() => {
    setMenuContent(menuData.megaMenu[selectedSidebarId]);
  }, [selectedSidebarId]);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for animation to complete before closing
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleLinkClick = (e) => {
    handleClose();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
          isVisible ? 'opacity-40' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* MegaMenu */}
      <div 
        ref={menuRef} 
        className={`fixed top-[64px] left-0 right-0 bg-white shadow-lg z-50 transform transition-all duration-300 ease-in-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-4 opacity-0'
        }`}
      >
        <div className="container mx-auto flex">
          <Sidebar
            items={menuData.sidebar}
            onHover={(id) => setSelectedSidebarId(id)}
            onClose={handleClose}
          />
          
          <div className="flex-1 overflow-hidden">
            <div className="p-6 h-[400px] overflow-y-auto">
              <div className="flex justify-between items-center mb-8 bg-white">
                <h2 className={`text-2xl text-gray-800 ${fonts.montserrat} font-semibold`}>
                  {menuContent.title}
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <IoClose size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-y-8 pb-6">
                {menuContent.categories.map((category, index) => (
                  <div 
                    key={index} 
                    className="space-y-4 transform transition-all duration-300 ease-in-out"
                    style={{
                      transitionDelay: `${index * 50}ms`,
                      opacity: isVisible ? 1 : 0,
                      transform: isVisible 
                        ? 'translateY(0)' 
                        : 'translateY(10px)'
                    }}
                  >
                    <Link
                      href={`/${selectedSidebarId}/${category.title}`}
                      onClick={handleLinkClick}
                    >
                      <h3 className={`text-[15px] ${fonts.montserrat} font-medium hover:text-blue-600 transition-colors duration-200`}>
                        {category.title}
                      </h3>
                    </Link>
                    <ul className="space-y-3">
                      {category.items.map((item, itemIndex) => (
                        <li 
                          key={itemIndex}
                          style={{
                            transitionDelay: `${(index * 50) + (itemIndex * 30)}ms`
                          }}
                        >
                          <Link
                            href={`/${selectedSidebarId}/${category.title}/${item}`}
                            onClick={handleLinkClick}
                          >
                            <span className={`text-[13px] text-gray-500 hover:text-gray-800 transition-colors duration-200 ${fonts.montserrat}`}>
                              {item}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;