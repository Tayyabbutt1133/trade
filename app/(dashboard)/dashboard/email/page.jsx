"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";

const columns = [
  { accessorKey: "subject", header: "Subject" },
  { accessorKey: "recipientType", header: "Recipient Type" },
  { accessorKey: "description", header: "Description" },
  { accessorKey: "createdDate", header: "Created Date" },
];

const data = [
  {
    id: "1",
    subject: "Welcome to Our Platform",
    recipientType: "All",
    description: "A warm welcome message for all new users",
    createdDate: "2024-03-20",
  },
  {
    id: "2",
    subject: "Special Offer for Sellers",
    recipientType: "Seller",
    description: "Exclusive deal for our valued sellers",
    createdDate: "2024-03-21",
  },
];

export default function EmailPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 lg:ml-0">Email Templates</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Email Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Email Template</DialogTitle>
            </DialogHeader>
            <form className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="recipient-type">Recipient Type</Label>
                <Select>
                  <SelectTrigger id="recipient-type">
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="buyers">Buyers</SelectItem>
                    <SelectItem value="potential-customers">Potential Customers</SelectItem>
                    <SelectItem value="all">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" required className="min-h-[200px]" />
              </div>
              <Button type="submit">Save Template</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
