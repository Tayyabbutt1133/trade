"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

const formFields = [
  { id: "product-name", label: "Name", type: "text" },
  { id: "product-description", label: "Description", type: "textarea" },
  { id: "product-code", label: "Code", type: "text" },
  { id: "product-function", label: "Function", type: "text" },
]



export function ProductForm() {
  const [images, setImages] = useState([])
  const fileInputRef = useRef(null)

  const handleImageUpload = useCallback(
    (event) => {
      const files = event.target.files
      if (files) {
        const newImages = Array.from(files)
          .slice(0, 5 - images.length)
          .map((file) => ({
            id: Math.random().toString(36).substr(2, 9),
            file,
            preview: URL.createObjectURL(file),
          }))
        setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5))
      }
      // Reset the file input value to allow re-uploading the same file
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [images.length],
  )

  const removeImage = useCallback((id) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((img) => img.id !== id)
      return newImages
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission here
    console.log("Form submitted", images)
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
        <div className="grid gap-2">
          <Label htmlFor="product-images">Product Images (up to 5)</Label>
          <div className="flex flex-wrap gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative">
                <img
                  src={image.preview || "/placeholder.svg"}
                  alt={`Preview ${image.id}`}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 rounded-full w-6 h-6"
                  onClick={() => removeImage(image.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {images.length < 5 && (
              <Button
                type="button"
                variant="outline"
                className="w-24 h-24"
                onClick={() => fileInputRef.current?.click()}
              >
                +
              </Button>
            )}
          </div>
          <Input
            id="product-images"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageUpload}
            ref={fileInputRef}
          />
        </div>
      </div>
      <Button className="w-fit" type="submit">Save Product</Button>
    </form>
  )
}

