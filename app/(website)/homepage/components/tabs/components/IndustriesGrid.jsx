import { fonts } from '@/components/ui/font'
import { Pen, Wheat, Car, Hammer, ShoppingBag, Zap, Apple, Heart, SprayCanIcon as Spray, Factory, Paintbrush, Bath, Package } from 'lucide-react'
import Link from 'next/link'

const industriesData = [
  {
    title: "Adhesives & Sealants",
    icon: Pen
  },
  {
    title: "Industrial",
    icon: Factory
  },
  {
    title: "Paints & Coatings",
    icon: Paintbrush
  },
  {
    title: "Personal Care",
    icon: Bath
  },
]

export default function IndustriesGrid() {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 ${fonts.montserrat}`}>
      {industriesData.map((industry) => {
        const Icon = industry.icon
        return (
          <Link href={`/topmenu/${industry.title}`}>
          <div key={industry.title} className="p-6 h-36 bg-white rounded-lg shadow-lg hover:shadow-md hover:ring-2 hover:ring-primary hover:text-primary transition-shadow cursor-pointer">
            <div className="flex flex-col justify-center items-center text-center space-y-4">
              <Icon className="w-6 h-6 md:w-8 md:h-8 "/>
              <h3 className="text-md font-medium">{industry.title}</h3>
            </div>
            </div>
            </Link>
        )
      })}
    </div>
  )
}

