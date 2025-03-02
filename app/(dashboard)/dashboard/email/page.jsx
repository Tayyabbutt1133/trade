"use client";

import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";



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
  const [emailData, setEmailData] = useState({})
  useEffect(() => {
    const fetchEmailData = async () => {
      const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/emailtemplate/")
      const data = (await res.json()).EmailTemplate

      setEmailData(data)
    }
    fetchEmailData()
  }, [setEmailData]);

  console.log(emailData)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 lg:ml-0">
          Email Templates
        </h1>
        <Link href={`/dashboard/email/new`}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Email Template
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={emailData || []} />
    </div>
  );
}
