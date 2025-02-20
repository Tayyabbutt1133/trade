"use client"

import React, { useState, useEffect } from "react"
import { Check, ChevronsUpDown, CheckCircle, XCircle } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const statuses = [
  {
    value: "pending",
    label: "Pending",
    className: "bg-yellow-500 text-white",
  },
  {
    value: "approve",
    label: "Approve",
    className: "bg-green-500 text-white",
  },
  {
    value: "reject",
    label: "Reject",
    className: "bg-red-500 text-white",
  },
]

export default function PendingRegistrations() {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data from API
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true)
        const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/pendingreg/")
        const data = await response.json()
        
        if (data && data.Response) {
          // Transform API data to match our table format
          const formattedData = data.Response.map(item => ({
            id: item.id.toString(),
            regtype: item.regtype,
            regname: item.regname,
            regemail: item.regemail,
            company: item.company,
            caddress: item.caddress,
            country: item.country || "Not specified",
            industry: item.industry,
            status: "pending" // Default status
          }))
          setTableData(formattedData)
        }
      } catch (error) {
        console.error("Error fetching registration data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [])

  // Handle status change
  const handleStatusChange = async (id, newStatus) => {
    // In a real implementation, you would make an API call here to update the status
    // For now, we'll just update the local state
    try {
      // Mock API call
      // const response = await fetch(`your-api-endpoint/${id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ status: newStatus })
      // })
      
      // Update local state
      setTableData(current =>
        current.map(item => (item.id === id ? { ...item, status: newStatus } : item))
      )
      
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "regtype", header: "Registration Type" },
    { accessorKey: "regname", header: "Name" },
    { accessorKey: "regemail", header: "Email" },
    { accessorKey: "company", header: "Company" },
    { accessorKey: "country", header: "Country" },
    { accessorKey: "industry", header: "Industry" },
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
                      if (status.value !== "pending") {
                        handleStatusChange(row.original.id, status.value)
                      } else {
                        setTableData(current =>
                          current.map(item => (item.id === row.original.id ? { ...item, status: status.value } : item))
                        )
                      }
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
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 sm:ml-0">Pending Registrations</h1>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <DataTable columns={columns} data={tableData} />
      )}
    </div>
  )
}