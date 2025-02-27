"use client";

import { Button } from "@/components/ui/button";
import { FileText, Shield, FileDown, Mail } from "lucide-react";
import QuoteCard from "./QuoteCard";
import { fonts } from "@/components/ui/font";

export default function ProductDetails({ productdata }) {
  // Use the first product if available (the array will usually contain just one item)
  const singleproduct =
    productdata && productdata.length > 0 ? productdata[0] : null;

  // console.log("Single product data :", singleproduct);

  if (!singleproduct) {
    return <div>No product data available</div>;
  }

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb Navigation */}

      {/* Product Title */}
      <h1 className={`text-3xl ${fonts.montserrat} font-semibold`}>
        {singleproduct.product}
      </h1>

      {/* Main layout container */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column (Product details) */}
        <div className="flex-1 p-4 space-y-8">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="gap-2 font-semibold text-lg hover:scale-105 transition-all"
            >
              <FileText size={25} className="text-blue-600" />
              Technical Data Sheet
            </Button>
            <Button
              variant="outline"
              className="gap-2 font-semibold text-lg hover:scale-105 transition-all"
            >
              <Shield className="w-4 h-4 text-red-600" />
              Safety Data Sheet
            </Button>
            <Button
              variant="outline"
              className="gap-2 font-semibold text-lg hover:scale-105 transition-all"
            >
              <FileDown className="w-4 h-4" />
              Request Document
            </Button>
            <Button
              variant="outline"
              className="gap-2 font-semibold text-lg hover:scale-105 transition-all"
            >
              <Mail className="w-4 h-4" />
              General Inquiry
            </Button>
          </div>

          {/* Product Description */}
          <div>
            <p className={`text-lg ${fonts.montserrat} text-muted-foreground`}>
              {singleproduct.description}
            </p>

            {/* Static Product Details */}
            <div className="space-y-4 mt-4">
              <div>
                <h2 className={`text-lg ${fonts.montserrat} font-semibold`}>
                  Functions:
                </h2>
                <p className={`${fonts.montserrat}`}>Bioenhancer</p>
              </div>

              <div>
                <h2 className={`text-lg ${fonts.montserrat} font-semibold`}>
                  Application Technique:
                </h2>
                <p className={`${fonts.montserrat}`}>
                  Foliage Applied, Pre-Emergence
                </p>
              </div>

              <div>
                <h2 className={`text-lg ${fonts.montserrat} font-semibold`}>
                  Features:
                </h2>
                <ul className={`list-disc ${fonts.montserrat} pl-6 space-y-1`}>
                  <li>Enhanced Crop Yield & Quality</li>
                  <li>Excellent Vigor</li>
                  <li>Good Compatibility</li>
                  <li>Improves Nutrients Utilization</li>
                  <li>Increased Disease Suppression</li>
                  <li>Increased Fertilizer Retention</li>
                  <li>Supports Beneficial Soil Biology</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Product Information - Mapping all dynamic backend fields */}
          <div className="space-y-4">
            <h2 className={`text-lg ${fonts.montserrat} font-semibold`}>
              Additional Product Information
            </h2>
            <ul className={`list-disc ${fonts.montserrat} pl-6 space-y-1`}>
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
                  <strong>Chemical:</strong> {singleproduct.chemical}
                </li>
              )}
              {singleproduct.cas && (
                <li>
                  <strong>CAS:</strong> {singleproduct.cas}
                </li>
              )}
              {singleproduct.cinum && (
                <li>
                  <strong>CINum:</strong> {singleproduct.cinum}
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
