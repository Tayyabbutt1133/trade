"use client";

import { useState, useEffect } from "react";
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
import { createBuyer } from "@/app/actions/createBuyer";
import { GETBUYER } from "@/app/actions/getbuyer";
import { useParams, useRouter } from "next/navigation";

// Static options for the status field.
const statusOptions = ["Active", "Inactive"];

export function BuyerForm({
  countries = [],
  industries = [],
  codes = [],
  designations = [],
}) {
  const [formData, setFormData] = useState({
    "seller-company-contact": { countryCode: "", number: "" },
    "poc-contact": { countryCode: "", number: "" },
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
            // Handle the Buyer data properly based on the API response structure
            const buyerData = response.buyer;

            // Set appropriate status based on what's coming from the API
            let statusValue = "Inactive";
            if (buyerData.status === "Approved") {
              statusValue = "Active";
            }

            // Set form data properly
            setFormData({
              sellername: buyerData.name || "",
              email: buyerData.email || "",
              company: buyerData.company || "",
              "seller-company-contact": {
                countryCode: buyerData.ccode || "",
                number: buyerData.ccontact || "",
              },
              address: buyerData.caddress || "",
              country: buyerData.country?.trim() || "",
              industry: buyerData.industry || "",
              designation: buyerData.designation || "",
              pocname: buyerData.pocname || "",
              "poc-contact": {
                countryCode: buyerData.poccode || "",
                number: buyerData.poccontact || "",
              },
              status: statusValue,
              blocked: buyerData.status?.toLowerCase() === "blocked",
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
          document: `The following files exceed the 3MB limit: ${invalidFiles.join(
            ", "
          )}`,
        }));
      } else {
        setErrors((prev) => ({ ...prev, document: "" }));
      }
      setFormData((prev) => ({
        ...prev,
        document: [...(prev.document || []), ...base64Files],
      }));
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
    // Append all form fields (including read-only fields)
    formDataToSubmit.append("sellername", formData.sellername || "");
    formDataToSubmit.append("email", formData.email || "");
    formDataToSubmit.append("company", formData.company || "");
    formDataToSubmit.append("address", formData.address || "");
    formDataToSubmit.append("country", formData.country || "");
    formDataToSubmit.append("industry", formData.industry || "");
    formDataToSubmit.append("designation", formData.designation || "");
    formDataToSubmit.append("pocname", formData.pocname || "");

    // Append the company contact details separately
    formDataToSubmit.append(
      "ccode",
      formData["seller-company-contact"].countryCode || ""
    );
    formDataToSubmit.append(
      "ccontact",
      formData["seller-company-contact"].number || ""
    );

    // Append the POC contact details separately
    formDataToSubmit.append(
      "poccode",
      formData["poc-contact"].countryCode || ""
    );
    formDataToSubmit.append("pocontact", formData["poc-contact"].number || "");

    // Status is the only editable field
    formDataToSubmit.append("status", formData.status || "");
    // Convert the blocked boolean back to the string the API expects.
    formDataToSubmit.append(
      "blocked",
      formData.blocked ? "Blocked" : "Pending"
    );

    // If in edit mode, pass the seller id from params as regid.
    if (params?.sellerId && params.sellerId !== "new") {
      formDataToSubmit.append("regid", params.sellerId);
      formDataToSubmit.append("mode", "Edit");
    } else {
      formDataToSubmit.append("regid", 0);
      formDataToSubmit.append("mode", "New");
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
        {/* Seller Name - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="seller-name">Name</Label>
          <Input
            id="seller-name"
            name="sellername"
            type="text"
            value={formData.sellername || ""}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* Seller Email - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="seller-email">Email</Label>
          <Input
            id="seller-email"
            name="email"
            type="email"
            value={formData.email || ""}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* Company Name - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            name="company"
            type="text"
            value={formData.company || ""}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* Company Contact - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="seller-company-contact">Company Contact</Label>
          <div className="flex gap-2">
            <div className="w-24 bg-gray-100 border rounded p-2 text-sm">
              {formData["seller-company-contact"]?.countryCode || ""}
            </div>
            <div className="flex-1 bg-gray-100 border rounded p-2 text-sm">
              {formData["seller-company-contact"]?.number || ""}
            </div>
          </div>
        </div>

        {/* Address - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="seller-address">Address</Label>
          <Textarea
            id="seller-address"
            name="address"
            value={formData.address || ""}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* Country - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="seller-country">Country</Label>
          <Input
            id="seller-country-display"
            type="text"
            value={formData.country || ""}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* Industry - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="seller-industry">Industry</Label>
          <Input
            id="seller-industry-display"
            type="text"
            value={formData.industry || ""}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* Designation - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="seller-designation">Designation</Label>
          <Input
            id="seller-designation-display"
            type="text"
            value={formData.designation || ""}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* POC Name - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="poc-name">POC Name</Label>
          <Input
            id="poc-name"
            name="pocname"
            type="text"
            value={formData.pocname || ""}
            disabled
            className="bg-gray-100"
          />
        </div>

        {/* POC Contact - Read-only */}
        <div className="grid gap-2">
          <Label htmlFor="poc-contact">POC Contact</Label>
          <div className="flex gap-2">
            <div className="w-24 bg-gray-100 border rounded p-2 text-sm">
              {formData["poc-contact"]?.countryCode || ""}
            </div>
            <div className="flex-1 bg-gray-100 border rounded p-2 text-sm">
              {formData["poc-contact"]?.number || ""}
            </div>
          </div>
        </div>

        {/* Status - Editable */}
        <div className="grid gap-2">
          <Label htmlFor="status">
            Status <span className="text-red-500">*</span>
          </Label>
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
        Update Status
      </Button>
      {submissionError && <p className="text-red-500">{submissionError}</p>}
      {submissionSuccess && (
        <p className="text-green-500">{submissionSuccess}</p>
      )}
    </form>
  );
}
