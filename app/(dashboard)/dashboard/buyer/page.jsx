"use client";

import React from "react";
import Link from "next/link";
import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { fonts } from "@/components/ui/font";
import { PlusCircle } from "lucide-react";
import roleAccessStore from "@/store/role-access-permission";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
  { accessorKey: "country", header: "Country" },
  {
    accessorKey: "Actions",
    cell: ({ row }) => <TableActionBtn page="buyer" data={row.original} />,
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

export default function BuyersPage() {
  // Retrieve the user's role object from the Zustand store.
  const roleData = roleAccessStore((state) => state.role);
  
  // Extract the "type" property from the role data.
  const userRole = roleData?.type;
  // console.log("User Role:", userRole);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl ${fonts.montserrat} font-bold ml-14 sm:ml-0`}>
          {userRole === "admin" ? "buyer" : "Your Profile"}
        </h1>
        {userRole === "admin" && (
          <Link href="/dashboard/buyer/new">
            <button
              className={`flex items-center px-4 py-2 bg-black text-white rounded hover:bg-black ${fonts.montserrat}`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Buyer
            </button>
          </Link>
        )}
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
