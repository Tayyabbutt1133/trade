"use client";

import { Button } from "@/components/ui/button";
import { FileText, Shield } from "lucide-react";
import QuoteCard from "./QuoteCard";
import { fonts } from "@/components/ui/font";

export default function ProductDetails({ productdata }) {
  // Use the first product if available (the array will usually contain just one item)
  const singleproduct =
    productdata && productdata.length > 0 ? productdata[0] : null;

  console.log("Product data in details :",productdata);

  // Picking up array of docs from single product
  const docs = singleproduct?.docs || [];
  // Extract the doc with filetype "SDS" and "TDS"
  const sdsDoc = docs.find((doc) => doc.filetype === "SDS");
  const tdsDoc = docs.find((doc) => doc.filetype === "TDS");

  if (!singleproduct) {
    return <div>No product data available</div>;
  }

  // Sanitize product name: Replace dashes and special characters with spaces
  const sanitizedProductName = singleproduct.product
    ?.replace(/-/g, " ") // Replace dashes with spaces
    .replace(/[^\w\s]/g, "") // Remove special characters
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim(); // Trim leading/trailing spaces

  return (
    <div className="p-6 space-y-8">
      {/* Product Title */}
      <h1 className={`text-3xl ${fonts.montserrat} font-semibold`}>
        {sanitizedProductName}
      </h1>

      {/* Main layout container */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column (Product details) */}
        <div className="flex-1 p-4 space-y-8">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* TDS Button */}
            <Button
              variant="outline"
              className="gap-2 font-semibold text-lg hover:scale-105 transition-all"
              // Disable the button if we don't have a TDS doc
              disabled={!tdsDoc}
              onClick={() => {
                if (tdsDoc) {
                  // Open TDS path in a new tab
                  window.open(tdsDoc.path, "_blank");
                }
              }}
            >
              <FileText size={25} className="text-blue-600" />
              Technical Data Sheet
            </Button>

            {/* SDS Button */}
            <Button
              variant="outline"
              className="gap-2 font-semibold text-lg hover:scale-105 transition-all"
              // Disable the button if we don't have an SDS doc
              disabled={!sdsDoc}
              onClick={() => {
                if (sdsDoc) {
                  // Open SDS path in a new tab
                  window.open(sdsDoc.path, "_blank");
                }
              }}
            >
              <Shield className="w-4 h-4 text-red-600" />
              Safety Data Sheet
            </Button>
          </div>

          {/* Product Description */}
          <div>
            <p className={`text-lg ${fonts.montserrat} text-muted-foreground`}>
              {singleproduct.description}
            </p>
          </div>

          {/* Additional Product Information */}
          <div className="space-y-4">
            <h2 className={`text-lg ${fonts.montserrat} font-semibold`}>
              Product Information
            </h2>
            <ul
              className={`list-disc ${fonts.montserrat} list-none pl-6 space-y-1`}
            >
              {singleproduct.code && (
                <li>
                  <strong>Code:</strong> {singleproduct.code}
                </li>
              )}
              {singleproduct.formula && (
                <li>
                  <strong>Formula:</strong> {singleproduct.formula}
                </li>
              )}
              {singleproduct.brand && (
                <li>
                  <strong>Brand:</strong> {singleproduct.brand}
                </li>
              )}
              {singleproduct.category && (
                <li>
                  <strong>Category:</strong> {singleproduct.category}
                </li>
              )}
              {singleproduct.maincategory && (
                <li>
                  <strong>Main Category:</strong> {singleproduct.maincategory}
                </li>
              )}
              {singleproduct.subcategory && (
                <li>
                  <strong>Subcategory:</strong> {singleproduct.subcategory}
                </li>
              )}
              {singleproduct.chemical && (
                <li>
                  <strong>Applications:</strong> {singleproduct.chemical}
                </li>
              )}
              {singleproduct.cas && (
                <li>
                  <strong>CAS:</strong> {singleproduct.cas}
                </li>
              )}
              {singleproduct.cinum && (
                <li>
                  <strong>CI-Num:</strong> {singleproduct.cinum}
                </li>
              )}
              {singleproduct.status && (
                <li>
                  <strong>Status:</strong> {singleproduct.status}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Right column (QuoteCard) - Hidden below 1024px */}
        <div className="w-full md:w-1/3 max-w-md hidden lg:block">
          <QuoteCard />
        </div>
      </div>
    </div>
  );
}
