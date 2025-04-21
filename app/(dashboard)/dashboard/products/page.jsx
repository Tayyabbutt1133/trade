"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { PlusCircle, Loader2 } from "lucide-react";
import { DataTable } from "@/components/data-table";
import RouteTransitionLoader from "@/components/RouteTransitionLoader";
import TableActionBtn from "@/components/table-action-btn";
import { fonts } from "@/components/ui/font";
import { Button } from "@/components/ui/button";

export default function ProductsPage() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [ShowRouteLoader, setShowRouteLoader] = useState();

  const columns = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "code", header: "Code" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "formula", header: "Formula" },
    { accessorKey: "brand", header: "Brand" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "subcategory", header: "Subcategory" },
    { accessorKey: "chemical", header: "Chemical" },
    {
      accessorKey: "Actions",
      cell: ({ row }) => <TableActionBtn page="products" data={row.original} />,
    },
  ];

  const sortedProductData = useMemo(() => {
    return productData?.sort((a, b) => a.id - b.id);
  }, [productData]);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);

      try {
        const response = await fetch("/api/auth/user");
        const response_json = await response.json();
        const user_token = response_json.userData.webcode

        const formData = new FormData();
        formData.append("productid", "");
        formData.append("maincatid", "");
        formData.append("catid", "");
        formData.append("subcatid", "");
        formData.append("size", "250"); // for now giving static count to fetch static no.of products
        formData.append("page", "");
        formData.append("webcode", user_token)

        const res = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/products/",
          { method: "POST", body: formData }
        );

        const data = await res.json();
        console.log(data);

        // Get total count from the response
        const totalRecords = data?.["Total Records"]?.[0]?.records || 0;
        setTotalCount(totalRecords);

        const transformedData = data.Product?.map((product) => ({
          id: product.id,
          code: product.code || "-",
          name: product.product || "-",
          description: product.description || "-",
          formula: product.formula || "-",
          brand: product.brand || "-",
          category: product.category || "-",
          subcategory: product.subcategory || "-",
          chemical: product.chemical || "-",
        }));

        setProductData(transformedData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleClick = () => {
    setShowRouteLoader(true); // show loading
    startTransition(() => {
      router.push("/dashboard/seller/new");
    });
  };

  return (
    <>
      {ShowRouteLoader && <RouteTransitionLoader />}

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1
            className={`text-3xl ${fonts.montserrat} font-bold ml-14 sm:ml-0`}
          >
            Products ({totalCount})
          </h1>
          <Link href="/dashboard/products/new">
            <Button
              onClick={handleClick}
              disabled={isPending}
              className={`flex items-center ${fonts.montserrat}`}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        {/* Show spinner while loading */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
          </div>
        ) : (
          <DataTable columns={columns} data={sortedProductData || []} />
        )}

        {/* <DataTable columns={columns} data={sortedProductData || []} loading={loading} /> */}
      </div>
    </>
  );
}
