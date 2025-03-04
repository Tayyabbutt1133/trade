"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContactInput } from "../../../../../components/ContactInput";
import { fonts } from "@/components/ui/font";
import { createBuyer } from "@/app/actions/createBuyer";
import { GETBUYER } from "@/app/actions/getbuyer";
import { useParams, useRouter } from "next/navigation";

// Static options for the status field.
const statusOptions = ["Active", "Inactive"];

// Maximum file size constant (3MB).
const MAX_FILE_SIZE = 3 * 1024 * 1024;

// Function to convert a file to base64.
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Helper function to convert a raw phone string to an object.
const parsePhoneNumber = (phoneStr) => {
  if (!phoneStr) return { countryCode: "", number: "" };
  // For now, assume the entire string is the number.
  return { countryCode: "", number: phoneStr };
};

export function BuyerForm({ countries = [], industries = [], designations = [] }) {
  const [formData, setFormData] = useState({
    ccontact: { countryCode: "", number: "" },
    poccontact: { countryCode: "", number: "" },
    document: [],
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const params = useParams();
  const router = useRouter();

  // When in edit mode (buyerId exists and is not "new"), fetch existing buyer data.
  useEffect(() => {
    if (params?.buyerId && params.buyerId !== "new") {
      async function fetchBuyer() {
        try {
          // Call GETBUYER with the buyer id from the URL.
          const response = await GETBUYER({ id: params.buyerId });
          console.log("Response from get buyer:", response);
          if (response.success && response.buyer) {
            const buyerData = response.buyer;
            // Map the API's fields to our form fields.
            setFormData({
              buyername: buyerData.bname || "",
              email: buyerData.email || "",
              ccontact: parsePhoneNumber(buyerData.compcontact),
              address: buyerData.saddress || "",
              pocname: buyerData.pocname || "",
              poccontact: parsePhoneNumber(buyerData.poccontact),
              status: buyerData.sstatus === 1 ? "Active" : "Inactive",
              blocked: buyerData.blocked === "Blocked",
              country: buyerData.country || "",
              designation: buyerData.designation || "",
              industry: buyerData.industry || "",
              document: [], // Documents are not returned by the API for edit.
            });
          }
        } catch (error) {
          console.error("Error fetching buyer data:", error);
          setSubmissionError("Failed to load buyer data");
        }
      }
      fetchBuyer();
    }
  }, [params?.buyerId]);

  // Validation function for fields.
  const validateField = (id, value) => {
    let error = "";
    if (id === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    }
    if (id === "ccontact" && value) {
      const phoneNumber = typeof value === "object" ? value.number : value;
      if (!phoneNumber) {
        error = "This field is required";
      } else if (/\D/.test(phoneNumber)) {
        error = "Only numbers allowed";
      } else if (phoneNumber.length > 10) {
        error = "Maximum 10 digits allowed";
      }
    }
    if (id === "poccontact" && value && value.number) {
      const phoneNumber = typeof value === "object" ? value.number : value;
      if (/\D/.test(phoneNumber)) {
        error = "Only numbers allowed";
      } else if (phoneNumber.length > 10) {
        error = "Maximum 10 digits allowed";
      }
    }
    return error;
  };

  // Handle input changes.
  const handleInputChange = async (id, value) => {
    if (id === "document") {
      const newFiles = Array.from(value);
      const validFiles = [];
      const invalidFiles = [];
      for (const file of newFiles) {
        if (file.size > MAX_FILE_SIZE) {
          invalidFiles.push(file.name);
        } else {
          validFiles.push(file);
        }
      }
      if (invalidFiles.length > 0) {
        setErrors((prev) => ({
          ...prev,
          document: `The following files exceed the 3MB limit: ${invalidFiles.join(", ")}`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, document: "" }));
      }
      const base64Files = await Promise.all(
        validFiles.map(async (file) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          base64: await fileToBase64(file),
        }))
      );
      setFormData((prev) => ({ ...prev, document: [...(prev.document || []), ...base64Files] }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
    if (id !== "document") {
      const error = validateField(id, value);
      setErrors((prev) => ({ ...prev, [id]: error }));
    }
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("buyername", formData.buyername || "");
    formDataToSubmit.append("email", formData.email || "");
    formDataToSubmit.append("ccontact", `${formData.ccontact.countryCode}${formData.ccontact.number}`);
    formDataToSubmit.append("address", formData.address || "");
    if (formData.pocname) {
      formDataToSubmit.append("pocname", formData.pocname);
    }
    if (formData.poccontact && formData.poccontact.number) {
      formDataToSubmit.append("poccontact", `${formData.poccontact.countryCode}${formData.poccontact.number}`);
    }
    formDataToSubmit.append("status", formData.status || "");
    formDataToSubmit.append("blocked", formData.blocked ? "Blocked" : "Pending");
    formDataToSubmit.append("country", formData.country || "");
    formDataToSubmit.append("designation", formData.designation || "");
    formDataToSubmit.append("industry", formData.industry || "");

    // **Key Update Pattern:**
    // In edit mode, pass the buyer id from params as regid; in new mode, regid is 0.
    if (params?.buyerId && params.buyerId !== "new") {
      formDataToSubmit.append("regid", params.buyerId);
      formDataToSubmit.append("mode", "Edit");
    } else {
      formDataToSubmit.append("regid", 0);
      formDataToSubmit.append("mode", "New");
    }

    if (formData.document.length > 0) {
      formData.document.forEach((file) => {
        formDataToSubmit.append("document", JSON.stringify(file));
      });
    }

    const result = await createBuyer(formDataToSubmit);
    if (result.success) {
      setSubmissionSuccess(result.message);
      setSubmissionError(null);
      router.push("/dashboard/buyer");
    } else {
      setSubmissionError(result.message);
      setSubmissionSuccess(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`grid ${fonts.montserrat} gap-6`}>
      <div className="grid gap-4">
        {/* Buyer Name */}
        <div className="grid gap-2">
          <Label htmlFor="buyer-name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="buyer-name"
            name="buyername"
            type="text"
            value={formData.buyername || ""}
            onChange={(e) => handleInputChange("buyername", e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        {/* Company Contact */}
        <div className="grid gap-2">
          <Label htmlFor="ccontact">Company Contact <span className="text-red-500">*</span></Label>
          <ContactInput
            id="ccontact"
            name="ccontact"
            value={formData.ccontact}
            onChange={handleInputChange}
          />
        </div>

        {/* Address */}
        <div className="grid gap-2">
          <Label htmlFor="address">Address <span className="text-red-500">*</span></Label>
          <Textarea
            id="address"
            name="address"
            value={formData.address || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
            maxLength={199}
          />
        </div>

        {/* Country */}
        <div className="grid gap-2">
          <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleInputChange("country", value)}
            required
            name="country"
          >
            <SelectTrigger id="country">
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
          <Label htmlFor="industry">Industry <span className="text-red-500">*</span></Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => handleInputChange("industry", value)}
            required
            name="industry"
          >
            <SelectTrigger id="industry">
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
          <Label htmlFor="designation">Designation <span className="text-red-500">*</span></Label>
          <Select
            value={formData.designation}
            onValueChange={(value) => handleInputChange("designation", value)}
            required
            name="designation"
          >
            <SelectTrigger id="designation">
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

        {/* POC Name (Optional) */}
        <div className="grid gap-2">
          <Label htmlFor="poc-name">POC Name</Label>
          <Input
            id="poc-name"
            name="pocname"
            type="text"
            value={formData.pocname || ""}
            onChange={(e) => handleInputChange("pocname", e.target.value)}
            maxLength={99}
          />
        </div>

        {/* POC Contact (Optional) */}
        <div className="grid gap-2">
          <Label htmlFor="poc-contact">POC Contact</Label>
          <ContactInput
            id="poc-contact"
            name="poccontact"
            value={formData.poccontact}
            onChange={handleInputChange}
          />
        </div>

        {/* Document Upload (Optional) */}
        <div className="grid gap-2">
          <Label htmlFor="document">Document</Label>
          <div className="flex flex-col gap-2">
            <Input
              id="document"
              name="doc"
              type="file"
              onChange={(e) => handleInputChange("document", e.target.files)}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.bmp,.tiff"
              multiple
            />
            <p className="text-gray-500 text-sm">
              Accepted file types: pdf, doc, docx, xls, xlsx, jpg, jpeg, png, bmp, tiff (Max size: 3MB per file)
            </p>
            {errors.document && <p className="text-red-500 text-sm">{errors.document}</p>}
            {formData.document && formData.document.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Uploaded files:</h4>
                <ul className="list-disc pl-5">
                  {formData.document.map((file, index) => (
                    <li key={index} className="text-sm flex items-center justify-between">
                      <span>{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFiles = formData.document.filter((_, i) => i !== index);
                          setFormData((prev) => ({ ...prev, document: newFiles }));
                        }}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="grid gap-2">
          <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
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

        {/* Blocked */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="blocked"
            name="blocked"
            checked={formData.blocked || false}
            onChange={(e) => handleInputChange("blocked", e.target.checked)}
          />
          <Label htmlFor="blocked">Blocked</Label>
        </div>
      </div>

      <Button type="submit" className="w-fit">
        {params?.buyerId && params.buyerId !== "new" ? "Update Buyer" : "Save Buyer"}
      </Button>
      {submissionError && <p className="text-red-500">{submissionError}</p>}
      {submissionSuccess && <p className="text-green-500">{submissionSuccess}</p>}
    </form>
  );
}
