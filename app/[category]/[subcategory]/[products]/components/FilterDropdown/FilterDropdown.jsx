"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import FilterContent from "./FilterContent";
import { filterOptions, productFamiliesData } from "./FilterData";

import { useFilter } from "@/store/use-filter";
import Container from "@/components/container";

export default function FilterDropdowns({}) {
  const [openPopover, setOpenPopover] = useState(null);
  const onFilterOpen = useFilter(state => state.onFilterOpen);

  return (
    <div className="flex flex-wrap gap-2 p-4 ">
      {/* Open Filter Button */}
      <Button
        className="bg-teal-400 text-black hover:bg-teal-500 active:bg-teal-700 lg:hidden"
        onClick={onFilterOpen}
      >
        Filter
      </Button>
      {filterOptions.map((option) => (
        <Popover
          key={option.id}
          open={openPopover === option.id}
          onOpenChange={(isOpen) => setOpenPopover(isOpen ? option.id : null)}
        >
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white">
              {option.label}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 bg-white w-auto" align="start">
            <FilterContent data={productFamiliesData} />
          </PopoverContent>
        </Popover>
      ))}
      </div>
  );
}
