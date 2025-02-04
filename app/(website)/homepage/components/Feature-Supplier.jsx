// import { SupplierCard } from './Supplier-cards'
import bg_image1 from "@/public/Suppliers/sup1.png";
import bg_image2 from "@/public/Suppliers/sup2.png";
import bg_image3 from "@/public/Suppliers/sup3.png";
import bg_image4 from "@/public/Suppliers/sup4.png";
import com_logo1 from "@/public/Suppliers/comp1.png";
import com_logo2 from "@/public/Suppliers/comp2.png";
import com_logo3 from "@/public/Suppliers/comp3.png";
import com_logo4 from "@/public/Suppliers/comp4.png";
import Image from "next/image";
import Container from "@/components/container";
import { fonts } from "@/components/ui/font";

// This would come from an API in the future
const FEATURED_SUPPLIERS = [
  {
    id: "1",
    name: "Braskem",
    logoUrl: com_logo1,
    backgroundImageUrl: bg_image1,
    altText: "Maritime industrial scene with cargo ship",
  },
  {
    id: "2",
    name: "Ingredion",
    logoUrl: com_logo2,
    backgroundImageUrl: bg_image2,
    altText: "Fresh green smoothie with lime",
  },
  {
    id: "3",
    name: "Mitsubishi",
    logoUrl: com_logo3,
    backgroundImageUrl: bg_image3,
    altText: "Industrial mechanical parts",
  },
  {
    id: "4",
    name: "Evonik",
    logoUrl: com_logo4,
    backgroundImageUrl: bg_image4,
    altText: "White industrial structure",
  },
  {
    id: "5",
    name: "Braskem",
    logoUrl: com_logo1,
    backgroundImageUrl: bg_image1,
    altText: "Maritime industrial scene with cargo ship",
  },
  {
    id: "6",
    name: "Ingredion",
    logoUrl: com_logo2,
    backgroundImageUrl: bg_image2,
    altText: "Fresh green smoothie with lime",
  },
  {
    id: "7",
    name: "Mitsubishi",
    logoUrl: com_logo3,
    backgroundImageUrl: bg_image3,
    altText: "Industrial mechanical parts",
  },
  {
    id: "8",
    name: "Evonik",
    logoUrl: com_logo4,
    backgroundImageUrl: bg_image4,
    altText: "White industrial structure",
  },
];

export default function FeaturedSuppliers() {
  return (
    <section className="py-16 px-4 bg-[#FBFBFB]">
      <Container>
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className={`text-gray-600 ${fonts.roboto}`}>
              Featured Suppliers
            </h2>
            <h3
              className={`text-4xl md:max-w-[700px] font-semibold text-gray-900 ${fonts.montserrat}`}
            >
              The largest suppliers at your fingertips.
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_SUPPLIERS.map((supplier) => (
              // <SupplierCard key={supplier.id} supplier={supplier} />
              <div
                key={supplier.id}
                className="relative aspect-square overflow-hidden rounded-lg group"
              >
                {/* Background Image */}
                <Image
                  src={supplier.backgroundImageUrl}
                  alt={supplier.altText || "Supplier background"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Logo Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-4 w-20 h-20 flex items-center justify-center shadow-lg">
                    <Image
                      src={supplier.logoUrl}
                      alt={`${supplier.name || "Supplier"} logo`}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
