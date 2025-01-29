"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Simulated API call to fetch categories
const fetchCategories = async () => {
  // In a real application, this would be an API call
  return [
    { id: 1, name: "Electronics" },
    { id: 2, name: "Books" },
    { id: 3, name: "Clothing" },
  ]
}

export function CategoryForm() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parentId: "0", // Default value changed
  })
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories()
      setCategories(fetchedCategories)
    }
    loadCategories()
  }, [])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (value) => {
    setFormData((prev) => ({ ...prev, parentId: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Category form data:", formData)
    // Handle form submission logic here
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">
            Category Name <span className="text-red-500">*</span>
          </Label>
          <Input id="name" type="text" required onChange={handleInputChange} value={formData.name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Input id="description" type="text" onChange={handleInputChange} value={formData.description} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="parentId">Parent Category</Label>
          <Select onValueChange={handleSelectChange} value={formData.parentId}>
            <SelectTrigger>
              <SelectValue placeholder="Select parent category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">None</SelectItem> {/* Changed value prop to "0" */}
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button className="w-fit" type="submit">
        Add Category
      </Button>
    </form>
  )
}

