"use client";

import { DataTable } from "@/components/data-table";
import TableActionBtn from "@/components/table-action-btn";
import { fonts } from "@/components/ui/font";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ProductsPage() {
  const columns = [
    { accessorKey: "code", header: "Code" },
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

  useEffect(() => {
    const fetchProductData = async () => {
      const formData = new FormData();
      formData.append('logby', '0');
      
      try {
        const res = await fetch(`https://tradetoppers.esoftideas.com/esi-api/responses/products/`, {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        
        // Transform the data to match column accessors
        const transformedData = data.Products?.map(product => ({
          id: product.id,
          code: product.code || '-',
          description: product.description || '-',
          formula: product.formula || '-',
          brand: product.brand || '-',
          category: product.category || '-',
          subcategory: product.subcategory || '-',
          chemical: product.chemical || '-',
          // Include any additional fields needed for actions
          logby: product.logby,
          functions: product.functions,
          images: product.images
        }));
    
        setProductData(transformedData);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    }
    
    fetchProductData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl ${fonts.montserrat} font-bold ml-14 sm:ml-0`}>
          Products
        </h1>
        <Link href="/dashboard/products/new">
          <Button className={`flex items-center ${fonts.montserrat}`}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={productData || []} />
    </div>
  );
}