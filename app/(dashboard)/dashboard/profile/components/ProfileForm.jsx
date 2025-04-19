"use client";

import {
  useTransition,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
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
  industries = [], // We'll still accept this prop but won't use it
  designations = [],
  countrycodes = [], // Make sure this matches parent component
}) {
  // Consolidated state management
  const [state, setState] = useState({
    formData: {},
    errors: {},
    submissionError: null,
    submissionSuccess: null,
    iswebcode: "",
    countryCodes: countrycodes || [],
    fetchedIndustries: [],
    showRouteLoader: false,
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Extract values from state for readability
  const {
    formData,
    errors,
    submissionError,
    submissionSuccess,
    iswebcode,
    countryCodes,
    fetchedIndustries,
    showRouteLoader,
  } = state;

  // Memoized state updater functions
  const updateState = useCallback((updates) => {
    setState((prevState) => ({ ...prevState, ...updates }));
  }, []);

  const updateFormData = useCallback((updates) => {
    setState((prevState) => ({
      ...prevState,
      formData: { ...prevState.formData, ...updates },
    }));
  }, []);

  const updateErrors = useCallback((updates) => {
    setState((prevState) => ({
      ...prevState,
      errors: { ...prevState.errors, ...updates },
    }));
  }, []);

  // Fetch user data and set webcode only once
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/user");
        const data = await response.json();
        const webcode = data?.userData?.webcode;
        updateState({ iswebcode: webcode });
      } catch (error) {
        console.error("Error fetching user data:", error);
        updateState({
          submissionError:
            "Failed to fetch user data. Please refresh and try again.",
        });
      }
    };

    fetchUserData();
  }, [updateState]);

  // Fetch industry data directly from API
  useEffect(() => {
    const fetchIndustryData = async () => {
      try {
        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/industry/"
        );
        const data = await response.json();

        if (data && Array.isArray(data.Industry)) {
          updateState({ fetchedIndustries: data.Industry });
        } else {
          console.error("Unexpected industry data format:", data);
          // Fallback to prop data if available
          if (industries && industries.length > 0) {
            updateState({ fetchedIndustries: industries });
          }
        }
      } catch (error) {
        console.error("Error fetching industry data:", error);
        // Fallback to prop data if available
        if (industries && industries.length > 0) {
          updateState({ fetchedIndustries: industries });
        }
      }
    };

    fetchIndustryData();
  }, [industries, updateState]);

  // Once iswebcode is set, then fetch profile
  useEffect(() => {
    if (!iswebcode) return;

    const getdata = async () => {
      try {
        const getprofileData = await GETPROFILE(iswebcode);

        if (getprofileData) {
          // Create a helper function to safely process strings
          const safeString = (str) => (str ? String(str).trim() : "");

          updateFormData({
            name: safeString(getprofileData.name),
            email: safeString(getprofileData.email),
            company: safeString(getprofileData.company),
            country: safeString(getprofileData.country),
            industry: safeString(getprofileData.industry),
            designation: safeString(getprofileData.designation),
            address: safeString(getprofileData.caddress),
            pocname: safeString(getprofileData.pocname),
            intro: safeString(getprofileData.intro),
            "company-contact": {
              countryCode: safeString(getprofileData.ccode),
              number: safeString(getprofileData.ccontact),
            },
            "poc-contact": {
              countryCode: safeString(getprofileData.poccode),
              number: safeString(
                getprofileData.poccontact || getprofileData.pocontact
              ),
            },
          });
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        updateState({
          submissionError:
            "Failed to fetch profile data. Please refresh and try again.",
        });
      }
    };

    getdata();
  }, [iswebcode, updateFormData, updateState]);

  // Only fetch country codes if not provided via props
  useEffect(() => {
    // If we already have country codes from props, don't fetch again
    if (countrycodes && countrycodes.length > 0) {
      updateState({ countryCodes: countrycodes });
      return;
    }

    const fetchCountryCodes = async () => {
      try {
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/country/"
        );
        const data = await res.json();
        const codes = data.Country.map((c) => c.code);
        updateState({ countryCodes: codes });
      } catch (error) {
        console.error("Error fetching country codes:", error);
        updateState({
          submissionError:
            "Failed to fetch country codes. Some features may be limited.",
        });
      }
    };

    fetchCountryCodes();
  }, [countrycodes, updateState]);

  // Handle the transition state
  useEffect(() => {
    if (!isPending && showRouteLoader) {
      // This effect will run when the transition completes
      setTimeout(() => {
        updateState({ showRouteLoader: false });
      }, 500);
    }
  }, [isPending, showRouteLoader, updateState]);

  // Memoized validation function for each field
  const validateField = useCallback((id, value) => {
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
  }, []);

  // Handle input changes with memoization
  const handleInputChange = useCallback(
    (id, value) => {
      // Update form data
      setState((prevState) => {
        const newFormData = { ...prevState.formData };

        if (id === "document") {
          // Document handling logic would go here
          // Omitted for brevity as it wasn't being used
        } else {
          newFormData[id] = value;
        }

        // Validate and update errors in the same state update
        const error = validateField(id, value);
        const newErrors = { ...prevState.errors, [id]: error };

        return {
          ...prevState,
          formData: newFormData,
          errors: newErrors,
        };
      });
    },
    [validateField]
  );

  // Memoized validation for the whole form
  const validateForm = useCallback(() => {
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

    return { formIsValid, newErrors };
  }, [formData]);

  // Memoized form submission handler
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Reset submission status
      updateState({
        submissionError: null,
        submissionSuccess: null,
      });

      // Validate form
      const { formIsValid, newErrors } = validateForm();
      updateErrors(newErrors);

      if (!formIsValid) {
        updateState({
          submissionError: "Please fix the errors before submitting",
        });
        return;
      }

      updateState({ showRouteLoader: true });

      try {
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
          updateState({ submissionSuccess: "Profile updated successfully!" });

          // Navigate to dashboard after successful submission
          startTransition(() => {
            router.push("/dashboard");
          });
        } else {
          updateState({
            submissionError:
              result?.message || "Failed to update profile. Please try again.",
            showRouteLoader: false,
          });
        }
      } catch (error) {
        console.error("Error submitting profile:", error);
        updateState({
          submissionError:
            "An error occurred while submitting the form. Please try again.",
          showRouteLoader: false,
        });
      }
    },
    [
      formData,
      iswebcode,
      router,
      startTransition,
      updateErrors,
      updateState,
      validateForm,
    ]
  );

  // Memoize select options to prevent unnecessary recreations
  const countryOptions = useMemo(
    () =>
      countries && countries.length > 0 ? (
        countries.map((country) => (
          <SelectItem key={country.country} value={country.country}>
            {country.country}
          </SelectItem>
        ))
      ) : (
        <SelectItem value="loading">Loading countries...</SelectItem>
      ),
    [countries]
  );

  const industryOptions = useMemo(
    () =>
      fetchedIndustries && fetchedIndustries.length > 0 ? (
        fetchedIndustries.map((industry) => (
          <SelectItem key={industry.industry} value={industry.industry}>
            {industry.industry}
          </SelectItem>
        ))
      ) : (
        <SelectItem value="loading">Loading industries...</SelectItem>
      ),
    [fetchedIndustries]
  );

  const designationOptions = useMemo(
    () =>
      designations && designations.length > 0 ? (
        designations.map((designation) => (
          <SelectItem
            key={designation.designation}
            value={designation.designation}
          >
            {designation.designation}
          </SelectItem>
        ))
      ) : (
        <SelectItem value="loading">Loading designations...</SelectItem>
      ),
    [designations]
  );

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
              onChange={(e) => handleInputChange("name", e.target.value)}
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
              onChange={(e) => handleInputChange("email", e.target.value)}
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
              onChange={(e) => handleInputChange("company", e.target.value)}
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
              onChange={handleInputChange}
              countryCodes={countryCodes}
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
              onChange={(e) => handleInputChange("address", e.target.value)}
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
              onValueChange={(value) => handleInputChange("country", value)}
              required
              name="country"
            >
              <SelectTrigger id="country">
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>{countryOptions}</SelectContent>
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
              onValueChange={(value) => handleInputChange("industry", value)}
              required
              name="industry"
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent>{industryOptions}</SelectContent>
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
              onValueChange={(value) => handleInputChange("designation", value)}
              required
              name="designation"
            >
              <SelectTrigger id="designation">
                <SelectValue placeholder="Select Designation" />
              </SelectTrigger>
              <SelectContent>{designationOptions}</SelectContent>
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
              onChange={(e) => handleInputChange("pocname", e.target.value)}
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
              onChange={handleInputChange}
              countryCodes={countryCodes}
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
              onChange={(e) => handleInputChange("intro", e.target.value)}
              className="h-28 border-gray-300 border-2 w-full p-2 resize-none rounded"
            />
            {errors.intro && (
              <p className="text-red-500 text-sm">{errors.intro}</p>
            )}
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
