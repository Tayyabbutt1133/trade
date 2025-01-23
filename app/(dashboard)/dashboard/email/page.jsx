"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import Link from "next/link";



const columns = [
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "recipientType", header: "Recipient Type" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "createdDate", header: "Created Date" },
];

const data = [
  {
    id: "1",
    subject: "Welcome to Our Platform",
    recipientType: "All",
    description: "A warm welcome message for all new users",
    createdDate: "2024-03-20",
  },
  {
    id: "2",
    subject: "Special Offer for Sellers",
    recipientType: "Seller",
    description: "Exclusive deal for our valued sellers",
    createdDate: "2024-03-21",
  },
];

export default function EmailPage() {
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
      <DataTable columns={columns} data={data} />
    </div>
  );
}
