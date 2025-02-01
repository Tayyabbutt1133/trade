"use client";

import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { fonts } from "@/components/ui/font";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "endDate", header: "End Date" },
  { accessorKey: "description", header: "Description" },
  {
    accessorKey: "Actions",
    cell: ({ row }) => <TableActionBtn page="campaigns" data={row.original} />,
  },
];

const initialData = [
  {
    id: "1",
    name: "Summer Sale",
    type: "Discount",
    status: "Active",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    description: "Summer season special discount campaign"
  }
];

const emailTemplates = [
  { id: "1", name: "Welcome Email" },
  { id: "2", name: "Summer Promotion" },
  { id: "3", name: "Holiday Special" },
  { id: "4", name: "Flash Sale Alert" },
]

export default function CampaignsPage() {
  const [campaignData, setCampaignData] = useState(initialData);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 lg:ml-0">Campaigns</h1>
        <Link href="/dashboard/campaigns/new">
          <button
            className={`flex  items-center px-4 py-2 bg-black text-white rounded hover:bg-black ${fonts.montserrat}`}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Campaign
          </button>
        </Link>
      </div>
      <DataTable columns={columns} data={campaignData} />
    </div>
  );
}