"use client"

import React, { useState } from "react"
import { PlusCircle, Check, ChevronsUpDown } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const statuses = [
  {
    value: "on-track",
    label: "On Track",
    className: "bg-blue-500 text-white",
  },
  {
    value: "on-hold",
    label: "On Hold",
    className: "bg-purple-500 text-white",
  },
  {
    value: "done",
    label: "Done",
    className: "bg-green-500 text-white",
  },
  {
    value: "off-track",
    label: "Off Track",
    className: "bg-orange-500 text-white",
  },
  {
    value: "blocked",
    label: "Blocked",
    className: "bg-red-500 text-white",
  },
]

export default function RFQ() {
  const [tableData, setTableData] = useState([
    // {
    //   id: "1",
    //   quotationNumber: "QUO-001",
    //   customer: "John Doe",
    //   total: "$299.99",
    //   date: "2024-03-20",
    //   status: "on-track",
    // },
  ])

  const columns = [
    { accessorKey: "quotationNumber", header: "Quotation Number" },
    { accessorKey: "customer", header: "Customer" },
    { accessorKey: "total", header: "Total" },
    { accessorKey: "date", header: "Date" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const [open, setOpen] = useState(false)
        const currentStatus = statuses.find((status) => status.value === row.original.status) || statuses[0]

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" role="combobox" aria-expanded={open} className="w-[130px] justify-between">
                <span
                  className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${currentStatus.className}`}
                >
                  {currentStatus.label}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <div className="max-h-[300px] overflow-y-auto">
                {statuses.map((status) => (
                  <div
                    key={status.value}
                    className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                      row.original.status === status.value ? "bg-gray-100" : ""
                    }`}
                    onClick={() => {
                      setTableData((current) =>
                        current.map((item) => (item.id === row.original.id ? { ...item, status: status.value } : item)),
                      )
                      setOpen(false)
                    }}
                  >
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </div>
                    {row.original.status === status.value && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 sm:ml-0">Quotations</h1>
      </div>
      <DataTable columns={columns} data={tableData} />
    </div>
  )
}

