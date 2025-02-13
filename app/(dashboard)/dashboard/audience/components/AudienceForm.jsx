"use client";

import { useState } from "react";
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

// Static options for fields that aren't dynamic
const recipientTypes = ["Seller", "Buyer", "Both"];
const taggings = ["Premium", "New", "Verified", "Partner", "High Volume"];
const statusOptions = ["Active", "Inactive"];

export function AudienceForm({ countries = [], industries = [], regions = [], designation = [] }) {
  // We still keep local state for analytics and to update the form values for our custom selects.
  const [formData, setFormData] = useState({});
  const [analytics, setAnalytics] = useState({
    totalAudience: 0,
    averageAge: 0,
    topIndustries: [],
    genderDistribution: { male: 0, female: 0, other: 0 },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Define your dynamic form fields with names that match your API keys.
  const dynamicFormFields = [
    {
      id: "title",
      label: "Title",
      name: "title", // API key: title
      type: "text",
      required: true,
    },
    {
      id: "recipient-type",
      name: "atype", // API expects "atype"
      label: "Recipient",
      type: "select",
      options: recipientTypes,
      required: true,
    },
    {
      id: "origin-country",
      name: "country", // API expects "country"
      type: "select",
      label: "Country",
      options: countries,
      required: true,
      optionKey: "country",
    },
    {
      id: "designation",
      name: "designation", // API expects "designation"
      type: "select",
      label: "Designation",
      options: designation,
      required: true,
      optionKey: "designation",
    },
    {
      id: "industry",
      name: "industry", // API expects "industry"
      label: "Industry",
      type: "select",
      options: industries,
      required: true,
      optionKey: "industry",
    },
    {
      id: "region",
      name: "region", // API expects "region"
      label: "Region",
      type: "select",
      options: regions,
      required: true,
      optionKey: "region",
    },
    {
      id: "tagging",
      label: "Tag",
      name: "tag", // API expects "tag"
      type: "select",
      options: taggings,
      required: false,
    },
    {
      id: "status",
      name: "status", // API expects "status"
      label: "Status",
      type: "select",
      required: true,
      options: statusOptions,
    },
  ];

  // Update analytics when certain fields change.
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
      console.log("Response from server :", response);
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

  // We update local state when a field changes.
  const handleInputChange = async (id, value) => {
    const updatedData = { ...formData, [id]: value };
    setFormData(updatedData);

    if (["recipient-type", "origin-country", "industry", "region", "tagging"].includes(id)) {
      await updateAnalytics(updatedData);
    }
  };

  // On form submission, we rely on the browser’s FormData API.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Log the form submission (optional)
    console.log("Form submitted with local state data:", formData);
    console.log("Final analytics:", analytics);

    try {
      // Create a FormData object directly from the form element.
      // Note that hidden inputs (see below) ensure custom select values are included.
      const formPayload = new FormData(e.target);

      const response = await CREATEAUDIENCE(formPayload);
      console.log("Response from server:", response);
      if (response.success) {
        setSuccessMessage("Successfully submitted");
      } else {
        setErrorMessage(response.error || "Submission failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
      console.error("Submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4">
        {dynamicFormFields.map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.type === "select" ? (
              <>
                <Select
                  onValueChange={(value) => handleInputChange(field.id, value)}
                  required={field.required}
                >
                  <SelectTrigger id={field.id}>
                    <SelectValue placeholder={`Select ${field.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options && field.options.length > 0 ? (
                      field.options.map((option) => {
                        const display = field.optionKey ? option[field.optionKey] : option;
                        return (
                          <SelectItem key={display} value={display}>
                            {display}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem disabled>No options available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {/* Hidden input to ensure the selected value is included in FormData */}
                <input
                  type="hidden"
                  name={field.name}
                  value={formData[field.id] || ""}
                />
              </>
            ) : (
              <Input
                id={field.id}
                name={field.name}
                type={field.type}
                required={field.required}
                // You may omit the value prop here so the browser handles it natively.
                onChange={(e) => handleInputChange(field.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Analytics Display */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.totalAudience.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Button className="w-fit" type="submit">
        Create Audience
      </Button>

      {/* Display success or error messages */}
      {successMessage && (
        <div className="text-green-600 text-center mt-4">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="text-red-600 text-center mt-4">{errorMessage}</div>
      )}
    </form>
  );
}
