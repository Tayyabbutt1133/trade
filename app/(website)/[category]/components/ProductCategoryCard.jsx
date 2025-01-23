import { fonts } from "@/components/ui/font"
import Image from "next/image"
import Link from "next/link"

export default function ProductCategoryCard({ 
  title, 
  productCount, 
  imageUrl, 
  imageAlt, 
  href = "#",
  viewAllText = "View All" 
}) {
  return (
    <Link 
      href={href} 
      className={`block rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${fonts.montserrat}`}
    >
      <div className="relative">
        <div className="p-6 space-y-2">
          <p className="text-gray-600">{viewAllText}</p>
          <h2 className="text-2xl font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-gray-600">{productCount?.toLocaleString()} Products</p>
        </div>
        <div className="aspect-[16/9] relative">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </Link>
  )
}

