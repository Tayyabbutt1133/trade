"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { FileText, Shield, FileDown, Mail, ChevronDown } from "lucide-react";
import QuoteCard from "./QuoteCard";
import { fonts } from "@/components/ui/font";

export default function ProductDetails({ producttitle, storefront, brand }) {

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb Navigation */}
      <Breadcrumb className="flex items-center gap-2 list-none">
        {/* breadcrumb route 1 */}
        <BreadcrumbItem>
          <div className="flex flex-col">
            <BreadcrumbLink
              href="#"
              className={`text-sm ${fonts.montserrat} text-muted-foreground hover:text-foreground`}
            >
              KNOWDE
            </BreadcrumbLink>
            <BreadcrumbLink
              href="#"
              className={`text-sm font-medium ${fonts.roboto} text-muted-foreground hover:text-foreground`}
            >
              Marketplace
            </BreadcrumbLink>
          </div>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {/* breadcrumb route 2 */}
        <BreadcrumbItem>
          <div className="flex flex-col">
            <BreadcrumbLink
              href="#"
              className={`text-sm ${fonts.montserrat} text-muted-foreground hover:text-foreground`}
            >
              Storefront
            </BreadcrumbLink>
            <BreadcrumbLink
              href="#"
              className={`text-sm ${fonts.roboto} font-medium text-muted-foreground hover:text-foreground`}
            >
              ADM
            </BreadcrumbLink>
          </div>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {/* breadcrumb route 3 */}
        <BreadcrumbItem>
          <div className="flex flex-col">
            <BreadcrumbLink
              href="#"
              className={`text-sm ${fonts.montserrat} text-muted-foreground hover:text-foreground`}
            >
              Brand
            </BreadcrumbLink>
            <BreadcrumbLink
              href="#"
              className={`text-sm font-medium ${fonts.roboto} text-muted-foreground hover:text-foreground`}
            >
              NeoVita
            </BreadcrumbLink>
          </div>
        </BreadcrumbItem>
      </Breadcrumb>

      {/* Product Title */}
      <h1 className={`text-3xl ${fonts.montserrat}  font-semibold`}>{producttitle}</h1>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex flex-col gap-8">

          {/* Product Sheets */}
          <div className="flex px-4 2xl:flex-row flex-col gap-3">
            <Button variant="outline" className="gap-2 font-semibold text-lg hover:scale-105 transition-all">
              <FileText size={25} className=" text-blue-600" />
              Technical Data Sheet
            </Button>
            <Button variant="outline" className="gap-2 font-semibold  text-lg hover:scale-105 transition-all">
              <Shield className="w-4 h-4  text-red-600" />
              Safety Data Sheet
            </Button>
            <Button variant="outline" className="gap-2 font-semibold  text-lg hover:scale-105 transition-all">
              <FileDown className="w-4 h-4" />
              Request Document
            </Button>
            <Button variant="outline" className="gap-2 font-semibold  text-lg hover:scale-105 transition-all">
              <Mail className="w-4 h-4" />
              General Inquiry
            </Button>
          </div>
           {/* Product Description */}
          <div className="px-4">
           
            <p className={`text-lg ${fonts.montserrat} text-muted-foreground`}>
              NeoVita™ 43 (016048) is a specially formulated soil amendment
              product with a unique combination of sugars designed to work in
              conjunction with plant nutrient inputs to support plant growth.
            </p>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="mt-4">
                <h2 className={`text-lg ${fonts.montserrat} font-semibold`}>Functions:</h2>
                <p className={`${fonts.montserrat}`}>Bioenhancer</p>
              </div>

              <div>
                <h2 className={`text-lg ${fonts.montserrat} font-semibold`}>
                  Application Technique:
                </h2>
                <p className={`${fonts.montserrat}`}>Foliage Applied, Pre-Emergence</p>
              </div>

              <div>
                <h2 className={`text-lg ${fonts.montserrat} font-semibold`}>Features:</h2>
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

              {/* <Button variant="outline" className="gap-2">
                Enhanced TDS
                <ChevronDown className="w-4 h-4" />
              </Button> */}
            </div>
          </div>

        </div>
        <QuoteCard />
      </div>
    </div>
  );
}
