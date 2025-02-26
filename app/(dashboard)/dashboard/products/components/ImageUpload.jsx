"use client"

import { useRef, useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

export function ImageUpload({ images = [], setImages }) {
  const fileInputRef = useRef(null)
  const [error, setError] = useState("")
  const [localImages, setLocalImages] = useState(images)

  // Function to convert file to base64
  const fileToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Remove the "data:image/xxx;base64," prefix
          const base64Data = reader.result.replace(/^data:image\/\w+;base64,/, "");
          resolve(base64Data);
        } else {
          reject(new Error("Failed to convert file to base64"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }, []);
  

  // Function to validate image file
  const validateImage = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const validTypes = ["image/jpeg", "image/png", "image/gif"]

      if (!validTypes.includes(file.type)) {
        reject(new Error(`Invalid file type for ${file.name}. Only JPG, PNG, and GIF are supported.`))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        reject(new Error(`File ${file.name} is too large. Maximum size is 5MB.`))
        return
      }

      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        resolve(true)
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error(`File ${file.name} is not a valid image`))
      }

      img.src = objectUrl
    })
  }, [])

  const handleImageUpload = useCallback(
    async (event) => {
      setError("")
      const files = event.target.files

      if (!files || files.length === 0) {
        setError("No files selected")
        return
      }

      const remainingSlots = 5 - localImages.length

      if (remainingSlots <= 0) {
        setError("Maximum 5 images allowed")
        return
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots)

      try {
        const processedImages = []

        for (const file of filesToProcess) {
          try {
            await validateImage(file)
            const base64Data = await fileToBase64(file)
            const preview = URL.createObjectURL(file)

            processedImages.push({
              id: Math.random().toString(36).slice(2, 11),
              file,
              preview,
              base64: base64Data,
              name: file.name,
              type: file.type,
              size: file.size,
            })
          } catch (error) {
            console.error(`Error processing file ${file.name}:`, error)
            setError(
              (prevError) =>
                prevError + (prevError ? "\n" : "") + (error instanceof Error ? error.message : String(error)),
            )
          }
        }

        if (processedImages.length > 0) {
          const updatedImages = [...localImages, ...processedImages].slice(0, 5)
          setLocalImages(updatedImages)
          if (typeof setImages === "function") {
            setImages(updatedImages)
          }
        }
      } catch (error) {
        console.error("Error processing images:", error)
        setError(
          (prevError) =>
            prevError +
            (prevError ? "\n" : "") +
            (error instanceof Error ? error.message : "Error uploading images. Please try again."),
        )
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [localImages, setImages, fileToBase64, validateImage],
  )

  const removeImage = useCallback(
    (id) => {
      const updatedImages = localImages.filter((img) => img.id !== id)
      setLocalImages(updatedImages)
      if (typeof setImages === "function") {
        setImages(updatedImages)
      }

      const removedImage = localImages.find((img) => img.id === id)
      if (removedImage?.preview) {
        URL.revokeObjectURL(removedImage.preview)
      }
    },
    [localImages, setImages],
  )

  useEffect(() => {
    return () => {
      localImages.forEach((image) => {
        if (image?.preview) {
          URL.revokeObjectURL(image.preview)
        }
      })
    }
  }, [localImages])

  return (
    <div className="grid gap-2">
      <Label htmlFor="product-images">Chemical Images (up to 5)</Label>
      <div className="flex flex-wrap gap-4">
        {localImages.map((image) => (
          <div key={image.id} className="relative w-24 h-24">
            <img
              src={image.preview || "/placeholder.svg"}
              alt={`Preview ${image.name}`}
              className="w-full h-full object-cover rounded-md"
              onError={(e) => {
                e.target.src = "/placeholder.svg"
                console.error(`Error loading preview for ${image.name}`)
              }}
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
        {localImages.length < 5 && (
          <Button
            type="button"
            variant="outline"
            className="w-24 h-24 flex items-center justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            +
          </Button>
        )}
      </div>
      <Input
        id="product-images"
        type="file"
        accept="image/jpeg,image/png,image/gif"
        multiple
        className="hidden"
        onChange={handleImageUpload}
        ref={fileInputRef}
      />
      {error && <p className="text-sm text-destructive whitespace-pre-line">{error}</p>}
      <p className="text-sm text-muted-foreground">Supported formats: JPG, PNG, GIF (max 5 images, 5MB each)</p>
    </div>
  );
}
