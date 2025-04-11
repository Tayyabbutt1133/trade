"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fonts } from "@/components/ui/font";
import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import { usePathname } from "next/navigation";

export default function SearchBar() {
  const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleInputChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearch = () => {
    if (search.trim() !== "") {
      setIsLoading(true);
      const capitalizedSearch =
        search.charAt(0).toUpperCase() + search.slice(1).toLowerCase();
      router.push(`/search/${encodeURIComponent(capitalizedSearch)}`);
      setSearch("");
    }
  };

  // Listen for "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  return (
    <div className="relative">
      {isloading && <RouteTransitionLoader />}
      <Input
        type="text"
        placeholder="Search the marketplace"
        value={search}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={`w-full ${fonts.montserrat} h-10 pl-4 pr-12 text-base bg-white rounded-full border-gray-200 focus-visible:ring-teal-500`}
      />
      <Button
        size="icon"
        onClick={handleSearch}
        className="absolute right-1 top-1 h-8 w-8 rounded-full bg-[#060E1BCC] hover:bg-teal-600"
      >
        <IoSearchSharp className="h-5 w-5 text-white" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}
