"use client"

import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "recipientType", header: "Recipient Type" },
  { accessorKey: "originCountry", header: "Origin Country" },
  { accessorKey: "industry", header: "Industry" },
  { accessorKey: "functions", header: "Functions" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "tagging", header: "Tagging" },
]

const data = [
  {
    id: "1",
    title: "Tech Buyers in North America",
    recipientType: "Buyer",
    originCountry: "United States",
    industry: "Technology",
    functions: "IT",
    region: "North America",
    tagging: "Premium",
  },
  {
    id: "2",
    title: "European Healthcare Sellers",
    recipientType: "Seller",
    originCountry: "Germany",
    industry: "Healthcare",
    functions: "Sales",
    region: "Europe",
    tagging: "Verified",
  },
  {
    id: "3",
    title: "Asian Finance Executives",
    recipientType: "Buyer",
    originCountry: "Japan",
    industry: "Finance",
    functions: "Executive",
    region: "Asia",
    tagging: "High Volume",
  },
]

export default function AudiencePage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 lg:ml-0">Audiences</h1>
        <Link href="/dashboard/audience/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Audience
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}

