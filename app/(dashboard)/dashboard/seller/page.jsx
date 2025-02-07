"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";

export default function SellerPage() {
  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "country", header: "Country" },
    {
      accessorKey: "Actions",
      cell: ({ row }) => <TableActionBtn page="sellers" data={row.original} />,
    },
  ];
  
  const data = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      address: "123 Main St",
      country: "USA",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ml-14 ${fonts.montserrat} sm:ml-0`}>
          Seller
        </h1>
        <Link href="/dashboard/sellers/new">
          <button
            className={`flex  items-center px-4 py-2 bg-black text-white rounded hover:bg-black ${fonts.montserrat}`}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Seller
          </button>
        </Link>
      </div>

      {/* DataTable Component */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
