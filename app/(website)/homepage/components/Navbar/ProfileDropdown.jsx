"use client";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { FaSignOutAlt } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { fonts } from "@/components/ui/font";
import Link from "next/link";
import { GETPROFILE } from "@/app/actions/getprofiledata";

// Memoized dropdown menu component to prevent unnecessary re-renders
const DropdownMenu = memo(
  ({
    isOpen,
    portalElement,
    dropdownRef,
    dropdownPosition,
    isusertype,
    handleLogout,
  }) => {
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
        {/* Only render View Profile when user is not admin */}
        {isusertype !== "admin" && (
          <Link href={"/dashboard/profile/"}>
            <li
              className={`py-2 ${fonts.montserrat} hover:scale-95 transition px-3 flex items-center gap-2 hover:bg-slate-100 text-slate-800 text-sm cursor-pointer`}
            >
              <CgProfile />
              View Profile
            </li>
          </Link>
        )}
        <li
          className={`py-2 ${fonts.montserrat} px-3 hover:scale-95 transition flex items-center gap-2 hover:bg-slate-100 text-slate-800 text-sm cursor-pointer`}
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          Sign out
        </li>
      </ul>,
      portalElement
    );
  }
);

// Ensure displayName is set for React DevTools
DropdownMenu.displayName = "DropdownMenu";

const ProfileDropdown = memo(({ webcode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    right: 0,
  });
  const [portalElement, setPortalElement] = useState(null);
  const [isusertype, setIsUserType] = useState("");

  // Memoize logout handler to prevent recreation on each render
  const handleLogout = useCallback(async () => {
    try {
      // Send request to logout API endpoint
      await fetch("/api/auth/user", { method: "DELETE" });
      // Redirect to current page to refresh state
      window.location.href = window.location.pathname;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, []);

  // Memoize toggle function to prevent recreation on each render
  const toggleDropdown = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  // Setup portal element on mount
  useEffect(() => {
    setPortalElement(document.body);
  }, []);

  // Update dropdown position when button ref is available
  useEffect(() => {
    if (!buttonRef.current || !isOpen) return;

    const updatePosition = () => {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        right: window.innerWidth - rect.right,
      });
    };

    updatePosition();

    // Add resize listener to handle window resizing
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  // Implementing user type check for conditional rendering of UI
  useEffect(() => {
    if (!webcode) return;

    const checkType = async () => {
      try {
        const userData_response = await GETPROFILE(webcode);
        const userType = userData_response?.type?.toLowerCase();

        if (userType) {
          setIsUserType(userType);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkType();
  }, [webcode]);

  return (
    <div className="relative">
      <div
        ref={buttonRef}
        className="flex items-center gap-2 justify-center rounded-full text-white text-sm font-medium outline-none cursor-pointer"
        onClick={toggleDropdown}
      >
        <CgProfile size={20} />
        <IoIosArrowDown size={20} />
      </div>
      <DropdownMenu
        isOpen={isOpen}
        portalElement={portalElement}
        dropdownRef={dropdownRef}
        dropdownPosition={dropdownPosition}
        isusertype={isusertype}
        handleLogout={handleLogout}
      />
    </div>
  );
});

// Ensure displayName is set for React DevTools
ProfileDropdown.displayName = "ProfileDropdown";

export default ProfileDropdown;
