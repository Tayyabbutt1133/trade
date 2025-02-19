"use client";
import { useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

export function ImageUpload({ images, setImages }) {
  const fileInputRef = useRef(null);

  // Function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = useCallback(
    async (event) => {
      const files = event.target.files;
      if (files) {
        try {
          const newImagesPromises = Array.from(files)
            .slice(0, 5 - images.length)
            .map(async (file) => {
              const base64Data = await fileToBase64(file);
              return {
                id: Math.random().toString(36).slice(2, 11),
                file,
                preview: URL.createObjectURL(file),
                base64: base64Data,
                name: file.name,
                type: file.type,
                size: file.size,
              };
            });

          const newImages = await Promise.all(newImagesPromises);
          setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
        } catch (error) {
          console.error("Error converting images to base64:", error);
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [images.length, setImages]
  );

  const removeImage = useCallback(
    (id) => {
      setImages((prevImages) => {
        const updatedImages = prevImages.filter((img) => img.id !== id);
        // Revoke object URL to prevent memory leaks
        const removedImage = prevImages.find((img) => img.id === id);
        if (removedImage?.preview) {
          URL.revokeObjectURL(removedImage.preview);
        }
        return updatedImages;
      });
    },
    [setImages]
  );

  // Cleanup function to revoke object URLs when component unmounts
  const cleanup = () => {
    images.forEach((image) => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });
  };

  // Call cleanup when component unmounts
  useCallback(() => {
    return () => cleanup();
  }, [images]);

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
      <p className="text-sm text-gray-500">
        Supported formats: JPG, PNG, GIF (max 5 images)
      </p>
    </div>
  );
}
