// components/ProductUploader.jsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { EXPO } from "@/app/actions/expoevents";
import { useRouter } from "next/navigation";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

export default function ProductUploader() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();

  const handleUpload = async (e) => {
    e.preventDefault();
    setShowLoader(true);

    if (!file) {
      setMessage("Please select an Excel file (.xls or .xlsx).");
      setShowLoader(false);
      return;
    }

    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only .xls or .xlsx files are allowed.");
      setShowLoader(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await EXPO(formData);
      console.log("Upload response:", response);
      setMessage("Product upload successful!");
    } catch (err) {
      console.error("Upload failed:", err);
      setMessage("Something went wrong while uploading.");
    } finally {
      setShowLoader(false);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <>
      {showLoader && <RouteTransitionLoader />}
      <div className="px-4 py-6 border rounded-lg shadow-md bg-white max-w-md mx-auto">
        <h2 className={`text-xl font-semibold mb-4 ${fonts.montserrat}`}>Upload Product Excel</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="relative">
            <Upload className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="file"
              name="document"
              accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={(e) => setFile(e.target.files[0])}
              className="pl-10 h-12"
            />
          </div>

          {file && (
            <div className="text-sm text-gray-500">Selected file: {file.name}</div>
          )}

          <Button type="submit" className={`h-12 w-full ${fonts.montserrat}`}>
            Upload Product
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          {message && (
            <div className="mt-2 text-sm text-center text-green-600">{message}</div>
          )}
        </form>
      </div>
    </>
  );
}
