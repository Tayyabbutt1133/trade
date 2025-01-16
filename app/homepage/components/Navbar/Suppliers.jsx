"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fonts } from "@/components/ui/font";
import { IoChevronDown } from "react-icons/io5";


const Suppliers = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={`flex ${fonts.montserrat} items-center gap-1 text-white px-3 py-2 focus:outline-none text-sm`}
          >
            Trade for Suppliers
            <IoChevronDown className="h-4 w-4 opacity-50" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-[#1B2637] border-gray-700"
        >
          <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">
            Supplier Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">
            Analytics
          </DropdownMenuItem>
          <DropdownMenuItem className="text-gray-200 focus:text-white focus:bg-gray-700">
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Suppliers;
