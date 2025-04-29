import { fonts } from "@/components/ui/font";
import { Button } from "@/components/ui/button";

export default function ProductCategoryHeader({ category, totalProducts }) {
  const categoriesToHideCount = [
    "Paints and Coatings",
    "Inks",
    "Adhesives and Sealants",
    "Construction Chemicals",
    "Paper Industry",
    "Lab. Equipment",
    "Packing/Packaging Material Manufacturers",
    "Industrial Machines"
  ];

  const shouldShowCount = !categoriesToHideCount.includes(category);
  const isLabOrMachine =
    category === "Lab. Equipment" || category === "Industrial Machines";

  return (
    <div
      className={`flex w-full flex-col md:flex-row md:items-start md:justify-between space-y-6 md:space-y-0 ${fonts.montserrat} mb-6`}
    >
      <section className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 drop-shadow-[4px_4px_2px_rgba(0,0,0,0.25)]">
            {category} {shouldShowCount && `(${totalProducts})`}
          </h1>
        </div>

        <p className="text-gray-800 text-sm font-medium max-w-3xl">
          {isLabOrMachine
            ? "Trade Toppers provide comprehensive range of Lab. Equipments, instruments and industrial machines used in Paint and Coatings, Inks, Adhesive and Sealants and similar product line. These Equipments and machines are further classified to help user find a right equipment/machine."
            : "Trade Toppers provide comprehensive range of ingredients used in Paint and Coatings, Inks, Adhesive and Sealants and similar product line. These ingredients are classified help user find a right product."}
        </p>
      </section>
    </div>
  );
}
