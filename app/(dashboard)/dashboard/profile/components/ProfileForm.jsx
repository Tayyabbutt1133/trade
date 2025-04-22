"use client";

import { useTransition, useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
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
import { ContactInput } from "../../../../../components/ContactInput"; // Import directly instead of lazy loading
import { fonts } from "@/components/ui/font";
import { useRouter } from "next/navigation";
import { GETPROFILE } from "@/app/actions/getprofiledata";
import { POSTPROFILE } from "@/app/actions/postprofiledata";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import DeleteUser_Profile from "./DeleteUser_Profile";

// Simple loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

export function ProfileForm({
  countries = [],
  industries = [],
  designations = [],
  countrycodes = [],
}) {
  // Split state into smaller, focused pieces
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    industry: "",
    designation: "",
    address: "",
    pocname: "",
    intro: "",
    "company-contact": { countryCode: "", number: "" },
    "poc-contact": { countryCode: "", number: "" },
  });

  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState({
    error: null,
    success: null,
  });
  const [iswebcode, setWebcode] = useState("");
  const [fetchedData, setFetchedData] = useState({
    industries: [],
    countryCodes: countrycodes || [],
  });
  const [isUserStatus, setIsUserStatus] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [showRouteLoader, setShowRouteLoader] = useState(false);

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Fetch all necessary data in a single useEffect with optimized parallel requests
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);

      try {
        // Fetch user data to get webcode
        const userResponse = await fetch("/api/auth/user");
        const userData = await userResponse.json();
        const webcode = userData?.userData?.webcode || "";

        if (!webcode) {
          throw new Error("No webcode found");
        }

        setWebcode(webcode);

        // Make all API calls in parallel using Promise.all for optimal performance
        const [profileData, industryData, countryData] = await Promise.all([
          webcode ? GETPROFILE(webcode) : Promise.resolve(null),
          fetch(
            "https://tradetoppers.esoftideas.com/esi-api/responses/industry/"
          )
            .then((res) => res.json())
            .catch(() => ({ Industry: [] })),
          countrycodes.length === 0
            ? fetch(
                "https://tradetoppers.esoftideas.com/esi-api/responses/country/"
              )
                .then((res) => res.json())
                .catch(() => ({ Country: [] }))
            : { Country: countrycodes.map((code) => ({ code })) },
        ]);

        // console.log("Profile data:", profileData);
        const userstatus = profileData?.status;
        setIsUserStatus(userstatus);
        // Process industry data
        const industries = industryData?.Industry || [];

        // Process country codes
        const codes = countryData?.Country?.map((c) => c.code) || countrycodes;

        // Update fetched data state
        setFetchedData({
          industries,
          countryCodes: codes,
        });

        // Process profile data if available
        if (profileData) {
          const safeString = (str) => (str ? String(str).trim() : "");

          setFormData({
            name: safeString(profileData.name),
            email: safeString(profileData.email),
            company: safeString(profileData.company),
            country: safeString(profileData.country),
            industry: safeString(profileData.industry),
            designation: safeString(profileData.designation),
            address: safeString(profileData.caddress),
            pocname: safeString(profileData.pocname),
            intro: safeString(profileData.intro),
            "company-contact": {
              countryCode: safeString(profileData.ccode),
              number: safeString(profileData.ccontact),
            },
            "poc-contact": {
              countryCode: safeString(profileData.poccode),
              number: safeString(
                profileData.poccontact || profileData.pocontact
              ),
            },
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setSubmissionStatus({
          error: "Failed to load data. Please refresh and try again.",
          success: null,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [countrycodes]);

  // Handle the transition state
  useEffect(() => {
    if (!isPending && showRouteLoader) {
      // This effect will run when the transition completes
      const timer = setTimeout(() => {
        setShowRouteLoader(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isPending, showRouteLoader]);

  // Validation function for a single field (memoized)
  const validateField = useCallback((id, value) => {
    let error = "";

    // Skip validation for empty optional fields
    if (
      !value &&
      id !== "email" &&
      id !== "company-contact" &&
      id !== "poc-contact"
    ) {
      return error;
    }

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
  }, []);

  // Debounced input handler (memoized)
  const handleInputChange = useCallback(
    debounce((id, value) => {
      // Validate input
      const error = validateField(id, value);

      // Update errors state
      setErrors((prev) => {
        if (error) {
          return { ...prev, [id]: error };
        } else {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        }
      });
    }, 300),
    [validateField]
  );

  // Immediate input change handler for UI responsiveness
  const handleInputChangeImmediate = useCallback(
    (id, value) => {
      // Update form data immediately for responsive UI
      setFormData((prev) => {
        const updated = { ...prev };
        updated[id] = value;
        return updated;
      });

      // Call the debounced handler for validation
      handleInputChange(id, value);
    },
    [handleInputChange]
  );

  // Form validation logic (memoized)
  const validateForm = useCallback(() => {
    return new Promise((resolve) => {
      // Run validation in next tick to avoid blocking UI
      setTimeout(() => {
        const newErrors = {};
        let formIsValid = true;

        // Required fields validation
        const requiredFields = [
          "name",
          "email",
          "company",
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

        resolve({ formIsValid, newErrors });
      }, 0);
    });
  }, [formData]);

  // Form submission handler (memoized)
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Reset submission status
      setSubmissionStatus({
        error: null,
        success: null,
      });

      // Show loader
      setShowRouteLoader(true);

      try {
        // Validate form asynchronously
        const { formIsValid, newErrors } = await validateForm();
        setErrors(newErrors);

        if (!formIsValid) {
          setSubmissionStatus({
            error: "Please fix the errors before submitting",
            success: null,
          });
          setShowRouteLoader(false);
          return;
        }

        // Create FormData object for submission
        const profileData = new FormData();

        // Append all form fields
        profileData.append("code", iswebcode);
        profileData.append("name", formData.name);
        profileData.append("email", formData.email);
        profileData.append("company", formData.company);
        profileData.append("country", formData.country);
        profileData.append("industry", formData.industry);
        profileData.append("designation", formData.designation);
        profileData.append("caddress", formData.address);
        profileData.append("pocname", formData.pocname);
        profileData.append("intro", formData.intro);

        // Submit separate country code and contact number for company
        profileData.append("ccode", formData["company-contact"].countryCode);
        profileData.append("ccontact", formData["company-contact"].number);

        // Submit separate country code and contact number for POC
        profileData.append("poccode", formData["poc-contact"].countryCode);
        profileData.append("pocontact", formData["poc-contact"].number);

        // Submit the data
        const result = await POSTPROFILE(profileData);

        if (result && result.success) {
          setSubmissionStatus({
            error: null,
            success: "Profile updated successfully!",
          });
          // console.log("User status right above time out:", isUserStatus);
          if (isUserStatus == "Pending") {
            startTransition(() => {
              router.push("/dashboard/profile");
            });
          } else {
            // Navigate to dashboard after successful submission
            startTransition(() => {
              router.push("/dashboard");
            });
          }
        } else {
          setSubmissionStatus({
            error:
              result?.message || "Failed to update profile. Please try again.",
            success: null,
          });
          setShowRouteLoader(false);
        }
      } catch (error) {
        console.error("Error submitting profile:", error);
        setSubmissionStatus({
          error:
            "An error occurred while submitting the form. Please try again.",
          success: null,
        });
        setShowRouteLoader(false);
      }
    },
    [formData, iswebcode, router, startTransition, validateForm]
  );

  // Memoized select options generators
  const renderCountryOptions = useCallback(() => {
    if (countries && countries.length > 0) {
      return countries.map((country) => (
        <SelectItem key={country.country} value={country.country}>
          {country.country}
        </SelectItem>
      ));
    }
    return <SelectItem value="loading">Loading countries...</SelectItem>;
  }, [countries]);

  const renderIndustryOptions = useCallback(() => {
    if (fetchedData.industries && fetchedData.industries.length > 0) {
      return fetchedData.industries.map((industry) => (
        <SelectItem key={industry.industry} value={industry.industry}>
          {industry.industry}
        </SelectItem>
      ));
    }
    return <SelectItem value="loading">Loading industries...</SelectItem>;
  }, [fetchedData.industries]);

  const renderDesignationOptions = useCallback(() => {
    if (designations && designations.length > 0) {
      return designations.map((designation) => (
        <SelectItem
          key={designation.designation}
          value={designation.designation}
        >
          {designation.designation}
        </SelectItem>
      ));
    }
    return <SelectItem value="loading">Loading designations...</SelectItem>;
  }, [designations]);

  // Show loading indicator while fetching initial data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {showRouteLoader && <RouteTransitionLoader />}
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
              onChange={(e) =>
                handleInputChangeImmediate("name", e.target.value)
              }
              required
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
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
              onChange={(e) =>
                handleInputChangeImmediate("email", e.target.value)
              }
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
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
              value={formData["company"] || ""}
              onChange={(e) =>
                handleInputChangeImmediate("company", e.target.value)
              }
              required
            />
            {errors.company && (
              <p className="text-red-500 text-sm">{errors.company}</p>
            )}
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
              onChange={handleInputChangeImmediate}
              countryCodes={fetchedData.countryCodes}
            />
            {errors["company-contact"] && (
              <p className="text-red-500 text-sm">
                {errors["company-contact"]}
              </p>
            )}
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
              onChange={(e) =>
                handleInputChangeImmediate("address", e.target.value)
              }
              required
              maxLength={199}
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address}</p>
            )}
          </div>

          {/* Country */}
          <div className="grid gap-2">
            <Label htmlFor="country">
              Country <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData["country"] || ""}
              onValueChange={(value) =>
                handleInputChangeImmediate("country", value)
              }
              required
              name="country"
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>{renderCountryOptions()}</SelectContent>
            </Select>
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country}</p>
            )}
          </div>

          {/* Industry */}
          <div className="grid gap-2">
            <Label htmlFor="industry">
              Industry <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData["industry"] || ""}
              onValueChange={(value) =>
                handleInputChangeImmediate("industry", value)
              }
              required
              name="industry"
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>{renderIndustryOptions()}</SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-red-500 text-sm">{errors.industry}</p>
            )}
          </div>

          {/* Designation */}
          <div className="grid gap-2">
            <Label htmlFor="designation">
              Designation <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData["designation"] || ""}
              onValueChange={(value) =>
                handleInputChangeImmediate("designation", value)
              }
              required
              name="designation"
            >
              <SelectTrigger id="designation">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent>{renderDesignationOptions()}</SelectContent>
            </Select>
            {errors.designation && (
              <p className="text-red-500 text-sm">{errors.designation}</p>
            )}
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
              onChange={(e) =>
                handleInputChangeImmediate("pocname", e.target.value)
              }
              required
              maxLength={99}
            />
            {errors.pocname && (
              <p className="text-red-500 text-sm">{errors.pocname}</p>
            )}
          </div>

          {/* POC Contact */}
          <div className="grid gap-2">
            <Label htmlFor="poc-contact">
              POC Contact <span className="text-red-500">*</span>
            </Label>
            <ContactInput
              id="poc-contact"
              value={formData["poc-contact"]}
              onChange={handleInputChangeImmediate}
              countryCodes={fetchedData.countryCodes}
            />
            {errors["poc-contact"] && (
              <p className="text-red-500 text-sm">{errors["poc-contact"]}</p>
            )}
          </div>

          {/* Company Introduction */}
          <div className="grid gap-2">
            <Label htmlFor="intro">
              Company Introduction<span className="text-red-500">*</span>
            </Label>
            <textarea
              id="intro"
              value={formData["intro"] || ""}
              onChange={(e) =>
                handleInputChangeImmediate("intro", e.target.value)
              }
              className="h-28 border-gray-300 border-2 w-full p-2 resize-none rounded"
            />
            {errors.intro && (
              <p className="text-red-500 text-sm">{errors.intro}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between">
          {/* Save Profile */}
          <Button type="submit" className="w-fit">
            Save Profile
          </Button>

          {/* Update Profile */}
          <DeleteUser_Profile webcode={iswebcode} />
        </div>
        {submissionStatus.error && (
          <p className="text-red-500">{submissionStatus.error}</p>
        )}
        {submissionStatus.success && (
          <p className="text-green-500">{submissionStatus.success}</p>
        )}
      </form>
    </>
  );
}
