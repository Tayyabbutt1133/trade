"use client";

import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import { useRouter } from "next/navigation";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "subject", header: "Subject" },
  {
    accessorKey: "Actions",
    cell: ({ row }) => <TableActionBtn page="email" data={row.original} />,
  },
];

export default function EmailPage() {
  const [emailData, setEmailData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [ShowRouteLoader, setShowRouteLoader] = useState();

  const router = useRouter();

  useEffect(() => {
    const fetchEmailData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/emailtemplate/"
        );
        const data = (await res.json()).EmailTemplate;
        setEmailData(data);
      } catch (error) {
        console.error("Error fetching email templates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmailData();
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
            Email Templates
          </h1>
          <Link href={`/dashboard/email/new`}>
            <Button onClick={handleClick} disabled={isPending}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Email Template
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
          </div>
        ) : (
          <DataTable columns={columns} data={emailData || []} />
        )}
      </div>
    </>
  );
}
