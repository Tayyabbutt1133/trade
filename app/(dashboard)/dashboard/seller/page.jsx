"use client";
import Link from "next/link";
import { fonts } from "@/components/ui/font";
import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { useEffect, useState, useTransition } from "react";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import { Loader2 } from "lucide-react"; // Import spinner icon

export default function SellerPage() {
  const columns = [
    { accessorKey: "id", header: "ID" },
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
  const [loading, setLoading] = useState(true); // Loading state
  const [isPending, startTransition] = useTransition();
  const [showRouteLoader, setShowRouteLoader] = useState(false);

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true); // Start loading
      const formData = new FormData();
      formData.append("regid", "0");

      try {
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

        setSellerdata(transformedData);
      } catch (error) {
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchSellerData();
  }, []);

  // const handleClick = () => {
  //   setShowRouteLoader(true); // show loading
  //   startTransition(() => {
  //     router.push("/dashboard/seller/new");
  //   });
  // };

  return (
  <>
    {showRouteLoader && <RouteTransitionLoader />}
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ml-14 ${fonts.montserrat} sm:ml-0`}>
          Seller
        </h1>

        {/* <Link href="/dashboard/seller/new/">
          <button
            onClick={handleClick}
            disabled={isPending}
            className="flex items-center px-4 py-2 bg-black text-white rounded hover:bg-black"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Seller
          </button>
        </Link> */}
      </div>

      {/* Show spinner when loading */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
        </div>
      ) : (
        <DataTable columns={columns} data={sellerdata} />
      )}
      </div>
      </>
  );
}
