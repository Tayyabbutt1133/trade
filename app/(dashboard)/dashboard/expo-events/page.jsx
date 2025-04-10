"use client";

import { useState, useEffect } from "react";
import { fetchMetaData } from "./fetchexpo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, Phone, ArrowRight, Building2 } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { EXPO } from "@/app/actions/expoevents";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import { useRouter } from "next/navigation";

export default function ModernQRPage() {
  const [message, setMessage] = useState("");
  const [countries, setCountries] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    rtype: "",
    country: "",
    industry: "",
  });
  const [ShowRouteLoader, setShowRouteLoader] = useState(false);

  const router = useRouter();


  useEffect(() => {
    async function loadMetaData() {
      const { countries, industries } = await fetchMetaData();
      setCountries(countries);
      setIndustries(industries);
    }
    loadMetaData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowRouteLoader(true);

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.rtype ||
      !formData.country ||
      !formData.industry
    ) {
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const expoData = new FormData(e.target);
      const response = await EXPO(expoData);
      console.log("API Response:", response);
      setMessage("Form submitted successfully!");
    } catch (error) {
      console.error("Form Submission Error:", error);
      setMessage("Error submitting form. Please try again.");
    } finally {
      setTimeout(() => {
      router.push('/dashboard')
      }, 2000);
    }
  };

  return (
    <>
      {ShowRouteLoader && <RouteTransitionLoader/>}
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

          {/* rtype Dropdown */}
          <div className="relative">
            <select
              name="rtype"
              value={formData.rtype}
              onChange={(e) => setFormData({ ...formData, rtype: e.target.value })}
              className={`pl-3 pr-10 ${fonts.montserrat} h-12 w-full border rounded-md`}
            >
              <option value="" disabled>
                Select Type
              </option>
              <option value="buyer">Buyer</option>
              <option value="industrial Manufacturer">Industrial Manufacturer</option>
              <option value="trading companies">Trading Companies</option>
            </select>
          </div>

          {/* Country Dropdown */}
          <div className="relative">
            <select
              name="country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className={`pl-3 pr-10 ${fonts.montserrat} h-12 w-full border rounded-md`}
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Industry Dropdown */}
          <div className="relative">
            <select
              name="industry"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className={`pl-3 pr-10 ${fonts.montserrat} h-12 w-full border rounded-md`}
            >
              <option value="" disabled>
                Select Industry
              </option>
              {industries.map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
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
      </>
  );
}
