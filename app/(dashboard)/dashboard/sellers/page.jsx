"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default function SellerPage() {
  const columns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "phone", header: "Phone" },
    { key: "address", header: "Address" },
    { key: "country", header: "Country" },
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
        <h1 className="text-3xl font-bold ml-14 sm:ml-0">Seller</h1>
        <Link href="/dashboard/sellers/new">
          <button className="flex items-center px-4 py-2 bg-black text-white rounded hover:bg-black">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Seller
          </button>
        </Link>
      </div>
      <div className="border rounded-md">
        <div className="grid grid-cols-5 gap-4 bg-gray-100 p-4 font-medium">
          {columns.map((column) => (
            <div key={column.key}>{column.header}</div>
          ))}
        </div>
        <div className="p-4 space-y-2">
          {data.map((row) => (
            <div
              key={row.id}
              className="grid grid-cols-5 gap-4 p-4 border-b last:border-none"
            >
              <div>{row.name}</div>
              <div>{row.email}</div>
              <div>{row.phone}</div>
              <div>{row.address}</div>
              <div>{row.country}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
