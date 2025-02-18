"use client";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { fonts } from "@/components/ui/font";
import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { useEffect, useState } from "react";
// import roleAccessStore from "@/store/role-access-permission";

export default function ProfilePage() {
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

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      const formData = new FormData();

      const getUserId = await fetch("/api/auth/user");
      const { userData } = await getUserId.json();
      formData.append("regid", userData.id);
      const userType = userData.type;

      console.log(userData)

      if (userType === "Seller") {
        const res = await fetch(
          `https://tradetoppers.esoftideas.com/esi-api/responses/seller/`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        // Transform the data to match column accessors
        const transformedData = data.Sellers.map((seller) => ({
          id: seller.id,
          name: seller.sname,
          email: seller.email,
          phone: seller.compcontact,
          address: seller.saddress,
          country: seller.country || "-", // Using || '-' to show dash if null
        }));

        setData(transformedData);
      }else if(userType === 'Buyer'){
        const res = await fetch(`https://tradetoppers.esoftideas.com/esi-api/responses/buyer/`, {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        
        // Transform the data to match column accessors
        const transformedData = data.Buyers.map(buyer => ({
          id: buyer.id,
          name: buyer.bname,
          email: buyer.email,
          phone: buyer.compcontact,
          address: buyer.saddress,
          country: buyer.country || '-',
        }));

        setData(transformedData);
      }
    };
    fetchdata();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ml-14 ${fonts.montserrat} sm:ml-0`}>
          Your Profile
        </h1>

        {!data.length === 0 ? null : 
          <Link href="/dashboard/profile/new/">
            <button
              className={`flex items-center px-4 py-2 bg-black text-white rounded hover:bg-black capitalize ${fonts.montserrat}`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Profile Detail
            </button>
          </Link>
        }
      </div>

      {/* DataTable Component */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}
