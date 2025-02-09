"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, Phone, ArrowRight, Building2 } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { EXPO } from "@/app/actions/expoevents";

export default function ModernQRPage() {
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation: ensure all fields are filled.
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      // Create a FormData instance from the form element.
      const expoData = new FormData(e.target);
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
          {/* Full Name */}
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              name="fullname"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name"
              className={`pl-10 ${fonts.montserrat} h-12`}
            />
          </div>

          {/* Email Address */}
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email Address"
              className={`pl-10 ${fonts.montserrat} h-12`}
            />
          </div>

          {/* Phone Number */}
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Phone Number"
              className={`pl-10 ${fonts.montserrat} h-12`}
            />
          </div>

          {/* Address */}
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              name="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Address"
              className={`pl-10 ${fonts.montserrat} h-12`}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button type="submit" className={`h-12 ${fonts.montserrat}`}>
            Submit
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </form>

      {/* Status Message */}
      {message && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <span className="text-green-600">{message}</span>
        </div>
      )}
    </div>
  );
}
