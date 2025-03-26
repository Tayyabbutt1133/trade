"use client"

import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

export function CompanyLogoUpload({ 
  logo, 
  setLogo 
}) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const logoData = {
        file,
        base64: URL.createObjectURL(file),
        name: file.name,
        type: file.type,
      };
      
      // Replace any existing logo
      setLogo([logoData]);
    }
  };

  const removeLogo = () => {
    setLogo([]);
  };

  return (
    <div className="space-y-2">
      <Label>Company Logo</Label>
      <div className="flex flex-wrap gap-2">
        {logo.length > 0 ? (
          <div className="relative">
            <img 
              src={logo[0].base64} 
              alt="Company Logo" 
              className="w-32 h-32 object-cover rounded"
            />
            <button
              type="button"
              onClick={removeLogo}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <div className="w-32 h-32 border-2 border-dashed flex items-center justify-center rounded">
              <Upload size={24} />
              <span className="sr-only">Upload Company Logo</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
      {logo.length === 0 && (
        <p className="text-sm text-gray-500">Upload a single company logo</p>
      )}
    </div>
  );
}