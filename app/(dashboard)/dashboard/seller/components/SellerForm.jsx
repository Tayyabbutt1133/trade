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
import { createSeller } from "@/app/actions/createSeller";
import { GETSELLER } from "@/app/actions/getseller";
import { useParams, useRouter } from "next/navigation";

// Static options for the status field.
const statusOptions = ["Active", "Inactive"];

export function SellerForm({
  countries = [],
  industries = [],
  designations = [],
}) {
  const [formData, setFormData] = useState({
    "seller-company-contact": { countryCode: "", number: "" },
    "poc-contact": { countryCode: "", number: "" },
  });
  const [errors, setErrors] = useState({});
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);
  const [countryCodes, setCountryCodes] = useState([]);

  const params = useParams();
  const router = useRouter();

  // Fetch country codes
  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/country/"
        );
        const data = await res.json();
        const codes = data.Country.map((c) => c.code);
        setCountryCodes(codes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    };

    fetchCountryCodes();
  }, []);

  // In edit mode (when sellerId exists and is not "new"), fetch the existing seller data.
  useEffect(() => {
    if (params?.sellerId && params.sellerId !== "new") {
      async function fetchSeller() {
        try {
          const response = await GETSELLER({ id: params.sellerId });
          console.log("Response from get seller:", response);

          if (response.success && response.seller) {
            // Handle the seller data properly based on the API response structure
            const sellerData = response.seller;

            // Set appropriate status based on what's coming from the API
            let statusValue = "Inactive";
            if (sellerData.status === "Approved") {
              statusValue = "Active";
            }

            // Set form data properly
            setFormData({
              sellername: sellerData.name || "",
              email: sellerData.email || "",
              company: sellerData.company || "",
              "seller-company-contact": {
                countryCode: sellerData.ccode || "",
                number: sellerData.ccontact || "",
              },
              address: sellerData.caddress || "",
              country: sellerData.country?.trim() || "",
              industry: sellerData.industry || "",
              designation: sellerData.designation || "",
              pocname: sellerData.pocname || "",
              "poc-contact": {
                countryCode: sellerData.poccode || "",
                number: sellerData.poccontact || "",
              },
              status: statusValue,
              blocked: sellerData.status?.toLowerCase() === "blocked",
            });
          }
        } catch (error) {
          console.error("Error fetching seller data:", error);
          setSubmissionError("Failed to load seller data");
        }
      }
      fetchSeller();
    }
  }, [params?.sellerId]);

  // Handle input changes - now only for status field
  const handleInputChange = (id, value) => {
    // Only allow status changes, ignore other fields
    if (id === "status") {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // Handle form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // No need to validate other fields as they're read-only
    if (!formData.status) {
      setSubmissionError("Please select a status");
      return;
    }

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

    const result = await createSeller(formDataToSubmit);

    if (result.success) {
      setSubmissionSuccess(result.message);
      setSubmissionError(null);
      router.push("/dashboard/seller");
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
