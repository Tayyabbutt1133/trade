"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { fonts } from "@/components/ui/font";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; // Import loading icon

export default function ProductsPage() {
  const [productData, setProductData] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [loading, setLoading] = useState(true); // State for loading

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
      setLoading(true); // Start loading

      try {
        const userRes = await fetch("/api/auth/user");
        const { id, type } = (await userRes.json()).userData;
        const formData = new FormData();
        formData.append("productid", "");
        formData.append("maincatid", "");
        formData.append("catid", "");
        formData.append("subcatid", "");

        if (type === "Seller" || type === "buyer") {
          formData.append("logby", id);
        } else {
          formData.append("logby", 0);
        }

        const res = await fetch(
          `https://tradetoppers.esoftideas.com/esi-api/responses/products/`,
          { method: "POST", body: formData }
        );
        const data = await res.json();

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
          logby: product.logby,
          images: product.images,
        }));

        setProductData(transformedData);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchProductData();
  }, []);

  const filteredProduct = sortedProductData?.filter(
    (product) =>
      product?.id?.toLocaleString()?.includes(searchProduct) ||
      product.code.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.description.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.formula.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.category.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.subcategory.toLowerCase().includes(searchProduct.toLowerCase()) ||
      product.chemical.toLowerCase().includes(searchProduct.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl ${fonts.montserrat} font-bold ml-14 sm:ml-0`}>
          Products ({productData?.length})
        </h1>
        <Link href="/dashboard/products/new">
          <Button className={`flex items-center ${fonts.montserrat}`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Input
        type="search"
        placeholder="Search products..."
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
      />

      {/* Show spinner while loading */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-10 h-10 text-gray-500" />
        </div>
      ) : (
        <DataTable columns={columns} data={filteredProduct || []} />
      )}
    </div>
  );
}
