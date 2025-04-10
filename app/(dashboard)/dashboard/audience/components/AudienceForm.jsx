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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO } from "@/app/actions/demographics";
import { CREATEAUDIENCE } from "@/app/actions/createAudience";
import { GETAUDIENCE } from "@/app/actions/getaudience";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

// Static options for fields that aren't dynamic
const recipientTypes = [
  "Buyer",
  "Industrial Manufacturer",
  "Trading Companies",
];
const taggings = ["Premium", "New", "Verified", "Partner", "High Volume"];
const statusOptions = ["Active", "Inactive"];

export function AudienceForm({
  countries = [],
  industries = [],
  regions = [],
  designation = [],
  sellers = [],
  buyers = [],
}) {
  const [formData, setFormData] = useState({});
  const [analytics, setAnalytics] = useState({
    totalAudience: 0,
    averageAge: 0,
    topIndustries: [],
    genderDistribution: { male: 0, female: 0, other: 0 },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ShowRouteLoader, setShowRouteLoader] = useState(false);
  const router = useRouter();
  const params = useParams();

  // Log params for debugging
  // useEffect(() => {
  //   console.log("Audience id:", params.audienceId);
  // }, [params]);

  // In edit mode, call GETAUDIENCE to fetch existing audience data
  useEffect(() => {
    if (params?.audienceId && params.audienceId !== "new") {
      async function fetchAudience() {
        try {
          // Pass an object with the id instead of a raw id
          const response = await GETAUDIENCE({ id: params.audienceId });
          console.log("Response from get audience:", response);
          if (response.success && response.audience) {
            const audienceData = response.audience;
            // Map returned keys to formData
            setFormData({
              title: audienceData.title || "",
              "recipient-type": audienceData.atype || "",
              "origin-country": audienceData.country || "",
              designation: audienceData.designation || "",
              industry: audienceData.industry || "",
              region: audienceData.region || "",
              tagging: audienceData.tag || "",
              status: audienceData.status === "True" ? "Active" : "Inactive",
            });
          }
        } catch (error) {
          console.error("Error fetching audience data:", error);
          setErrorMessage("Failed to load audience data");
        }
      }
      fetchAudience();
    }
  }, [params?.audienceId]);

  const dynamicFormFields = [
    {
      id: "title",
      label: "Title",
      name: "title",
      type: "text",
      required: true,
    },
    {
      id: "recipient-type",
      name: "atype",
      label: "Recipient",
      type: "select",
      options: recipientTypes,
      required: true,
    },
    {
      id: "origin-country",
      name: "country",
      type: "select",
      label: "Country",
      options: countries,
      required: true,
      optionKey: "country",
    },
    {
      id: "designation",
      name: "designation",
      type: "select",
      label: "Designation",
      options: designation,
      required: true,
      optionKey: "designation",
    },
    {
      id: "industry",
      name: "industry",
      type: "select",
      label: "Industry",
      options: industries,
      required: true,
      optionKey: "industry",
    },
    {
      id: "region",
      name: "region",
      type: "select",
      label: "Region",
      options: regions,
      required: true,
      optionKey: "region",
    },
    {
      id: "tagging",
      label: "Tag",
      name: "tag",
      type: "select",
      options: taggings,
      required: false,
    },
    {
      id: "status",
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      options: statusOptions,
    },
  ];

  // Returns dynamic options for the tagging field based on selected recipient
  const getTaggingOptions = () => {
    const seen = new Set();
    const addIfUnique = (list, idPrefix = "", nameKey = "") =>
      list
        .filter((item) => item[nameKey]?.trim())
        .map((item) => {
          const name = item[nameKey];
          const id = `${idPrefix}${item.id}`;
          if (!seen.has(name)) {
            seen.add(name);
            return { id, name };
          }
          return null;
        })
        .filter(Boolean); // remove nulls

    const recipient = formData["recipient-type"];

    if (recipient === "Buyer") {
      return addIfUnique(buyers, "buyer-", "bname");
    } else if (recipient === "Industrial Manufacturer") {
      return addIfUnique(sellers, "manufacturer-", "sname");
    } else if (recipient === "Trading Companies") {
      const buyerTags = addIfUnique(buyers, "buyer-", "bname");
      const manufacturerTags = addIfUnique(sellers, "manufacturer-", "sname");

      const combined = [...buyerTags, ...manufacturerTags];

      // remove duplicates by name
      const seenNames = new Set();
      return combined.filter(({ name }) => {
        if (seenNames.has(name)) return false;
        seenNames.add(name);
        return true;
      });
    }

    return [];
  };

  const updateAnalytics = async (newData) => {
    const payload = {
      rtype: newData["recipient-type"] || null,
      country: newData["origin-country"] || null,
      industry: newData["industry"] || null,
      region: newData["region"] || null,
      tag: newData["tagging"] || null,
    };

    try {
      const response = await DEMO(JSON.stringify(payload));
      console.log("Response from server:", response);
      if (response.success) {
        setAnalytics((prev) => ({
          ...prev,
          totalAudience: response.count,
        }));
      } else {
        console.error("Error updating analytics:", response.error);
      }
    } catch (error) {
      console.error("Error calling API:", error);
    }
  };

  const handleInputChange = async (id, value) => {
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);
    if (
      [
        "recipient-type",
        "origin-country",
        "industry",
        "region",
        "tagging",
      ].includes(id)
    ) {
      await updateAnalytics(updatedData);
    }
  };

  // Validate form data before submitting
  const validateForm = () => {
    for (let field of dynamicFormFields) {
      if (field.required && !formData[field.id]) {
        return `${field.label} is required.`;
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setShowRouteLoader(true);
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }


    try {
      const formDataObj = new FormData(e.target);

      // Append mode and id based on whether this is a new audience or an edit.
      if (params?.audienceId && params.audienceId !== "new") {
        formDataObj.append("mode", "Edit");
        formDataObj.append("id", params.audienceId);
      } else {
        formDataObj.append("mode", "New");
      }

      const response = await CREATEAUDIENCE(formDataObj);

      if (response.success) {
        setSuccessMessage("Successfully submitted");
      } else {
        setErrorMessage(
          response.error || "Submission failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
      setShowRouteLoader(false); // also turn off on error
      console.error("Submission error:", error);
    } finally {
      setTimeout(() => {
        router.push("/dashboard/audience");
      }, 8000);
    }
  };

  return (
    <>
      {ShowRouteLoader && <RouteTransitionLoader/>}
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4">
        {dynamicFormFields.map((field) => {
          // For "tagging", disable it in edit mode
          const isDisabled =
            field.id === "tagging" &&
            params?.audienceId &&
            params.audienceId !== "new";
          const options =
            field.id === "tagging" ? getTaggingOptions() : field.options;
          const fieldValue = formData[field.id] || "";

          return (
            <div key={field.id} className="grid gap-2">
              <Label htmlFor={field.id}>
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              {field.type === "select" ? (
                <>
                  <Select
                    value={fieldValue}
                    onValueChange={(value) =>
                      handleInputChange(field.id, value)
                    }
                    required={field.required}
                    disabled={isDisabled}
                  >
                    <SelectTrigger id={field.id}>
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {options && options.length > 0 ? (
                        options.map((option) => {
                          // Ensure `option.id` or `option.name` is unique
                          const display = field.optionKey
                            ? option[field.optionKey]
                            : option.name || option;
                          const key = option.id || display; // Ensure a unique key from option.id or option.name

                          return (
                            <SelectItem key={key} value={display}>
                              {display}
                            </SelectItem>
                          );
                        })
                      ) : (
                        <SelectItem disabled>Nothing available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {/* Hidden input to ensure the value gets submitted */}
                  <input type="hidden" name={field.name} value={fieldValue} />
                </>
              ) : (
                <Input
                  id={field.id}
                  name={field.name}
                  type={field.type}
                  required={field.required}
                  value={fieldValue}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Total demographic audiences */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Audience
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalAudience.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button className="w-fit" type="submit">
        {params?.audienceId && params.audienceId !== "new"
          ? "Update Audience"
          : "Create Audience"}
      </Button>

      {/* Message show on either success or failed api response */}
      {successMessage && (
        <div className="text-green-600 text-center mt-4">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="text-red-600 text-center mt-4">{errorMessage}</div>
      )}
      </form>
      </>
  );
}
