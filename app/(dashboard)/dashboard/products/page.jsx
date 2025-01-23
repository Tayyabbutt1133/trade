"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "category", header: "Category" },
];

const data = [
  {
    id: "1",
    name: "Sample Product",
    code: "PROD001",
    description: "Sample product description",
    price: "$99.99",
    category: "Electronics",
  },
];

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 lg:ml-0">Products</h1>
        <Link href="/dashboard/products/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
