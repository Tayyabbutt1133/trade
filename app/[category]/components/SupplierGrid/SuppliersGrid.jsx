import { fonts } from "@/components/ui/font"
import Image from "next/image"
import { ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import SupplierCard from "./SupplierCard"

const suppliers = [
  {
    name: "Helena Agri-Enterprises",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Eagle Elastomer",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Stepan Company",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Forté Flavors, LLC",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Drexel Chemical Company",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Biovet",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Albaugh",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Orion Agroscience",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "BARLOG plastics GmbH",
    logo: "/AGC Logo Homepage.webp",
  },
  {
    name: "Additional Supplier",
    logo: "/AGC Logo Homepage.webp",
  }
]

export default function SuppliersGrid() {
  return (
    <section className={`space-y-4 ${fonts.montserrat}`}>
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Browse by Suppliers in Agriculture & Feed <span className="text-gray-900">(1,417)</span>
        </h2>
        <p className="text-gray-600">
          Request samples, documents, and quotes directly from suppliers
        </p>
      </div>

      <div className="grid gap-4">
        {/* Mobile view (logos only + button) */}
        <div className="sm:hidden space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {suppliers.slice(0, 10).map((supplier) => (
              <div key={supplier.name} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="h-16 relative">
                  <Image
                    src={supplier.logo}
                    alt={supplier.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
          <ViewAllButton />
        </div>

        {/* SM breakpoint (2x2 grid) */}
        <div className="hidden sm:grid md:hidden grid-cols-2 gap-4">
          {suppliers.slice(0, 3).map((supplier) => (
            <SupplierCard key={supplier.name} supplier={supplier} />
          ))}
          <ViewAllButton />
        </div>

        {/* MD breakpoint (2x3 grid) */}
        <div className="hidden md:grid lg:hidden grid-cols-3 gap-4">
          {suppliers.slice(0, 5).map((supplier) => (
            <SupplierCard key={supplier.name} supplier={supplier} />
          ))}
          <ViewAllButton />
        </div>

        {/* LG+ breakpoint (2x5 grid) */}
        <div className="hidden lg:grid grid-cols-5 gap-4">
          {suppliers.slice(0, 9).map((supplier) => (
            <SupplierCard key={supplier.name} supplier={supplier} />
          ))}
          <ViewAllButton />
        </div>
      </div>
    </section>
  )
}



function ViewAllButton() {
  return (
    <Button 
      className="w-full bg-primary hover:bg-teal-700 text-white flex items-center justify-between px-6 py-8 rounded-lg"
    >
      <span className="text-xs text-left">View All Suppliers in <br/> Agriculture & Feed</span>
      <ArrowRight className="h-6 w-6" />
    </Button>
  )
}

