"use client"
import { useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export function ImageUpload({ images, setImages }) {
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
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [images.length, setImages],
  )

  const removeImage = useCallback(
    (id) => {
      setImages((prevImages) => prevImages.filter((img) => img.id !== id))
    },
    [setImages],
  )

  return (
    <div className="grid gap-2">
      <Label htmlFor="product-images">Chemical Images (up to 5)</Label>
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
              <X className="w-4 w-4" />
            </Button>
          </div>
        ))}
        {images.length < 5 && (
          <Button type="button" variant="outline" className="w-24 h-24" onClick={() => fileInputRef.current?.click()}>
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
  )
}

