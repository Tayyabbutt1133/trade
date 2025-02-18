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
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Static options for fields that aren't dynamic
const recipientTypes = ["Seller", "Buyer", "Both"];
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
  // Local state for form data and analytics
  const [formData, setFormData] = useState({});
  const [analytics, setAnalytics] = useState({
    totalAudience: 0,
    averageAge: 0,
    topIndustries: [],
    genderDistribution: { male: 0, female: 0, other: 0 },
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // It is getting audienceID, either new or already created audienceID
  const params = useParams();
  useEffect(() => {
    console.log("Audience id:", params);
  }, [params]);


  // Define dynamic form fields
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
    {
      id: "status",
      name: "status",
      label: "Status",
      type: "select",
      required: true,
      options: statusOptions,
    },
  ];

  const getTaggingOptions = () => {
    const recipient = formData["recipient-type"];

    if (recipient === "Seller") {
      return buyers
        .filter((b) => b.bname?.trim())
        .map((b) => ({ id: b.id, name: b.bname }));
    } else if (recipient === "Buyer") {
      return sellers
        .filter((s) => s.sname?.trim())
        .map((s) => ({ id: s.id, name: s.sname }));
    } else if (recipient === "Both") {
      const buyerOptions = buyers
        .filter((b) => b.bname?.trim())
        .map((b) => ({ id: `buyer-${b.id}`, name: b.bname }));
      const sellerOptions = sellers
        .filter((s) => s.sname?.trim())
        .map((s) => ({ id: `seller-${s.id}`, name: s.sname }));
      return [...buyerOptions, ...sellerOptions];
    } else {
      return taggings.map((tag, index) => ({
        id: `tag-${index}`,
        name: tag,
      }));
    }
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // creating form by getting values
      const formData = new FormData(e.target);
      
      if (params?.audienceId == "new") {
        formData.append("mode", formData.mode || "New"); 
      }
      const response = await CREATEAUDIENCE(formData);
      // console.log("Form data:");
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      if (response.success) {
        setSuccessMessage("Successfully submitted");
        router.push("/dashboard/audience")
      } else {
        setErrorMessage(
          response.error || "Submission failed. Please try again."
        );
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again later.");
      console.error("Submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4">
        {dynamicFormFields.map((field) => {
          const options =
            field.id === "tagging" ? getTaggingOptions() : field.options;

          return (
            <div key={field.id} className="grid gap-2">
              <Label htmlFor={field.id}>
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </Label>
              {field.type === "select" ? (
                <>
                  <Select
                    onValueChange={(value) =>
                      handleInputChange(field.id, value)
                    }
                    required={field.required}
                  >
                    <SelectTrigger id={field.id}>
                      <SelectValue placeholder={`Select ${field.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {options && options.length > 0 ? (
                        options.map((option, index) => {
                          const display = field.optionKey
                            ? option[field.optionKey]
                            : option.name || option;
                          const key = option.id || display || index;
                          return (
                            <SelectItem key={key} value={display}>
                              {display}
                            </SelectItem>
                          );
                        })
                      ) : (
                        <SelectItem disabled>No options available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
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
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden input for mode when creating new audience */}
      {params?.id === "new" && <input type="hidden" name="mode" value="New" />}

      {/* Analytics Display */}
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
