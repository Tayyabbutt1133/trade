"use client"

import React, { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"


const statuses = [
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
  {
    value: "pending",
    label: "Pending",
    className: "bg-yellow-500 text-white",
  }
]

export default function PendingRegistrations() {
  const [tableData, setTableData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [iswebcode, setIsWebCode] = useState('');

  // Fetch current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/user")
        const data = await response.json()
        const userwebcode = data?.userData?.webcode;
        if (userwebcode) {
          setIsWebCode(userwebcode);
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!iswebcode) return;

        const formdata = new FormData();
        formdata.append("code", iswebcode);

        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/profile/",
          {
            method: "POST",
            body: formdata,
          }
        );
        const json_data = await response.json();
        const userData = json_data?.Registeration?.[0];
        console.log("User data in pending reg :", userData);
        if (userData) {
          setCurrentUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [iswebcode]);





  // Fetch registration data from API
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
    if (!currentUser || !currentUser.id) {
      return
    }

    try {
      // Show loading state
      setTableData(current =>
        current.map(item => (item.id === id ? { ...item, isUpdating: true } : item))
      )

      // Prepare form data for the API request
      const formData = new FormData()
      formData.append("regid", id)
      formData.append("status", newStatus)
      formData.append("logby", currentUser.id)

      // Make the API call
      const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/regapprove/", {
        method: 'POST',
        body: formData
      })
      
      const data = (await response.json()).Registeration[0]
      console.log(data)
      if (data && data.body === "Success") {
        // Update local state
        setTableData(current =>
          current.map(item => (item.id === id ? { ...item, status: newStatus, isUpdating: false } : item))
        )
        
      } else {
        throw new Error(data.message || "Failed to update status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      
      // Reset the updating state
      setTableData(current =>
        current.map(item => (item.id === id ? { ...item, isUpdating: false } : item))
      )

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
        const currentStatus = statuses.find((status) => status.value === row.original.status) || statuses[2] // Default to pending
        const isUpdating = row.original.isUpdating

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                role="combobox" 
                aria-expanded={open} 
                className="w-[130px] justify-between"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <span className="inline-flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                    Updating...
                  </span>
                ) : (
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${currentStatus.className}`}
                  >
                    {currentStatus.label}
                  </span>
                )}
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
                      if (status.value !== row.original.status) {
                        handleStatusChange(row.original.id, status.value)
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