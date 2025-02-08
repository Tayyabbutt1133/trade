"use client";

import { useState, useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import Tesseract from "tesseract.js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Mail, User, Phone, ArrowRight, Building2 } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { EXPO } from "@/app/actions/expoevents";

export default function ModernQRPage() {
  const [showScanner, setShowScanner] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          videoConstraints: { facingMode: { ideal: "environment" } },
        },
        false
      );

      scanner.render(
        async (text) => {
          try {
            const data = JSON.parse(text);
            setFormData({
              name: data.name || "",
              email: data.email || "",
              phone: data.phone || "",
              address: data.address || "",
            });

            if (data.documentUrl) {
              await handleOCR(data.documentUrl);
            }

            scanner.clear();
            setShowScanner(false);
            setMessage("QR Code scanned successfully!");
          } catch (error) {
            console.error("QR Parsing Error:", error);
            setMessage("Failed to scan QR Code. Please try again.");
          }
        },
        (error) => console.error("QR Scan error:", error)
      );

      return () => {
        scanner.clear();
      };
    }
  }, [showScanner]);

  const handleOCR = async (imageUrl) => {
    try {
      setMessage("Extracting text from image...");
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "scanned-image.png", { type: blob.type });
      setSelectedFile(file);

      const { data } = await Tesseract.recognize(blob, "eng");
      setFormData((prev) => ({ ...prev, address: data.text.trim() }));
      setMessage("Text extracted successfully!");
    } catch (error) {
      console.error("OCR Processing Error:", error);
      setMessage("Failed to extract text from image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const expoData = new FormData(e.target);
      if (selectedFile) {
        expoData.append("document", selectedFile);
      }

      const response = await EXPO(expoData);
      console.log("API Response:", response);
      setMessage("Form submitted successfully!");
    } catch (error) {
      console.error("Form Submission Error:", error);
      setMessage("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h3 className={`text-2xl font-semibold ${fonts.montserrat} text-gray-700 mb-4`}>
          Business Information
        </h3>

        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input value={formData.name} name="fullname" onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Full Name" className={`pl-10 ${fonts.montserrat} h-12`} />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email Address" className={`pl-10 ${fonts.montserrat} h-12`} />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone Number" className={`pl-10 ${fonts.montserrat} h-12`} />
          </div>

          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input value={formData.address} name="address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Address" className={`pl-10 ${fonts.montserrat} h-12`} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="button" variant="outline" name="logby" className={`h-12 ${fonts.montserrat}`} onClick={() => setShowScanner(!showScanner)}>
            <QrCode className="mr-2 h-5 w-5" />
            {showScanner ? "Close Scanner" : "Scan QR Code / Card"}
          </Button>
          <Button type="submit" className={`h-12 ${fonts.montserrat}`}>
            Submit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>

      {message && <div className="mt-4 p-4 bg-green-50 rounded-lg"><span className="text-green-600">{message}</span></div>}

      {showScanner && <div className="mt-6"><div id="qr-reader" className="rounded-lg overflow-hidden" /></div>}
    </div>
  );
}
