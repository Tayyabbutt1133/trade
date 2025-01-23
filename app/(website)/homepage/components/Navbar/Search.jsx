"use client"

import { Button } from "@/components/ui/button"
import { fonts } from "@/components/ui/font";
import { Input } from "@/components/ui/input"
import { IoSearchSharp } from "react-icons/io5";

export default function SearchBar() {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="Search the marketplace"
        className={`w-full ${fonts.montserrat} h-10 pl-4 pr-12 text-base bg-white rounded-full  border-gray-200 focus-visible:ring-teal-500`}
      />
      <Button
        size="icon"
        className="absolute right-1 top-1 h-8 w-8 rounded-full bg-[#060E1BCC] hover:bg-teal-600"
      >
        <IoSearchSharp className="h-5 w-5 text-white" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}
