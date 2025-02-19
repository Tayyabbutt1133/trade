"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FunctionInput } from "./FunctionInput"
import { ImageUpload } from "./ImageUpload"
import { CategoryComboBoxWithDialog } from "./CategoryComboBoxWithDialog"
import { existingFunctions } from "../_data"
import { createProduct } from "@/app/actions/createProduct"
import { redirect } from "next/navigation"

export function ProductForm({
  initialBrandOptions = [],
  initialCategoriesOption = [],
  initialSubcategoriesOption = [],
}) {
  const [formData, setFormData] = useState({
    product: "",
    description: "",
    code: "",
    formula: "",
    brand: "",
    category: "",
    subcategory: "",
    chemical: "",
    logby: "",
    images: [],
    functions: []
  })
  const [errors, setErrors] = useState({})
  const [submissionError, setSubmissionError] = useState(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(null)

  // Option states
  const [brandOptions, setBrandOptions] = useState(initialBrandOptions)
  const [categoriesOption, setCategoriesOption] = useState(initialCategoriesOption)
  const [subcategoriesOption, setSubcategoriesOption] = useState(initialSubcategoriesOption)

  // Fetch options function remains the same
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

  // Handle input changes
  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    // Clear any errors for this field
    setErrors((prev) => ({ ...prev, [id]: "" }))
  }

  // Handle options changes
  const handleBrandChange = async (newValue) => {
    handleInputChange("brand", newValue.brand)
    await fetchOptionForType("brand")
  }

  const handleCategoryChange = async (newValue) => {
    handleInputChange("category", newValue.category)
    await fetchOptionForType("category")
  }

  const handleSubcategoryChange = async (newValue) => {
    handleInputChange("subcategory", newValue.subcategory)
    await fetchOptionForType("subcategory")
  }

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formDataToSubmit = new FormData();
  
    // Append all product data
    formDataToSubmit.append("product", formData.product || "");
    formDataToSubmit.append("description", formData.description || "");
    formDataToSubmit.append("code", formData.code || "");
    formDataToSubmit.append("formula", formData.formula || "");
    formDataToSubmit.append("brand", formData.brand || "");
    formDataToSubmit.append("category", formData.category || "");
    formDataToSubmit.append("subcategory", formData.subcategory || "");
    formDataToSubmit.append("chemical", formData.chemical || "");
    formDataToSubmit.append("logby", formData.logby || "");
  
    // Handle functions array if needed
    if (formData.functions.length > 0) {
      formDataToSubmit.append("functions", JSON.stringify(formData.functions));
    }
  
    // Add images array as JSON string
    if (formData.images.length > 0) {
      // Only send the necessary image data
      const imageData = formData.images.map(img => ({
        base64: img.base64,
        name: img.name,
        type: img.type
      }));
      formDataToSubmit.append("images", JSON.stringify(imageData));
    }
  
    try {
      const result = await createProduct(formDataToSubmit);
      if (result.success) {
        setSubmissionSuccess(result.message);
        setSubmissionError(null);
        // redirect("/dashboard/products");
      } else {
        setSubmissionError(result.message);
        setSubmissionSuccess(null);
      }
    } catch (error) {
      setSubmissionError("An error occurred while saving the product");
      setSubmissionSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="product">Name</Label>
          <Input 
            id="product"
            name="product"
            type="text"
            value={formData.product || ""}
            onChange={(e) => handleInputChange("product", e.target.value)}
            required 
          />
          {errors.product && <p className="text-red-500 text-sm">{errors.product}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            required 
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Code</Label>
          <Input 
            id="code"
            name="code"
            type="text"
            value={formData.code || ""}
            onChange={(e) => handleInputChange("code", e.target.value)}
            required 
          />
          {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="formula">Formula</Label>
          <Input 
            id="formula"
            name="formula"
            type="text"
            value={formData.formula || ""}
            onChange={(e) => handleInputChange("formula", e.target.value)}
            required 
          />
          {errors.formula && <p className="text-red-500 text-sm">{errors.formula}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="chemical">Chemical</Label>
          <Input 
            id="chemical"
            name="chemical"
            type="text"
            value={formData.chemical || ""}
            onChange={(e) => handleInputChange("chemical", e.target.value)}
          />
          {errors.chemical && <p className="text-red-500 text-sm">{errors.chemical}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="logby">Logged By</Label>
          <Input 
            id="logby"
            name="logby"
            type="text"
            value={formData.logby || ""}
            onChange={(e) => handleInputChange("logby", e.target.value)}
          />
          {errors.logby && <p className="text-red-500 text-sm">{errors.logby}</p>}
        </div>

        <CategoryComboBoxWithDialog
          label="Brand"
          value={formData.brand}
          onChange={handleBrandChange}
          options={brandOptions}
          type="brand"
        />

        <CategoryComboBoxWithDialog
          label="Category"
          value={formData.category}
          onChange={handleCategoryChange}
          options={categoriesOption}
          type="category"
        />

        <CategoryComboBoxWithDialog
          label="Subcategory"
          value={formData.subcategory}
          onChange={handleSubcategoryChange}
          options={subcategoriesOption}
          type="subcategory"
        />

        <FunctionInput
          functions={formData.functions}
          setFunctions={(newFunctions) => handleInputChange("functions", newFunctions)}
          existingFunctions={existingFunctions}
        />

        <ImageUpload 
          images={formData.images}
          setImages={(newImages) => handleInputChange("images", newImages)}
        />
      </div>

      <Button className="w-fit" type="submit">
        Save Chemical Product
      </Button>

      {submissionError && <p className="text-red-500">{submissionError}</p>}
      {submissionSuccess && <p className="text-green-500">{submissionSuccess}</p>}
    </form>
  )
}