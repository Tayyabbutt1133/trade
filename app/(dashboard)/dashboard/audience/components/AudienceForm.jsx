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

export function AudienceForm({ countries = [], industries = [], regions = [] }) {
  const [formData, setFormData] = useState({});
  const [analytics, setAnalytics] = useState({
    totalAudience: 0,
    averageAge: 0,
    topIndustries: [],
    genderDistribution: { male: 0, female: 0, other: 0 },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Define your dynamic form fields.
  const dynamicFormFields = [
    {
      id: "title",
      label: "Title",
      name: "Title",
      type: "text",
      required: true,
    },
    {
      id: "recipient-type",
      name: "rtype",
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
      id: "industry",
      name: "industry",
      label: "Industry",
      type: "select",
      options: industries,
      required: true,
      optionKey: "industry",
    },
    {
      id: "region",
      name: "region",
      label: "Region",
      type: "select",
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
  ];

  /**
   * updateAnalytics
   * Builds the payload using the current formData (using null for any missing value)
   * and calls the DEMO API. The API returns the count based on the filters passed,
   * and we update the analytics accordingly.
   */
  const updateAnalytics = async (newData) => {
    // Build the payload using provided values or null if not provided.
    const payload = {
      rtype: newData["recipient-type"] || null,
      country: newData["origin-country"] || null,
      industry: newData["industry"] || null,
      region: newData["region"] || null,
      tag: newData["tagging"] || null,
    };

    try {
      // Call the DEMO API with the payload.
      const response = await DEMO(JSON.stringify(payload));
      if (response.success) {
        // Update the total audience count with the returned value.
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

    if (["recipient-type", "origin-country", "industry", "region", "tagging"].includes(id)) {
      await updateAnalytics(updatedData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reset messages before every attempt
    setErrorMessage("");
    setSuccessMessage("");
  
    console.log("Form submitted with data:", formData);
    console.log("Final analytics:", analytics);
  
    try {
      // Mapping formData keys to API expected keys
      const mappedData = {
        rtype: formData["recipient-type"] || null,
        country: formData["origin-country"] || null,
        industry: formData["industry"] || null,
        region: formData["region"] || null,
        tag: formData["tagging"] || null,
        title: formData["title"] || null, // Keep other fields as is
      };
  
      // Create FormData and append mapped values
      const formPayload = new FormData();
      Object.entries(mappedData).forEach(([key, value]) => {
        if (value !== null) {
          formPayload.append(key, value);
        }
      });
  
      const response = await CREATEAUDIENCE(formPayload);
  
      if (response.ok) {
        setSuccessMessage("Successfully submitted");
      } else {
        setErrorMessage(response.message || "Submission failed. Please try again.");
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
            ) : (
              <Input
                  id={field.id}
                  name={field.name}
                type={field.type}
                required={field.required}
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
