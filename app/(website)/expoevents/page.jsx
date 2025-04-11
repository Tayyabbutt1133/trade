"use client";

import { useState, useEffect } from "react";
import { fetchMetaData } from "@/app/(dashboard)/dashboard/expo-events/fetchexpo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, User, Phone, ArrowRight, Building2, Upload } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { EXPO } from '../../actions/expoevents'
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
  const [file, setFile] = useState(null);
  const [formType, setFormType] = useState("manual"); // 'manual' or 'upload'
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

  const handleManualSubmit = async (e) => {
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
      setShowRouteLoader(false);
      return;
    }

    try {
      const expoData = new FormData();
      for (const key in formData) {
        expoData.append(key, formData[key]);
      }
      const response = await EXPO(expoData);
      console.log("Manual Form Submitted:", response);
      setMessage("Manual form submitted successfully!");
    } catch (error) {
      console.error("Manual Form Error:", error);
      setMessage("Error submitting manual form.");
    } finally {
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setShowRouteLoader(true);

    if (!file) {
      setMessage("Please upload an Excel document.");
      setShowRouteLoader(false);
      return;
    }

    const allowedTypes = [
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage("Only .xls or .xlsx files are allowed.");
      setShowRouteLoader(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("document", file);

      const response = await EXPO(formData);
      console.log("Upload Form Submitted:", response);
      setMessage("Excel document submitted successfully!");
    } catch (error) {
      console.error("Upload Form Error:", error);
      setMessage("Error submitting document.");
    } finally {
      setTimeout(() => router.push("/dashboard"), 2000);
    }
  };

  return (
    <>
      {ShowRouteLoader && <RouteTransitionLoader />}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            type="button"
            variant={formType === "manual" ? "default" : "outline"}
            onClick={() => setFormType("manual")}
          >
            Fill Manually
          </Button>
          <Button
            type="button"
            variant={formType === "upload" ? "default" : "outline"}
            onClick={() => setFormType("upload")}
          >
            Upload Document
          </Button>
        </div>

        {/* Form Sections */}
        {formType === "manual" ? (
          <form onSubmit={handleManualSubmit} className="space-y-6">
            <h3 className={`text-2xl font-semibold ${fonts.montserrat} text-gray-700 mb-4`}>
              Business Information (Manual)
            </h3>

            <div className="space-y-4">
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

              <select
                name="rtype"
                value={formData.rtype}
                onChange={(e) => setFormData({ ...formData, rtype: e.target.value })}
                className={`pl-3 pr-10 ${fonts.montserrat} h-12 w-full border rounded-md`}
              >
                <option value="" disabled>Select Type</option>
                <option value="buyer">Buyer</option>
                <option value="industrial Manufacturer">Industrial Manufacturer</option>
                <option value="trading companies">Trading Companies</option>
              </select>

              <select
                name="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className={`pl-3 pr-10 ${fonts.montserrat} h-12 w-full border rounded-md`}
              >
                <option value="" disabled>Select Country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
                ))}
              </select>

              <select
                name="industry"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className={`pl-3 pr-10 ${fonts.montserrat} h-12 w-full border rounded-md`}
              >
                <option value="" disabled>Select Industry</option>
                {industries.map((industry, index) => (
                  <option key={index} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <Button type="submit" className={`h-12 ${fonts.montserrat}`}>
              Submit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        ) : (
          <form onSubmit={handleUploadSubmit} className="space-y-6">
            <h3 className={`text-2xl font-semibold ${fonts.montserrat} text-gray-700 mb-4`}>
              Upload Business Document (XLS/XLSX)
            </h3>

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
              <div className="text-sm text-gray-600">Selected file: {file.name}</div>
            )}

            <Button type="submit" className={`h-12 ${fonts.montserrat}`}>
              Upload
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        )}

        {message && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <span className="text-green-600">{message}</span>
          </div>
        )}
      </div>
    </>
  );
}
