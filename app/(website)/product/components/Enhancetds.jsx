"use client";

import { SectionCard } from "./Section-card";
import { fonts } from "@/components/ui/font";

export default function Enhancetds({ tds }) {
  // Grab the first product
  const singleproduct = tds && tds.length > 0 ? tds[0] : null;

  // Access the "Product Specs" array
  const productSpecs = singleproduct?.["Product Specs"] || [];

  // Check if we have exactly one item with body === "No Record"
  const hasNoRecord =
    productSpecs.length === 1 && productSpecs[0].body === "No Record";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className={`text-primary text-lg sm:text-xl ${fonts.montserrat}`}>
              E
            </span>
          </div>
          <h1 className={`text-xl sm:text-2xl font-bold ${fonts.montserrat}`}>
            Enhanced TDS
          </h1>
        </div>

        {/* If "No Record", show one card with a fallback message.
            Otherwise, map over the specs. */}
        {hasNoRecord ? (
          <SectionCard title="">
            <p className={`text-sm text-muted-foreground ${fonts.montserrat}`}>
              No product specifications available for this product.
            </p>
          </SectionCard>
        ) : (
          productSpecs.map((spec, index) => (
            <SectionCard
              key={spec.id || index}
              title={spec.heading || `Product Spec #${index + 1}`}
            >
              <div className="space-y-2">
                <p className={`text-sm ${fonts.montserrat}`}>
                  <strong>Label:</strong> {spec.label}
                </p>
                <p className={`text-sm ${fonts.montserrat}`}>
                  <strong>Description:</strong> {spec.description}
                </p>
              </div>
            </SectionCard>
          ))
        )}
      </div>
    </div>
  );
}
