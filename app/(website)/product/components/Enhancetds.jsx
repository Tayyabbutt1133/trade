"use client";

import { SectionCard } from "./Section-card";
import { fonts } from "@/components/ui/font";

export default function Enhancetds({ tds }) {
  const singleproduct = tds && tds.length > 0 ? tds[0] : null;
  const productSpecs = singleproduct?.["Product Specs"] || [];

  const hasNoRecord =
    productSpecs.length === 1 && productSpecs[0].body === "No Record";

  return (
    <div className="bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <h1 className={`text-xl sm:text-2xl font-bold ${fonts.montserrat}`}>
            Product Specifications
          </h1>
        </div>

        {/* Single Section Card with Table Layout */}
        <SectionCard title="">
          {hasNoRecord ? (
            <p className={`text-sm text-muted-foreground ${fonts.montserrat}`}>
              No product specifications available for this product.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
                <thead>
                    <tr className={`bg-muted ${fonts.montserrat} text-left text-lg font-medium`}>
                    <th className="py-3 px-4">Heading</th>
                    <th className="py-3 px-4">Label</th>
                    <th className="py-3 px-4">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {productSpecs.map((spec, index) => (
                    <tr
                      key={spec.id || index}
                      className={`border-t ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-4">{spec.heading}</td>
                      <td className="py-3 px-4">{spec.label}</td>
                      <td className="py-3 px-4">{spec.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
