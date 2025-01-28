"use client"

import { useState } from "react"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { CategoryFilters } from "./components/CategoryFilters"
import { columns, categories } from "./lib/categories"

export default function CategoryPage() {
  const [filteredData, setFilteredData] = useState(categories)

  const handleFilterChange = ({ search, parentCategory }) => {
    const filtered = categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description.toLowerCase().includes(search.toLowerCase())
      const matchesParent = parentCategory === "" || category.parentCategory === parentCategory
      return matchesSearch && matchesParent
    })
    setFilteredData(filtered)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Categories</h1>
        <Link href="/dashboard/categories/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Category
          </Button>
        </Link>
      </div>
      <CategoryFilters onFilterChange={handleFilterChange} />
      <DataTable columns={columns} data={filteredData} />
    </div>
  )
}

