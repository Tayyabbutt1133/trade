"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FunctionInput } from "./FunctionInput"
import { ImageUpload } from "./ImageUpload"
import { CategoryComboBoxWithDialog } from "./CategoryComboBoxWithDialog"
import { formFields, existingFunctions } from "../_data"

export function ProductForm({
  initialBrandOptions = [],
  initialCategoriesOption = [],
  initialSubcategoriesOption = [],
}) {
  const [images, setImages] = useState([])
  const [functions, setFunctions] = useState([])
  const [brand, setBrand] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedSubcategory, setSelectedSubcategory] = useState("")

  // Option states
  const [brandOptions, setBrandOptions] = useState(initialBrandOptions)
  const [categoriesOption, setCategoriesOption] = useState(initialCategoriesOption)
  const [subcategoriesOption, setSubcategoriesOption] = useState(initialSubcategoriesOption)

  // Fetch only the needed options based on type
  const fetchOptionForType = async (type) => {
    let endpoint = ""
    let setOption
    if (type === "brand") {
      endpoint = 'https://tradetoppers.esoftideas.com/esi-api/responses/brand/'
      setOption = setBrandOptions
    } else if (type === "category") {
      endpoint = 'https://tradetoppers.esoftideas.com/esi-api/responses/categories/'
      setOption = setCategoriesOption
    } else if (type === "subcategory") {
      endpoint = 'https://tradetoppers.esoftideas.com/esi-api/responses/subcategories/'
      setOption = setSubcategoriesOption
    }

    try {
      const res = await fetch(endpoint)
      const data = await res.json()
      if (type === "brand") {
        setOption(data.Brand || data)
      } else if (type === "category") {
        setOption(data.Categories || data)
      } else if (type === "subcategory") {
        setOption(data.SubCategories || data)
      }
    } catch (error) {
      console.error(`Error fetching ${type} options:`, error)
    }
  }

  const handleBrandChange = async (newValue) => {
    setBrand(newValue)
    await fetchOptionForType("brand")
  }

  const handleCategoryChange = async (newValue) => {
    setSelectedCategory(newValue)
    await fetchOptionForType("category")
  }

  const handleSubcategoryChange = async (newValue) => {
    setSelectedSubcategory(newValue)
    await fetchOptionForType("subcategory")
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("Form submitted", {
      images,
      functions,
      brand,
      selectedCategory,
      selectedSubcategory,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        {formFields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea id={field.id} required />
            ) : (
              <Input id={field.id} type={field.type} required />
            )}
          </div>
        ))}

        <CategoryComboBoxWithDialog
          label="Brand"
          value={brand}
          onChange={handleBrandChange}
          options={brandOptions}
          type="brand"
        />

        <CategoryComboBoxWithDialog
          label="Category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          options={categoriesOption}
          type="category"
        />

        <CategoryComboBoxWithDialog
          label="Subcategory"
          value={selectedSubcategory}
          onChange={handleSubcategoryChange}
          options={subcategoriesOption}
          type="subcategory"
        />

        <FunctionInput
          functions={functions}
          setFunctions={setFunctions}
          existingFunctions={existingFunctions}
        />

        <ImageUpload images={images} setImages={setImages} />
      </div>

      <Button className="w-fit" type="submit">
        Save Chemical Product
      </Button>
    </form>
  )
}
