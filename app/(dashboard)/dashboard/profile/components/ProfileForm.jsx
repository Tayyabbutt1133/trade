"use client";

import { useEffect, useState } from "react";
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
import { createSeller } from "@/app/actions/createSeller";
import { redirect } from "next/navigation";
import { createBuyer } from "@/app/actions/createBuyer";

// Static options for the status field.
const statusOptions = ["Active", "Inactive"];

// Add this near the top of the file, with other constants
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

// Function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export function ProfileForm({
  countries = [],
  industries = [],
  designations = [],
}) {
  const [formData, setFormData] = useState({
    "company-contact": { countryCode: "", number: "" },
    "poc-contact": { countryCode: "", number: "" },
    document: [],
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const getUserData = await fetch("/api/auth/user");
      const data = (await getUserData.json()).userData;
      setUserData(data);
    }
    fetchUserData();
  }, [])

  // Validation function for each field.
  const validateField = (id, value) => {
    let error = "";
    if (id === "email" && value && !/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    }
    if ((id === "company-contact" || id === "poc-contact") && value) {
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

  // Handle input changes; for checkboxes, use the checked value.
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
          document: `The following files exceed the 3MB limit: ${invalidFiles.join(
            ", "
          )}`,
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

      setFormData((prev) => ({
        ...prev,
        [id]: [...(prev[id] || []), ...base64Files],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }

    // Only validate non-document fields here
    if (id !== "document") {
      const error = validateField(id, value);
      setErrors((prev) => ({ ...prev, [id]: error }));
    }
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const getUserData = await fetch("/api/auth/user");
    // const { userData } = await getUserData.json();
    const userType = userData.type;

    // Create a new FormData object
    const formDataToSubmit = new FormData();

    formDataToSubmit.append("logby", userData.id)
    // Add form data for buyer
    if (userType === "Buyer") {

      const data = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/buyers/", {
        method: "POST",
        body: formDataToSubmit.get("logby")
      })
      //if data doesn't exist this means that the buyer details are new and we need to create a new buyer
      if(!data){
        formDataToSubmit.append("mode", "New")
        formDataToSubmit.append("regid", "0");
      }else{
        formDataToSubmit.append("mode", "Edit")
        formDataToSubmit.append("regid", data.id);
      }

      // Append all form data with the specified parameter names
      formDataToSubmit.append("buyername", formData.name || "");
      formDataToSubmit.append("email", formData.email || "");
      formDataToSubmit.append(
        "ccontact",
        `${formData["company-contact"].countryCode}${formData["company-contact"].number}`
      );
      formDataToSubmit.append("address", formData.address || "");
      // Optional fields - only append if they have values
      if (formData.pocname) {
        formDataToSubmit.append("pocname", formData.pocname);
      }
      if (formData["company-contact"] && formData["company-contact"].number) {
        formDataToSubmit.append(
          "poccontact",
          `${formData["company-contact"].countryCode}${formData["company-contact"].number}`
        );
      }
      formDataToSubmit.append("status", formData.status || "");
      formDataToSubmit.append("blocked", formData.blocked || false);
      formDataToSubmit.append("country", formData.country || "");
      formDataToSubmit.append("designation", formData.designation || "");
      formDataToSubmit.append("industry", formData.industry || "");


      // Call the server action with the FormData
      const result = await createBuyer(formDataToSubmit);

      console.log(result)

      if (result.success) {
        setSubmissionSuccess(result.message);
        setSubmissionError(null);
        // Optionally, reset form or redirect
        // redirect("/dashboard/profile");
      } else {
        setSubmissionError(result.message);
        setSubmissionSuccess(null);
      }
    } else if (userType === "Seller") {
      // Fetch seller data from user account
      const data = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/seller/", {
        method: "POST",
        body: formDataToSubmit.get("logby")
      })
      //if data doesn't exist this means that the seller details are new and we need to create a new seller
      if(!data){
        formDataToSubmit.append("mode", "New")
        formDataToSubmit.append("regid", "0");
      }else{
        formDataToSubmit.append("mode", "Edit")
        formDataToSubmit.append("regid", data.id);
      }

      // Append all form data with the specified parameter names
      formDataToSubmit.append("sellername", formData.name || "");
      formDataToSubmit.append("email", formData.email || "");
      formDataToSubmit.append(
        "ccontact",
        `${formData["company-contact"].countryCode}${formData["company-contact"].number}`
      );
      formDataToSubmit.append("address", formData.address || "");
      // Optional fields - only append if they have values
      if (formData.pocname) {
        formDataToSubmit.append("pocname", formData.pocname);
      }
      if (formData["poc-contact"] && formData["poc-contact"].number) {
        formDataToSubmit.append(
          "poccontact",
          `${formData["poc-contact"].countryCode}${formData["poc-contact"].number}`
        );
      }
      formDataToSubmit.append("status", formData.status || "");
      formDataToSubmit.append("blocked", formData.blocked || false);
      formDataToSubmit.append("country", formData.country || "");
      formDataToSubmit.append("designation", formData.designation || "");
      formDataToSubmit.append("industry", formData.industry || "");


      // Call the server action with the FormData
      const result = await createSeller(formDataToSubmit);

      if (result.success) {
        setSubmissionSuccess(result.message);
        setSubmissionError(null);
        // Optionally, reset form or redirect
        redirect("/dashboard/profile");
      } else {
        setSubmissionError(result.message);
        setSubmissionSuccess(null);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`grid ${fonts.montserrat} gap-6`}>
      <div className="grid gap-4">
        {/* Seller Name */}
        <div className="grid gap-2">
          <Label htmlFor="name">
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData["name"] || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </div>

        {/* Seller Email */}
        <div className="grid gap-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData["email"] || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            required
          />
        </div>

        {/* Company Contact */}
        <div className="grid gap-2">
          <Label htmlFor="company-contact">
            Company Contact <span className="text-red-500">*</span>
          </Label>
          <ContactInput
            id="company-contact"
            name="company-contact"
            value={formData["company-contact"]}
            onChange={handleInputChange}
          />
        </div>

        {/* Address */}
        <div className="grid gap-2">
          <Label htmlFor="address">
            Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            name="address"
            value={formData["address"] || ""}
            onChange={(e) => handleInputChange("address", e.target.value)}
            required
            maxLength={199}
          />
        </div>

        {/* Country */}
        <div className="grid gap-2">
          <Label htmlFor="country">
            Country <span className="text-red-500">*</span>
          </Label>
          <Select
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
          <Label htmlFor="industry">
            Industry <span className="text-red-500">*</span>
          </Label>
          <Select
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
          <Label htmlFor="designation">
            Designation <span className="text-red-500">*</span>
          </Label>
          <Select
            onValueChange={(value) => handleInputChange("designation", value)}
            required
            name="designation"
          >
            <SelectTrigger id="designation">
              <SelectValue placeholder="Select Designation" />
            </SelectTrigger>
            <SelectContent>
              {designations.map((designation) => (
                <SelectItem
                  key={designation.designation}
                  value={designation.designation}
                >
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
            value={formData["pocname"] || ""}
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
            value={formData["poc-contact"]}
            onChange={handleInputChange}
          />
        </div>

        {/* Document */}
        <div className="grid gap-2">
          <Label htmlFor="document">
            Document <span className="text-red-500">*</span>
          </Label>
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
              Accepted file types: pdf, doc, docx, xls, xlsx, jpg, jpeg, png,
              bmp, tiff (Max size: 3MB per file)
            </p>
            {errors.document && (
              <p className="text-red-500 text-sm">{errors.document}</p>
            )}
            {formData.document && formData.document.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium mb-1">Uploaded files:</h4>
                <ul className="list-disc pl-5">
                  {formData.document.map((file, index) => (
                    <li
                      key={index}
                      className="text-sm flex items-center justify-between"
                    >
                      <span>{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newFiles = formData.document.filter(
                            (_, i) => i !== index
                          );
                          setFormData((prev) => ({
                            ...prev,
                            document: newFiles,
                          }));
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

      </div>
      <Button type="submit" className="w-fit">
        Save Profile
      </Button>
      {submissionError && <p className="text-red-500">{submissionError}</p>}
      {submissionSuccess && (
        <p className="text-green-500">{submissionSuccess}</p>
      )}
    </form>
  );
}
