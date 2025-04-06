"use client";

import { useEffect, useState, useTransition } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TableActionBtn from "@/components/table-action-btn";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";

const columns = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "atype", header: "Recipient Type" },
  { accessorKey: "designation", header: "Designation" },
  { accessorKey: "country", header: "Country" },
  { accessorKey: "industry", header: "Industry" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "status", header: "Status" },
  {
    header: "Actions",
    cell: ({ row }) => <TableActionBtn page="audience" data={row.original} />,
  },
];

export default function AudiencePage() {
  const [audiences, setAudiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [ShowRouteLoader, setShowRouteLoader] = useState();

  const fetchAudienceData = async () => {
    try {
      const res = await fetch(
        `https://tradetoppers.esoftideas.com/esi-api/responses/audience/`,
        { method: "POST" }
      );
      const data = await res.json();

      // Check if the body has "No Record"
      if (data.Audience && data.Audience[0]?.body === "No Record") {
        setAudiences([]); // No data to display
      } else {
        setAudiences(data.Audience); // Set the fetched data
      }
    } catch (error) {
      console.error("Error fetching audience data:", error);
      setAudiences([]); // Clear audiences on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAudienceData();
  }, []);


  const router = useRouter();

  
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
          Audiences
        </h1>
        <Link href="/dashboard/audience/new">
          <Button onClick={handleClick} disabled={isPending}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Audience
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
        </div>
      ) : (
        <DataTable columns={columns} data={audiences} />
      )}
      </div>
      </>
  );
}
