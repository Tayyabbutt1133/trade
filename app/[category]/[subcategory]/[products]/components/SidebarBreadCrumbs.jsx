
import { ChevronRight } from 'lucide-react'
import { fonts } from "@/components/ui/font"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function SidebarBreadcrumbs({ category, subcategory, products }) {
  return (
    <Breadcrumb className={`${fonts.montserrat}  mb-4 list-none flex flex-row flex-wrap items-center gap-2`}>
      <BreadcrumbItem>
        <BreadcrumbLink href="/" className="text-gray-500 hover:text-gray-700">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <ChevronRight className="h-4 w-4" />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink href={`/${category}`} className="text-gray-500 hover:text-gray-700">
          {category}
        </BreadcrumbLink>
      </BreadcrumbItem>
      {subcategory && (
        <>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${category}/${subcategory}`} className="text-gray-500 hover:text-gray-700">
              {subcategory}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </>
      )}
      {products && (
        <>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900 font-medium">
              Products
            </BreadcrumbPage>
          </BreadcrumbItem>
        </>
      )}
    </Breadcrumb>
  )
}

