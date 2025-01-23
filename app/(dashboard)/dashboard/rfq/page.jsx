"use client";

import React from "react";
import { PlusCircle } from "lucide-react";

export default function RFQ() {
  const columns = [
    { key: "quotationNumber", header: "Quotation Number" },
    { key: "customer", header: "Customer" },
    { key: "status", header: "Status" },
    { key: "total", header: "Total" },
    { key: "date", header: "Date" },
  ];

  const data = [
    {
      id: "1",
      quotationNumber: "QUO-001",
      customer: "John Doe",
      status: "Processing",
      total: "$299.99",
      date: "2024-03-20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 sm:ml-0">
          Quotations
        </h1>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Quotation
        </button>
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
              <div>{row.quotationNumber}</div>
              <div>{row.customer}</div>
              <div>{row.status}</div>
              <div>{row.total}</div>
              <div>{row.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
