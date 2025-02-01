"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { fonts } from "@/components/ui/font"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ContactInput } from "../../../../../components/ContactInput"
import { addSellerToDatabase } from "../[sellerId]/page"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Agriculture",
  "Energy",
  "Transportation",
  "Entertainment",
]

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "Brazil",
  "South Africa",
]

const designations = [
  "CEO",
  "CTO",
  "CFO",
  "COO",
  "Manager",
  "Director",
  "Supervisor",
  "Team Lead",
  "Developer",
  "Designer",
  "Analyst",
  "Consultant",
]

const statusOptions = ["Active", "Inactive", "Block"]

const formFields = [
  { id: "seller-name", label: "Name", type: "text", required: true },
  { id: "seller-email", label: "Email", type: "email", required: true },
  { id: "seller-company-contact", label: "Company Contact", type: "contact", required: true, maxLength: 10 },
  { id: "seller-address", label: "Address", type: "textarea", required: true, maxLength: 199 },
  { id: "seller-country", label: "Country", type: "select", required: true, options: countries },
  { id: "seller-industry", label: "Industry", type: "select", required: true, options: industries },
  { id: "seller-designation", label: "Designation", type: "select", required: true, options: designations },
  { id: "poc-name", label: "POC Name", type: "text", required: true, maxLength: 99 },
  { id: "poc-contact", label: "POC Contact", type: "contact", required: true, maxLength: 10 },
  {
    id: "document",
    label: "Document",
    type: "file",
    required: true,
    multiple: true,
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.bmp,.tiff",
  },
  { id: "status", label: "Status", type: "select", required: true, options: statusOptions },
]

export function SellerForm() {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [companyContactLength, setCompanyContactLength] = useState(0);
  const [pocContactLength, setPocContactLength] = useState(0);

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
    validateField(id, value)

    // Update length for company contact and POC contact
    if (id === "seller-company-contact") {
      setCompanyContactLength(value.length);
    } else if (id === "poc-contact") {
      setPocContactLength(value.length);
    }
  }

  const validateField = (id, value) => {
    let error = ""
    if (formFields.find((field) => field.id === id)?.required && !value) {
      error = "This field is required"
    } else if (id === "seller-email" && !/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address"
    }
    setErrors((prev) => ({ ...prev, [id]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    formFields.forEach((field) => {
      validateField(field.id, formData[field.id])
      if (errors[field.id]) {
        newErrors[field.id] = errors[field.id]
      }
    })
    if (Object.keys(newErrors).length === 0) {
      const formDataToSend = new FormData();
      for (const key in formData) {
        // If the value is an object and not a File list (or array), JSON-stringify it.
        if (
          typeof formData[key] === "object" &&
          !Array.isArray(formData[key]) &&
          !(formData[key] instanceof File)
        ) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else if (Array.isArray(formData[key])) {
          // Append each file in the array (for file inputs)
          for (const file of formData[key]) {
            formDataToSend.append(key, file);
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
      try {
        await addSellerToDatabase(formDataToSend);
        console.log(formDataToSend);
        setSubmissionSuccess("Seller added successfully!");
        revalidatePath('/sellers')
        redirect('/sellers')
      } catch (error) {
        setSubmissionError("Failed to add seller. Please try again.");
        setSubmissionSuccess(null);
      }
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`grid ${fonts.montserrat} gap-6`}>
      <div className="grid gap-4">
        {formFields.map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.type === "select" ? (
              <Select onValueChange={(value) => handleInputChange(field.id, value)} required={field.required}>
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : field.type === "contact" ? (
              <ContactInput
                id={field.id}
                value={formData[field.id] || { countryCode: "", number: "" }}
                onChange={handleInputChange}
                countryCode={field.id === "seller-company-contact" ? formData["seller-country"] : undefined} // Set country code logic
              />
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
                  Accepted file types: {field.accept.replace(/\./g, '').replace(/,/g, ', ')}
                </p>
              </>
            ) : (
              <Input
                id={field.id}
                type={field.type}
                value={formData[field.id] || ""}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
                maxLength={field.maxLength} // Set maxLength for text inputs
              />
            )}
            {errors[field.id] && <p className="text-red-500 text-sm">{errors[field.id]}</p>}
            {/* Show limit exceeded message for Company Contact and POC Contact */}
            {(field.id === "seller-company-contact" && companyContactLength > 10) && (
              <p className="text-red-500 text-sm">Limit exceeded for Company Contact</p>
            )}
            {(field.id === "poc-contact" && pocContactLength > 10) && (
              <p className="text-red-500 text-sm">Limit exceeded for POC Contact</p>
            )}
          </div>
        ))}
      </div>
      <Button className="w-fit" type="submit">
        Save Seller
      </Button>
      {submissionError && <p className="text-red-500">{submissionError}</p>}
      {submissionSuccess && <p className="text-green-500">{submissionSuccess}</p>}
    </form>
  )
}
