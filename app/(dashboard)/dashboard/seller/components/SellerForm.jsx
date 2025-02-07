"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContactInput } from "../../../../../components/ContactInput";
import { fonts } from "@/components/ui/font";
import { addSellerToDatabase } from "../[sellerId]/page";

// Static options for the status field.
const statusOptions = ["Active", "Inactive", "Block"];


// with dynamic data passed as props.
const baseFormFields = [
  { id: "seller-name", name: "sname", label: "Name", type: "text", required: true },
  { id: "seller-email", name: "email", label: "Email", type: "email", required: true },
  {
    id: "seller-company-contact",
    name: "compcontact",
    label: "Company Contact",
    type: "contact",
    required: true,
    maxLength: 10,
  },
  {
    id: "seller-address",
    name: "saddress",
    label: "Address",
    type: "textarea",
    required: true,
    maxLength: 199,
  },
  {
    id: "seller-country",
    name: "country",
    label: "Country",
    type: "select",
    required: true,
    options: [], // dynamic data will be injected here
    optionKey: "country", // use each country's "country" property
  },
  {
    id: "seller-industry",
    name: "industry",
    label: "Industry",
    type: "select",
    required: true,
    options: [],
    optionKey: "industry", // use each industry's "industry" property
  },
  {
    id: "seller-designation",
    name: "designation",
    label: "Designation",
    type: "select",
    required: true,
    options: [],
    optionKey: "designation", // use each designation's "designation" property
  },
  { id: "poc-name", name: "pocname", label: "POC Name", type: "text", required: true, maxLength: 99 },
  { id: "poc-contact", name: "poccontact", label: "POC Contact", type: "contact", required: true, maxLength: 10 },
  {
    id: "document",
    name: "doc",
    label: "Document",
    type: "file",
    required: true,
    multiple: true,
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.bmp,.tiff",
  },
  { id: "status", name: "status", label: "Status", type: "select", required: true, options: statusOptions },
  // Checkbox field for blocked
  { id: "blocked", name: "blocked", label: "Blocked", type: "checkbox", required: true },
];

export function SellerForm({ countries = [], industries = [], designations = [] }) {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [companyContactLength, setCompanyContactLength] = useState(0);
  const [pocContactLength, setPocContactLength] = useState(0);

  // Log dynamic data for debugging
  useEffect(() => {
    console.log("Countries Data:", countries);
    console.log("Industries Data:", industries);
    console.log("Designations Data:", designations);
  }, [countries, industries, designations]);



  // Merge dynamic data into our base fields for select inputs.
  const formFields = baseFormFields.map((field) => {
    if (field.id === "seller-country") {
      return { ...field, options: countries };
    } else if (field.id === "seller-industry") {
      return { ...field, options: industries };
    } else if (field.id === "seller-designation") {
      return { ...field, options: designations };
    }
    return field;
  });

  // Validation function for each field.
  const validateField = (id, value) => {
    let error = "";
    const fieldDef = formFields.find((field) => field.id === id);
    if (fieldDef?.required) {
      // For checkbox: require a boolean (true/false)
      if (fieldDef.type === "checkbox") {
        if (value !== true && value !== false) {
          error = "This field is required";
        }
      }
      // For file inputs, you might want additional validation.
      else if (!value) {
        error = "This field is required";
      }
    }
    // Email validation
    if (id === "seller-email" && value && !/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    }
    // For contact fields, ensure only digits and up to 10 characters.
    if ((id === "seller-company-contact" || id === "poc-contact") && value) {
      const phoneNumber = typeof value === "object" && value !== null ? value.number : value;
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

  // Handle input changes; for checkboxes, use the checked value.
  const handleInputChange = (id, value) => {
    // For contact fields, enforce digits-only formatting (if applicable)
    if (id === "seller-company-contact" || id === "poc-contact") {
      if (typeof value === "string") {
        value = value.replace(/\D/g, "").slice(0, 10);
        if (id === "seller-company-contact") setCompanyContactLength(value.length);
        else setPocContactLength(value.length);
      } else if (typeof value === "object" && value !== null && "number" in value) {
        value = { ...value, number: value.number.replace(/\D/g, "").slice(0, 10) };
        if (id === "seller-company-contact") setCompanyContactLength(value.number.length);
        else setPocContactLength(value.number.length);
      }
    }

    setFormData((prev) => ({ ...prev, [id]: value }));
    const error = validateField(id, value);
    setErrors((prev) => ({ ...prev, [id]: error }));
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form data:", formData);

    // Validate every field.
    const newErrors = {};
    formFields.forEach((field) => {
      const error = validateField(field.id, formData[field.id]);
      if (error) {
        newErrors[field.id] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission.
    const plainData = {};
    for (const key in formData) {
      // JSON-stringify non-file objects.
      if (typeof formData[key] === "object" && !(formData[key] instanceof File)) {
        plainData[key] = JSON.stringify(formData[key]);
      } else {
        plainData[key] = formData[key];
      }
    }

    try {
      console.log("Submitting data:", plainData);
      await addSellerToDatabase(plainData);
      setSubmissionSuccess("Seller added successfully!");
      setSubmissionError(null);
      router.push("/dashboard/sellers");
    } catch (error) {
      setSubmissionError("Failed to add seller. Please try again.");
      setSubmissionSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`grid ${fonts.montserrat} gap-6`}>
      <div className="grid gap-4">
        {formFields.map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.type === "select" ? (
              <Select
                onValueChange={(value) => handleInputChange(field.id, value)}
                required={field.required}
              >
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options && field.options.length > 0 ? (
                    field.options.map((option, index) => {
                      // If an optionKey exists, assume option is an object.
                      const display = field.optionKey ? option[field.optionKey] : option;
                      return (
                        <SelectItem key={index} value={display}>
                          {display}
                        </SelectItem>
                      );
                    })
                  ) : (
                    <SelectItem disabled>No options available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            ) : field.type === "checkbox" ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={field.id}
                  checked={formData[field.id] || false}
                  onChange={(e) => handleInputChange(field.id, e.target.checked)}
                />
                <span>{field.label}</span>
              </div>
            ) : field.type === "textarea" ? (
              <Textarea
                id={field.id}
                value={formData[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
                maxLength={field.maxLength}
              />
            ) : field.type === "file" ? (
              <>
                <Input
                  id={field.id}
                  type="file"
                  onChange={(e) => handleInputChange(field.id, e.target.files)}
                  required={field.required}
                  multiple={field.multiple}
                  accept={field.accept}
                />
                <p className="text-gray-500 text-sm mt-1">
                  Accepted file types: {field.accept.replace(/\./g, "").replace(/,/g, ", ")}
                </p>
              </>
            ) : field.type === "contact" ? (
              <ContactInput
                id={field.id}
                value={formData[field.id] || { countryCode: "", number: "" }}
                onChange={handleInputChange}
              />
            ) : (
              <Input
                id={field.id}
                type={field.type}
                value={formData[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
              />
            )}
            {errors[field.id] && <p className="text-red-500 text-sm">{errors[field.id]}</p>}
          </div>
        ))}
      </div>
      <Button type="submit" className="w-fit">
        Save Seller
      </Button>
      {submissionError && <p className="text-red-500">{submissionError}</p>}
      {submissionSuccess && <p className="text-green-500">{submissionSuccess}</p>}
    </form>
  );
}
