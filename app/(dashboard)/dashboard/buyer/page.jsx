"use client";
import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { fonts } from "@/components/ui/font";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import roleAccessStore from "@/store/role-access-permission";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import { Loader2 } from "lucide-react"; // Import spinner icon

export default function BuyersPage() {
  const { role } = roleAccessStore();

  console.log("Role:", role);

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

  const [buyerData, setBuyerData] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [isPending, startTransition] = useTransition();
  const [showRouteLoader, setShowRouteLoader] = useState(false);


  useEffect(() => {
    const fetchBuyerData = async () => {
      setLoading(true); // Start loading
      const formData = new FormData();
      formData.append("regid", "0");

      try {
        const res = await fetch(
          `https://tradetoppers.esoftideas.com/esi-api/responses/buyers/`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        // Transform the data to match column accessors
        const transformedData = data.Buyers.map((buyer) => ({
          id: buyer.id,
          name: buyer.bname,
          email: buyer.email,
          phone: buyer.compcontact,
          address: buyer.saddress,
          country: buyer.country || "-",
        }));

        setBuyerData(transformedData);
      } catch (error) {
        console.error("Error fetching buyer data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchBuyerData();
  }, []);

  const handleClick = () => {
    setShowRouteLoader(true); // show loading
    startTransition(() => {
      router.push("/dashboard/seller/new");
    });
  };

  return (
    <>
      {showRouteLoader && <RouteTransitionLoader />}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1
            className={`text-3xl ${fonts.montserrat} font-bold ml-14 sm:ml-0`}
          >
            Buyers
          </h1>
          <Link href="/dashboard/buyer/new">
            <button
              onClick={handleClick}
              disabled={isPending}
              className={`flex items-center px-4 py-2 bg-black text-white rounded hover:bg-black ${fonts.montserrat}`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Buyer
            </button>
          </Link>
        </div>

        {/* Show spinner when loading */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
          </div>
        ) : (
          <DataTable columns={columns} data={buyerData} />
        )}
      </div>
    </>
  );
}
