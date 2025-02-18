"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "atype", header: "Recipient Type" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "industry", header: "Industry" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "status", header: "Status" },
  {
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/dashboard/audience/${row.original.id}`}>
        <Button className="bg-green-700 text-white" size="sm" variant="outline">Edit</Button>
      </Link>
    ),
  },
];

export default function AudiencePage() {
  const [audiences, setAudiences] = useState([])

    const fetchAudienceData = async () => {
      try {
        const res = await fetch(`https://tradetoppers.esoftideas.com/esi-api/responses/audience/`, {
          method: "POST",
        });
        const data = await res.json();
        const audience = data.Audience || [];
        console.log("Audience data in table:", data);
        setAudiences(audience);
      } catch (error) {
        console.error('Error fetching buyer data:', error);
      }
    }

  
  useEffect(() => {
    fetchAudienceData();
  },[])



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
      <DataTable columns={columns} data={audiences} />
    </div>
  )
}
