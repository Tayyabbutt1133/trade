"use client";

import { useTransition, useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import { GETPROFILE } from "@/app/actions/getprofiledata";
import { POSTPROFILE } from "@/app/actions/postprofiledata";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

export function ProfileForm({
  countries = [],
  industries = [],
  designations = [],
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [iswebcode, setIsWebcode] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [ShowRouteLoader, setShowRouteLoader] = useState();
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  // Fetch user data and set webcode only once
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch("/api/auth/user");
      const data = await response.json();
      const webcode = data?.userData?.webcode;
      console.log("webcode from profile:", webcode);
      setIsWebcode(webcode);
    };
    fetchUserData();
  }, []);

  // Once iswebcode is set, then fetch profile
  useEffect(() => {
    if (!iswebcode) return;

    const getdata = async () => {
      try {
        const getprofileData = await GETPROFILE(iswebcode);

        if (getprofileData) {
          // For company contact
          const companyContact = getprofileData.company || "";
          let companyCountryCode = "";
          let companyNumber = "";

          // For countries with standard codes (assuming most start with 1-3 digits)
          if (companyContact) {
            // Try to find the country code in your list
            for (const code of countryCodes) {
              if (companyContact.startsWith(code)) {
                companyCountryCode = code;
                companyNumber = companyContact.substring(code.length);
                break;
              }
            }

            // If no match found, use a fallback approach
            if (!companyCountryCode) {
              // Default to first 2 digits or whatever makes sense for your data
              companyCountryCode = companyContact.substring(
                0,
                Math.min(2, companyContact.length)
              );
              companyNumber = companyContact.substring(
                Math.min(2, companyContact.length)
              );
            }
          }

          // Same for POC contact
          const pocContact = getprofileData.poccontact || "";
          let pocCountryCode = "";
          let pocNumber = "";

          if (pocContact) {
            for (const code of countryCodes) {
              if (pocContact.startsWith(code)) {
                pocCountryCode = code;
                pocNumber = pocContact.substring(code.length);
                break;
              }
            }

            if (!pocCountryCode) {
              pocCountryCode = pocContact.substring(
                0,
                Math.min(2, pocContact.length)
              );
              pocNumber = pocContact.substring(Math.min(2, pocContact.length));
            }
          }

          setFormData((prev) => ({
            ...prev,
            name: getprofileData.name || "",
            email: getprofileData.email || "",
            country: getprofileData.country || "",
            industry: getprofileData.industry || "",
            designation: getprofileData.designation || "",
            address: getprofileData.caddress || "",
            pocname: getprofileData.pocname || "",
            intro: getprofileData.intro || "",
            "company-contact": {
              countryCode: companyCountryCode,
              number: companyNumber,
            },
            "poc-contact": {
              countryCode: pocCountryCode,
              number: pocNumber,
            },
          }));
        }
      } catch (error) {
        console.log(error);
      }
    };

    getdata();
  }, [iswebcode, countryCodes]);

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/country/"
        );
        const data = await res.json();
        const codes = data.Country.map((c) => c.code);
        console.log(codes);
        setCountryCodes(codes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountryCodes();
  }, []);

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
    setSubmissionError(null);
    setSubmissionSuccess(null);
    // Validate all fields before submission
    let formIsValid = true;
    const newErrors = {};

    // Required fields validation
    const requiredFields = [
      "name",
      "email",
      "address",
      "country",
      "industry",
      "designation",
      "pocname",
      "intro",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        formIsValid = false;
        newErrors[field] = "This field is required";
      }
    });

    // Special validation for contact fields
    if (!formData["company-contact"]?.number) {
      formIsValid = false;
      newErrors["company-contact"] = "Company contact is required";
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

    setShowRouteLoader(true); // Start showing the loader before the submission process

    try {
      // Format phone numbers with country codes
      const companyContact = `${formData["company-contact"].countryCode}${formData["company-contact"].number}`;
      const pocContact = `${formData["poc-contact"].countryCode}${formData["poc-contact"].number}`;

      // Create FormData object for submission
      const profileData = new FormData();

      // Append all form fields
      profileData.append("code", iswebcode);
      profileData.append("name", formData.name);
      profileData.append("email", formData.email);
      profileData.append("country", formData.country);
      profileData.append("industry", formData.industry);
      profileData.append("designation", formData.designation);
      profileData.append("caddress", formData.address);
      profileData.append("pocname", formData.pocname);
      profileData.append("intro", formData.intro);
      profileData.append("company", companyContact);
      profileData.append("pocontact", pocContact);

      // Handle documents if any
      if (formData.document && formData.document.length > 0) {
        formData.document.forEach((doc, index) => {
          // If you need to handle base64 files, you might need special handling here
          profileData.append(`document[${index}]`, doc);
        });
      }

      // Submit the data
      const result = await POSTPROFILE(profileData);
      console.log(result);
      if (result && result.success) {
        setSubmissionSuccess("Profile updated successfully!");
        console.log("Form data :", formData);
        // Navigate to dashboard after successful submission
        startTransition(() => {
          router.push("/dashboard");
        });
      } else {
        setSubmissionError(
          result?.message || "Failed to update profile. Please try again."
        );
        setShowRouteLoader(false); // Hide loader on error
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      setSubmissionError(
        "An error occurred while submitting the form. Please try again."
      );
      setShowRouteLoader(false); // Hide loader on error
    }
  };

  // Also add an effect to handle the transition state
  useEffect(() => {
    if (!isPending && ShowRouteLoader) {
      // This effect will run when the transition completes
      // No need to do anything as the page will have navigated
      // But if for some reason we're still on the same page:
      setTimeout(() => {
        setShowRouteLoader(false);
      }, 500);
    }
  }, [isPending, ShowRouteLoader]);

  return (
    <>
      {ShowRouteLoader && <RouteTransitionLoader />}
      <form
        onSubmit={handleSubmit}
        className={`grid ${fonts.montserrat} gap-6`}
      >
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
              countryCodes={countryCodes}
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
              value={formData["country"] || ""}
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
              value={formData["industry"] || ""}
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
              value={formData["designation"] || ""}
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
              countryCodes={countryCodes}
            />
          </div>

          {/* Company Introduction */}
          <div className="grid gap-2">
            <Label htmlFor="intro">
              Company Introduction<span className="text-red-500">*</span>
            </Label>
            <textarea
              id="intro"
              value={formData["intro"] || ""}
              onChange={(e) => handleInputChange("intro", e.target.value)}
              className="h-28 border-gray-300 border-2 w-full p-2 resize-none rounded"
            />
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
    </>
  );
}
