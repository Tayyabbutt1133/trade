"use client";

import { useState, useEffect } from "react";
import { fetchMetaData } from "@/app/(dashboard)/dashboard/expo-events/fetchexpo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, Phone, ArrowRight, Building2 } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { EXPO } from "@/app/actions/expoevents";
import Container from "@/components/container";
import { useRouter } from "next/navigation";

export default function ExpoEvents() {
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
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

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.rtype ||
      !formData.country ||
      !formData.industry
    ) {
      setIsError(true);
      setMessage("Please fill in all required fields.");
      return;
    }

    try {
      const expoData = new FormData(e.target);
      const response = await EXPO(expoData);
      console.log("API Response:", response);
      // Set a beautiful green success message
      setIsError(false);
      setMessage(
        "Thanks for choosing us, your submission is done successfully!"
      );
      // Optionally, reset the form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        rtype: "",
        country: "",
        industry: "",
      });
        router.push("/")
    } catch (error) {
      console.error("Form Submission Error:", error);
      setIsError(true);
      setMessage("Error submitting form. Please try again.");
    }
  };

  const router = useRouter();

  return (
    <Container>
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <h3
            className={`text-2xl font-semibold ${fonts.montserrat} text-gray-700`}
          >
            Business Information
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {/* Full Name */}
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                name="fullname"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                onChange={(e) => {
                  const input = e.target.value;
                  // Allow only digits and limit to 15 characters
                  if (/^\d{0,15}$/.test(input)) {
                    setFormData({ ...formData, phone: input });
                  }
                }}
                placeholder="Phone Number"
                maxLength={15}
                className={`pl-10 ${fonts.montserrat} h-12`}
              />
            </div>

            {/* Address */}
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                name="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Address"
                className={`pl-10 ${fonts.montserrat} h-12`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1  gap-6">
            {/* rtype Dropdown */}
            <div className="relative">
              <select
                name="rtype"
                value={formData.rtype}
                onChange={(e) =>
                  setFormData({ ...formData, rtype: e.target.value })
                }
                className={`pl-3 pr-10 ${fonts.montserrat} h-12 w-full border rounded-md`}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="buyer">Buyer</option>
                <option value="Industrial Manufacturer">Industrial Manufacturer</option>
                <option value="Trading Companies">Trading Companies</option>
              </select>
            </div>

            {/* Country Dropdown */}
            <div className="relative">
              <select
                name="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, industry: e.target.value })
                }
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
          <div className="flex justify-end">
            <Button
              type="submit"
              className={`h-12 hover:scale-105 transition ${fonts.montserrat} flex items-center`}
            >
              Submit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Status Message */}
        {message && (
          <div
            className={`mt-4 p-4 border rounded-lg ${
              isError
                ? "bg-red-50 border-red-200 text-red-700"
                : `bg-green-50 ${fonts.montserrat} border-green-200 text-green-700`
            }`}
          >
            <span>{message}</span>
          </div>
        )}
      </div>
    </Container>
  );
}
