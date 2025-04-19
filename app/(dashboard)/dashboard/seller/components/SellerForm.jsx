"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContactInput } from "../../../../../components/ContactInput";
import { fonts } from "@/components/ui/font";
import { createSeller } from "@/app/actions/createSeller";
import { GETSELLER } from "@/app/actions/getseller";
import { useParams, useRouter } from "next/navigation";

// Static options for the status field.
const statusOptions = ["Active", "Inactive"];

export function SellerForm({ countries = [], industries = [], designations = [] }) {
  const [formData, setFormData] = useState({
    "seller-company-contact": { countryCode: "", number: "" },
    "poc-contact": { countryCode: "", number: "" },
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [countryCodes, setCountryCodes] = useState([]);

  const params = useParams();
  const router = useRouter();

  // Fetch country codes
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/country/"
        );
        const data = await res.json();
        const codes = data.Country.map((c) => c.code);
        setCountryCodes(codes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountryCodes();
  }, []);

  // In edit mode (when sellerId exists and is not "new"), fetch the existing seller data.
  useEffect(() => {
    if (params?.sellerId && params.sellerId !== "new") {
      async function fetchSeller() {
        try {
          const response = await GETSELLER({ id: params.sellerId });
          console.log("Response from get seller:", response);
          
          if (response.success && response.seller) {
            // Handle the seller data properly based on the API response structure
            const sellerData = response.seller;
            
            // Set appropriate status based on what's coming from the API
            let statusValue = "Inactive";
            if (sellerData.status === "Approved") {
              statusValue = "Active";
            }
            
            // Set form data properly
            setFormData({
              sellername: sellerData.name || "",
              email: sellerData.email || "",
              company: sellerData.company || "",
              "seller-company-contact": {
                countryCode: sellerData.ccode || "",
                number: sellerData.ccontact || ""
              },
              address: sellerData.caddress || "",
              country: sellerData.country?.trim() || "",
              industry: sellerData.industry || "",
              designation: sellerData.designation || "",
              pocname: sellerData.pocname || "",
              "poc-contact": {
                countryCode: sellerData.poccode || "",
                number: sellerData.poccontact || ""
              },
              status: statusValue,
              blocked: sellerData.status?.toLowerCase() === "blocked"
            });
          }
        } catch (error) {
          console.error("Error fetching seller data:", error);
          setSubmissionError("Failed to load seller data");
        }
      }
      fetchSeller();
    }
  }, [params?.sellerId]);

  // Validation function for each field.
  const validateField = (id, value) => {
    let error = "";
    if (id === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    }
    if ((id === "seller-company-contact" || id === "poc-contact") && value) {
      const phoneNumber = typeof value === "object" ? value.number : value;
      if (!phoneNumber) {
        error = "This field is required";
      } else if (/\D/.test(phoneNumber)) {
        error = "Only numbers allowed";
      } else if (phoneNumber.length > 10) {
        error = "Maximum 10 digits allowed";
      }
    }
    return error;
  };

  // Handle input changes.
  const handleInputChange = (id, value) => {
    if (id === "seller-company-contact" || id === "poc-contact") {
      setFormData((prev) => ({ ...prev, [id]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let formIsValid = true;
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      "sellername",
      "email",
      "company",
      "address",
      "country",
      "industry",
      "designation",
      "pocname",
      "status"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formIsValid = false;
        newErrors[field] = "This field is required";
      }
    });

    // Special validation for contact fields
    if (!formData["seller-company-contact"]?.number) {
      formIsValid = false;
      newErrors["seller-company-contact"] = "Company contact is required";
    }

    if (!formData["poc-contact"]?.number) {
      formIsValid = false;
      newErrors["poc-contact"] = "POC contact is required";
    }

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      formIsValid = false;
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);

    if (!formIsValid) {
      setSubmissionError("Please fix the errors before submitting");
      return;
    }

    const formDataToSubmit = new FormData();

    // Append form fields using the keys expected by your API.
    formDataToSubmit.append("sellername", formData.sellername || "");
    formDataToSubmit.append("email", formData.email || "");
    formDataToSubmit.append("company", formData.company || "");
    formDataToSubmit.append("address", formData.address || "");
    formDataToSubmit.append("country", formData.country || "");
    formDataToSubmit.append("industry", formData.industry || "");
    formDataToSubmit.append("designation", formData.designation || "");
    formDataToSubmit.append("pocname", formData.pocname || "");
    
    // Append the company contact details separately
    formDataToSubmit.append("ccode", formData["seller-company-contact"].countryCode || "");
    formDataToSubmit.append("ccontact", formData["seller-company-contact"].number || "");
    
    // Append the POC contact details separately
    formDataToSubmit.append("poccode", formData["poc-contact"].countryCode || "");
    formDataToSubmit.append("pocontact", formData["poc-contact"].number || "");
    
    formDataToSubmit.append("status", formData.status || "");
    // Convert the blocked boolean back to the string the API expects.
    formDataToSubmit.append("blocked", formData.blocked ? "Blocked" : "Pending");

    // If in edit mode, pass the seller id from params as regid.
    if (params?.sellerId && params.sellerId !== "new") {
      formDataToSubmit.append("regid", params.sellerId);
      formDataToSubmit.append("mode", "Edit");
    } else {
      formDataToSubmit.append("regid", 0);
      formDataToSubmit.append("mode", "New");
    }

    const result = await createSeller(formDataToSubmit);

    if (result.success) {
      setSubmissionSuccess(result.message);
      setSubmissionError(null);
      router.push("/dashboard/seller");
    } else {
      setSubmissionError(result.message);
      setSubmissionSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`grid ${fonts.montserrat} gap-6`}>
      <div className="grid gap-4">
        {/* Seller Name */}
        <div className="grid gap-2">
          <Label htmlFor="seller-name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="seller-name"
            name="sellername"
            type="text"
            value={formData.sellername || ""}
            onChange={(e) => handleInputChange("sellername", e.target.value)}
            required
          />
        </div>

        {/* Seller Email */}
        <div className="grid gap-2">
          <Label htmlFor="seller-email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="seller-email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        {/* Company Name */}
        <div className="grid gap-2">
          <Label htmlFor="company">
            Company Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="company"
            name="company"
            type="text"
            value={formData.company || ""}
            onChange={(e) => handleInputChange("company", e.target.value)}
            required
          />
        </div>

        {/* Company Contact */}
        <div className="grid gap-2">
          <Label htmlFor="seller-company-contact">
            Company Contact <span className="text-red-500">*</span>
          </Label>
          <ContactInput
            id="seller-company-contact"
            name="seller-company-contact"
            value={formData["seller-company-contact"]}
            onChange={handleInputChange}
            countryCodes={countryCodes}
          />
        </div>

        {/* Address */}
        <div className="grid gap-2">
          <Label htmlFor="seller-address">
            Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="seller-address"
            name="address"
            value={formData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
            maxLength={199}
          />
        </div>

        {/* Country */}
        <div className="grid gap-2">
          <Label htmlFor="seller-country">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleInputChange("country", value)}
            required
            name="country"
          >
            <SelectTrigger id="seller-country">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.country} value={country.country}>
                  {country.country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Industry */}
        <div className="grid gap-2">
          <Label htmlFor="seller-industry">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => handleInputChange("industry", value)}
            required
            name="industry"
          >
            <SelectTrigger id="seller-industry">
              <SelectValue placeholder="Select Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.industry} value={industry.industry}>
                  {industry.industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Designation */}
        <div className="grid gap-2">
          <Label htmlFor="seller-designation">
            Designation <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.designation}
            onValueChange={(value) => handleInputChange("designation", value)}
            required
            name="designation"
          >
            <SelectTrigger id="seller-designation">
              <SelectValue placeholder="Select Designation" />
            </SelectTrigger>
            <SelectContent>
              {designations.map((designation) => (
                <SelectItem key={designation.designation} value={designation.designation}>
                  {designation.designation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* POC Name */}
        <div className="grid gap-2">
          <Label htmlFor="poc-name">
            POC Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="poc-name"
            name="pocname"
            type="text"
            value={formData.pocname || ""}
            onChange={(e) => handleInputChange("pocname", e.target.value)}
            required
            maxLength={99}
          />
        </div>

        {/* POC Contact */}
        <div className="grid gap-2">
          <Label htmlFor="poc-contact">
            POC Contact <span className="text-red-500">*</span>
          </Label>
          <ContactInput
            id="poc-contact"
            name="poc-contact"
            value={formData["poc-contact"]}
            onChange={handleInputChange}
            countryCodes={countryCodes}
          />
        </div>

        {/* Status */}
        <div className="grid gap-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleInputChange("status", value)}
            required
            name="status"
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Blocked
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="blocked"
            name="blocked"
            checked={formData.blocked || false}
            onChange={(e) => handleInputChange("blocked", e.target.checked)}
          />
          <Label htmlFor="blocked">Blocked</Label>
        </div> */}
      </div>
      <Button type="submit" className="w-fit">
        {params?.sellerId && params.sellerId !== "new" ? "Update Seller" : "Save Seller"}
      </Button>
      {submissionError && <p className="text-red-500">{submissionError}</p>}
      {submissionSuccess && <p className="text-green-500">{submissionSuccess}</p>}
    </form>
  );
}