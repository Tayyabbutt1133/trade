"use client";

import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { fonts } from "@/components/ui/font";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export default function ProductsPage() {
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

  const [productData, setProductData] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");

  const sortedProductData = useMemo(() => {
    return productData?.sort((a, b) => a.id - b.id);
  }, [productData]);

  useEffect(() => {
    const fetchProductData = async () => {
      const userRes = await fetch("/api/auth/user")
      const {id, type} = (await userRes.json()).userData

      const formData = new FormData();
      formData.append("productid", "0");
      formData.append("maincatid", "0");
      formData.append("catid", "0");
      formData.append("subcatid", "0");

      // productid: maincatid: catid: subcatid: logby: 0;

      if (type === "Seller" || type === "buyer") {
        formData.append("logby", id);
      } else {
        formData.append("logby", "0");
      }



      try {
        const res = await fetch(
          `https://tradetoppers.esoftideas.com/esi-api/responses/products/`, {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        // Transform the data to match column accessors
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
          // Include any additional fields needed for actions
          logby: product.logby,
          // functions: product.functions,
          images: product.images,
        }));

        setProductData(transformedData);
      } catch (error) {
        console.error("Error fetching product data:", error);
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
      <DataTable columns={columns} data={filteredProduct || []} />
    </div>
  );
}
