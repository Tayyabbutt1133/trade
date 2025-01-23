"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "country", header: "Country" },
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

export default function BuyersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold ml-14 sm:ml-0">Buyers</h1>
        <Link href="/dashboard/buyers/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Buyer
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}