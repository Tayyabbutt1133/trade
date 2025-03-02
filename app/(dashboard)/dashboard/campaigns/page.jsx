"use client";

import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { fonts } from "@/components/ui/font";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "campaign", header: "Campaign" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "emailtemp", header: "Email Template" },
  { accessorKey: "audience", header: "Audience" },
  { accessorKey: "description", header: "Description" },
  // {
  //   accessorKey: "Actions",
  //   cell: ({ row }) => <TableActionBtn page="campaigns" data={row.original} />,
  // },
];



export default function CampaignsPage() {
  const [campaignData, setCampaignData] = useState();
  useEffect(() => {
    const fetchCampaignData = async () => {
      const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/campaign/")
      const data = (await res.json()).Campaign
      setCampaignData(data)
    }
    fetchCampaignData()
  }, [setCampaignData]);
  
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
      <DataTable columns={columns} data={campaignData || []} />
    </div>
  );
}