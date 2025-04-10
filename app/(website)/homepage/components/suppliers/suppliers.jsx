import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { fonts } from "@/components/ui/font";
import Image from "next/image";

const suppliers = [
  {
    name: "AGC",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Anderson Advanced Ingredients",
    logo: "/Anderson Logo Homepage.webp",
  },
  {
    name: "Callisons",
    logo: "/Callisons Logo.webp",
  },
  {
    name: "CHT",
    logo: "/CHT Logo Homepage.webp",
  },
  {
    name: "Grant Industries",
    logo: "/Grant Industries Logo.webp",
  },
  {
    name: "Green Dragon",
    logo: "/Guangzhou Logo Homepage.webp",
  },
  {
    name: "HTBA",
    logo: "/HTBA Logo Homepage.webp",
  },
  {
    name: "ICL",
    logo: "/Trade toppers ICL Logo Homepage.webp",
  },
];

export default function SuppliersSection() {
  return (
    <Container className="py-16 mx-auto">
      <div className={`space-y-2 mb-12 ${fonts.montserrat}`}>
        <h2 className="text-gray-600 text-lg md:text-xl ">Latest Suppliers</h2>
        <h3 className="text-3xl md:text-5xl font-semibold text-gray-900 max-w-xl drop-shadow-[2px_2px_1px_rgba(0,0,0,0.2)]">
          Discover range of products in storefronts around the globe.
        </h3>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-4 gap-6 mb-6">
        {suppliers.map((supplier) => (
          <div
            key={supplier.name}
            className="aspect-square flex items-center justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src={supplier.logo}
                alt={supplier.name}
                fill
                className="object-contain w-full h-full"
              />
            </div>
          </div>
        ))}
      </div>
      {/* <div className="w-full flex justify-center lg:justify-end">
        <Button className="bg-[#37bfb1] hover:bg-teal-600 w-full lg:w-fit lg:px-8">
          View 8,000+ Suppliers
        </Button>
      </div> */}
    </Container>
  );
}
