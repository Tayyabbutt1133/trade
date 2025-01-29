"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"



export function CategoryFilters({ onFilterChange }) {
  const [search, setSearch] = useState("")
  const [parentCategory, setParentCategory] = useState("")

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    onFilterChange({ search: e.target.value, parentCategory })
  }

  const handleParentCategoryChange = (value) => {
    setParentCategory(value)
    onFilterChange({ search, parentCategory: value })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="search" className="sr-only">
          Search categories
        </Label>
        <Input id="search" placeholder="Search categories..." value={search} onChange={handleSearchChange} />
      </div>
      <div className="w-full sm:w-[200px]">
        <Select value={parentCategory} onValueChange={handleParentCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Parent Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="Electronics">Electronics</SelectItem>
            <SelectItem value="Books">Books</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

