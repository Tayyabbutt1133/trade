"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

const columns = [
  { accessorKey: "productName", header: "Product Name" },
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "quantity", header: "Quantity" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "lastUpdated", header: "Last Updated" },
];

const data = [
  {
    id: "1",
    productName: "Sample Product",
    sku: "SKU001",
    quantity: 100,
    location: "Warehouse A",
    lastUpdated: "2024-03-20",
  },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold text-center lg:text-left">Inventory</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Inventory
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Inventory Item</DialogTitle>
            </DialogHeader>
            <form className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="productName">Product Name</Label>
                <Input id="productName" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" required />
              </div>
              <Button type="submit">Add Item</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
