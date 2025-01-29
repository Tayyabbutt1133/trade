"use client"
import RichTextEditor from "@/components/rich-text-editor/RichTextEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

const positionOptions = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
]

const formFields = [
  { id: "title", label: "Title", type: "text", required: true },
  { id: "subject", label: "Subject", type: "text", required: true },
  { id: "description", label: "Description", type: "rich-text-editor", required: true },
  { id: "header-logo", label: "Header Logo", type: "file", required: false },
  {
    id: "header-logo-position",
    label: "Header Logo Position",
    type: "select",
    required: false,
    options: positionOptions,
  },
  { id: "header-text", label: "Header Text", type: "text", required: false },
  { id: "footer-logo", label: "Footer Logo", type: "file", required: false },
  {
    id: "footer-logo-position",
    label: "Footer Logo Position",
    type: "select",
    required: false,
    options: positionOptions,
  },
  { id: "footer-text", label: "Footer Text", type: "text", required: false },
]

export function EmailForm() {
  const [formData, setFormData] = useState({})
  const [footerPositionOptions, setFooterPositionOptions] = useState(positionOptions)

  useEffect(() => {
    if (formData["header-logo-position"]) {
      const headerPosition = formData["header-logo-position"]
      let newOptions = positionOptions.filter((option) => option.value !== headerPosition)
      if (headerPosition === "center") {
        newOptions = newOptions.filter((option) => option.value !== "center")
      }
      setFooterPositionOptions(newOptions)
    } else {
      setFooterPositionOptions(positionOptions)
    }
  }, [formData["header-logo-position"]])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e) => {
    const { id, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      const fileType = file.type.toLowerCase()
      if (fileType === "image/jpeg" || fileType === "image/png") {
        setFormData((prev) => ({ ...prev, [id]: file }))
      } else {
        alert("Please select a JPG or PNG file.")
        e.target.value = "" // Clear the file input
      }
    }
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    if (id === "header-logo-position") {
      setFormData((prev) => ({ ...prev, "footer-logo-position": "" }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData["header-logo-position"] === formData["footer-logo-position"]) {
      alert("Header and footer logo positions cannot be the same.")
      return
    }
    if (formData["header-logo-position"] === "center" && formData["footer-logo-position"] === "center") {
      alert("If header logo position is center, footer logo position cannot be center.")
      return
    }
    console.log("Email form data:", formData)
    // Handle form submission logic here
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4">
        {formFields.map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.type === "rich-text-editor" ? (
              <RichTextEditor
                content={formData.description || ""}
                onChange={(content) => {
                  setFormData((prev) => ({
                    ...prev,
                    description: content,
                  }))
                }}
                defaultButtons={true}
                className="h-[200px]"
              />
            ) : field.type === "file" ? (
              <Input
                id={field.id}
                type="file"
                required={field.required}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png"
              />
            ) : field.type === "select" ? (
              <Select onValueChange={(value) => handleSelectChange(field.id, value)} value={formData[field.id] || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {(field.id === "footer-logo-position" ? footerPositionOptions : field.options)?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.id}
                type={field.type}
                required={field.required}
                onChange={handleInputChange}
                value={formData[field.id] || ""}
              />
            )}
          </div>
        ))}
      </div>
      <Button className="w-fit" type="submit">
        Save Email Template
      </Button>
    </form>
  )
}

