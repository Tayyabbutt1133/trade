import { fonts } from '@/components/ui/font'
import { Beef, Wheat, FlaskRoundIcon as Flask, PaintBucket, Sparkles, Box, Palette, Circle, FuelIcon as Oil, Apple, Pill, Paintbrush, Package, Container } from 'lucide-react'

const productFamiliesData = [
  {
    title: "Animal Feed & Nutrition",
    icon: Beef
  },
  {
    title: "Agrochemicals",
    icon: Wheat
  },
  {
    title: "Base Chem & Intermediates",
    icon: Flask
  },
  {
    title: "CASE Ingredients",
    icon: PaintBucket
  },
  {
    title: "Cleaning Ingredients",
    icon: Sparkles
  },
  {
    title: "Composite Materials",
    icon: Box
  },
  {
    title: "Cosmetic Ingredients",
    icon: Palette
  },
  {
    title: "Elastomers",
    icon: Circle
  },
  {
    title: "Fluids & Lubricants",
    icon: Oil
  },
  {
    title: "Food Ingredients",
    icon: Apple
  },
  {
    title: "Pharma & Nutraceuticals",
    icon: Pill
  },
  {
    title: "Pigments & Colorants",
    icon: Paintbrush
  },
  {
    title: "Plastics",
    icon: Package
  },
  {
    title: "Ready-to-Use Products",
    icon: Container
  }
]

export default function ProductFamiliesGrid() {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 ${fonts.montserrat}`}>
      {productFamiliesData.map((product) => {
        const Icon = product.icon
        return (
          <div key={product.title} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-md hover:ring-2 hover:ring-primary hover:text-primary transition-shadow cursor-pointer">
            <div className="flex flex-col items-center text-center space-y-4">
              <Icon className="w-6 h-6 md:w-8 md:h-8" />
              <h3 className="text-md font-medium">{product.title}</h3>
            </div>
          </div>
        )
      })}
    </div>
  )
}

