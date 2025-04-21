import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { createPortal } from "react-dom";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const [portalElement, setPortalElement] = useState(null);

  // Function to handle logout
  const handleLogout = async () => {
    try {
      // Send request to logout API endpoint
      await fetch("/api/auth/user", { method: "DELETE" });
      // Redirect to current page to refresh state
      window.location.href = window.location.pathname;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Setup portal element on mount
  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  // Update dropdown position when button ref is available
  useEffect(() => {
    if (buttonRef.current && isOpen) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Dropdown component to be rendered in portal
  const DropdownMenu = () => {
    if (!isOpen || !portalElement) return null;

    return createPortal(
      <ul
        ref={dropdownRef}
        className="fixed shadow-md bg-white py-1 w-40 rounded-md max-h-96 overflow-auto"
        style={{
          top: `${dropdownPosition.top}px`,
          right: `${dropdownPosition.right}px`,
          zIndex: 9999,
        }}
      >
        <li
          className="py-2 px-3 flex items-center hover:bg-slate-100 text-slate-800 text-sm cursor-pointer"
          onClick={handleLogout}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-4 h-4 mr-2.5"
            viewBox="0 0 6.35 6.35"
          >
            <path
              d="M3.172.53a.265.266 0 0 0-.262.268v2.127a.265.266 0 0 0 .53 0V.798A.265.266 0 0 0 3.172.53zm1.544.532a.265.266 0 0 0-.026 0 .265.266 0 0 0-.147.47c.459.391.749.973.749 1.626 0 1.18-.944 2.131-2.116 2.131A2.12 2.12 0 0 1 1.06 3.16c0-.65.286-1.228.74-1.62a.265.266 0 1 0-.344-.404A2.667 2.667 0 0 0 .53 3.158a2.66 2.66 0 0 0 2.647 2.663a2.657 2.657 0 0 0 2.645-2.663c0-.812-.363-1.542-.936-2.03a.265.266 0 0 0-.17-.066z"
              data-original="#000000"
            ></path>
          </svg>
          Logout
        </li>
      </ul>,
      portalElement
    );
  };

  return (
    <div className="relative">
      <div
        ref={buttonRef}
        className="flex items-center rounded-full text-white text-sm font-medium outline-none cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CgProfile size={20} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-3 fill-white inline ml-2"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
            clipRule="evenodd"
            data-original="#000000"
          />
        </svg>
      </div>
      <DropdownMenu />
    </div>
  );
};

export default ProfileDropdown;
