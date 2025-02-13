"use client"
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { useEffect, useState } from "react";
import roleAccessStore from "@/store/role-access-permission";

export default function SellerPage() {
  // Retrieve the user's role object from the Zustand store.
  const roleData = roleAccessStore((state) => state.role);
  
  // Extract the "type" property from the role data.
  const userRole = roleData?.type;
  console.log("User Role:", userRole);

  const columns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "country", header: "Country" },
    {
      accessorKey: "Actions",
      cell: ({ row }) => <TableActionBtn page="seller" data={row.original} />,
    },
  ];
  
  const [sellerdata, setSellerdata] = useState([]);
  
  useEffect(() => {
    const fetchSellerData = async () => {
      const formData = new FormData();
      formData.append('regid', '0');
      
      const res = await fetch(`https://tradetoppers.esoftideas.com/esi-api/responses/seller/`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      // Transform the data to match column accessors
      const transformedData = data.Sellers.map(seller => ({
        id: seller.id,
        name: seller.sname,
        email: seller.email,
        phone: seller.compcontact,
        address: seller.saddress,
        country: seller.country || '-',  // Using || '-' to show dash if null
      }));
  
      setSellerdata(transformedData);
    }
    fetchSellerData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ml-14 ${fonts.montserrat} sm:ml-0`}>
          {userRole === "admin" ? "Seller" : "Your Profile"}
        </h1>
        {userRole === "admin" && (
          <Link href="/dashboard/seller/new/">
            <button
              className={`flex items-center px-4 py-2 bg-black text-white rounded hover:bg-black ${fonts.montserrat}`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Seller
            </button>
          </Link>
        )}
      </div>

      {/* DataTable Component */}
      <DataTable columns={columns} data={sellerdata} />
    </div>
  );
}
