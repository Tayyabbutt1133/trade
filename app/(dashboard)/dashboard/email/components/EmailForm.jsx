"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const positionOptions = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
]

const formFields = [
  { id: "title", label: "Title", type: "text", required: true },
  { id: "subject", label: "Subject", type: "text", required: true },
  { id: "description", label: "Description", type: "textarea", required: true },
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

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleFileChange = (e) => {
    const { id, files } = e.target
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [id]: files[0] }))
    }
  }

  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
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
            {field.type === "textarea" ? (
              <Textarea
                id={field.id}
                required={field.required}
                onChange={handleInputChange}
                value={formData[field.id] || ""}
              />
            ) : field.type === "file" ? (
              <Input id={field.id} type="file" required={field.required} onChange={handleFileChange} />
            ) : field.type === "select" ? (
              <Select onValueChange={(value) => handleSelectChange(field.id, value)} value={formData[field.id] || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
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

