"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FunctionInput } from "./FunctionInput"
import { CategorySelect } from "./CategorySelect"
import { ImageUpload } from "./ImageUpload"
import { formFields, existingFunctions, mainCategories, subCategories, subSubCategories, brandOptions } from "../_data"

export function ProductForm() {
  const [images, setImages] = useState([])
  const [functions, setFunctions] = useState([])
  const [mainCategory, setMainCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [subSubCategory, setSubSubCategory] = useState("")
  const [brand, setBrand] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log("Form submitted", {
      images,
      functions,
      brand,
      mainCategory,
      subCategory,
      subSubCategory,
    })
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-4">
        {formFields.map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea id={field.id} required />
            ) : (
              <Input id={field.id} type={field.type} required />
            )}
          </div>
        ))}
        <CategorySelect
          label="Brand"
          value={brand}
          onChange={setBrand}
          onClear={() => setBrand("")}
          options={brandOptions}
        />
        <CategorySelect
          label="Main Category"
          value={mainCategory}
          onChange={(value) => {
            setMainCategory(value)
            setSubCategory("")
            setSubSubCategory("")
          }}
          onClear={() => {
            setMainCategory("")
            setSubCategory("")
            setSubSubCategory("")
          }}
          options={mainCategories}
        />
        <CategorySelect
          label="Subcategory"
          value={subCategory}
          onChange={(value) => {
            setSubCategory(value)
            setSubSubCategory("")
          }}
          onClear={() => {
            setSubCategory("")
            setSubSubCategory("")
          }}
          options={mainCategory ? subCategories[mainCategory] : []}
          disabled={!mainCategory}
        />
        <CategorySelect
          label="Sub-subcategory"
          value={subSubCategory}
          onChange={setSubSubCategory}
          onClear={() => setSubSubCategory("")}
          options={subCategory ? subSubCategories[subCategory] : []}
          disabled={!subCategory}
        />
        <FunctionInput functions={functions} setFunctions={setFunctions} existingFunctions={existingFunctions} />
        <ImageUpload images={images} setImages={setImages} />
      </div>
      <Button className="w-fit" type="submit">
        Save Chemical Product
      </Button>
    </form>
  )
}

