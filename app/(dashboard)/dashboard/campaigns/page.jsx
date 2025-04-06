"use client";

import { DataTable } from "@/components/data-table";
import { fonts } from "@/components/ui/font";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

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
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [ShowRouteLoader, setShowRouteLoader] = useState();

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/campaign/"
        );
        const data = (await res.json()).Campaign;
        setCampaignData(data);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaignData();
  }, []);

  const handleClick = () => {
    setShowRouteLoader(true); // show loading
    startTransition(() => {
      router.push("/dashboard/seller/new");
    });
  };

  return (
    <>
      {ShowRouteLoader && <RouteTransitionLoader />}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="sm:text-3xl text-2xl font-bold ml-14 lg:ml-0">
            Campaigns
          </h1>
          <Link href="/dashboard/campaigns/new">
            <button
              onClick={handleClick}
              disabled={isPending}
              className={`flex items-center px-4 py-2 bg-black text-white rounded hover:bg-black ${fonts.montserrat}`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Campaign
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        ) : (
          <DataTable columns={columns} data={campaignData || []} />
        )}
      </div>
    </>
  );
}
