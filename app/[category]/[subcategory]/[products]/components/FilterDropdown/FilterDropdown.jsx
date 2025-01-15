"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import FilterContent from './FilterContent'
import { filterOptions, productFamiliesData } from './FilterData'

export default function FilterDropdowns() {
  const [openPopover, setOpenPopover] = useState(null)

  return (
    <div className="flex gap-2 p-4">
      {filterOptions.map((option) => (
        <Popover 
          key={option.id}
          open={openPopover === option.id}
          onOpenChange={(isOpen) => setOpenPopover(isOpen ? option.id : null)}
        >
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white"
            >
              {option.label}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="p-0 bg-white" 
            align="start"
          >
            <FilterContent 
              data={productFamiliesData}
            />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}

