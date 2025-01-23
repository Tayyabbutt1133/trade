"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

const columns = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "startDate", header: "Start Date" },
  { accessorKey: "endDate", header: "End Date" },
  { accessorKey: "description", header: "Description" }
];

const initialData = [
  {
    id: "1",
    name: "Summer Sale",
    type: "Discount",
    status: "Active",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    description: "Summer season special discount campaign"
  }
];

const emailTemplates = [
  { id: "1", name: "Welcome Email" },
  { id: "2", name: "Summer Promotion" },
  { id: "3", name: "Holiday Special" },
  { id: "4", name: "Flash Sale Alert" },
]

export default function CampaignsPage() {
  const [campaignData, setCampaignData] = useState(initialData);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    description: "",
    startDate: "",
    endDate: "",
    emailTemplate: "",
    audience: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      startDate: "",
      endDate: "",
      emailTemplate: "",
      audience: "",
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const newCampaign = {
        id: (campaignData.length + 1).toString(),
        ...formData,
        status: "Draft"
      };

      setCampaignData(prevData => [...prevData, newCampaign]);
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding campaign:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="sm:text-3xl text-2xl font-bold ml-14 lg:ml-0">Campaigns</h1>
        <Dialog open={open} onOpenChange={(newOpen) => {
          setOpen(newOpen);
          if (!newOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Campaign Name</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Campaign Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={value => handleSelectChange("type", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select campaign type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Discount">Discount</SelectItem>
                    <SelectItem value="Promotion">Promotion</SelectItem>
                    <SelectItem value="Seasonal">Seasonal</SelectItem>
                    <SelectItem value="Flash Sale">Flash Sale</SelectItem>
                    <SelectItem value="Holiday">Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="emailTemplate">Email Template</Label>
                <Select
                  value={formData.emailTemplate}
                  onValueChange={(value) => handleSelectChange("emailTemplate", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select email template" />
                  </SelectTrigger>
                  <SelectContent>
                    {emailTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="recipient-type">Recipient Type</Label>
                <Select>
                  <SelectTrigger id="recipient-type">
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="seller">Seller</SelectItem>
                    <SelectItem value="buyers">Buyers</SelectItem>
                    <SelectItem value="potential-customers">Potential Customers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter campaign details..."
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    name="startDate" 
                    type="date" 
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    name="endDate" 
                    type="date" 
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <Button type="submit" className="mt-4">Create Campaign</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns} data={campaignData} />
    </div>
  );
}