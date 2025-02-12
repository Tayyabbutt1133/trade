"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const emailTemplates = [
  { id: "1", name: "Welcome Email" },
  { id: "2", name: "Summer Promotion" },
  { id: "3", name: "Holiday Special" },
  { id: "4", name: "Flash Sale Alert" },
]

export function CampaignForm({ initialData, onSubmit }) {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      type: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      emailTemplate: "",
      recipientType: "",
    },
  )

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

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Campaign Type</Label>
        <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)} required>
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
        <Label htmlFor="recipientType">Audience</Label>
        <Select
          value={formData.recipientType}
          onValueChange={(value) => handleSelectChange("recipientType", value)}
          required
        >
          <SelectTrigger id="recipientType">
            <SelectValue placeholder="Select Audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Washington Sellers</SelectItem>
            <SelectItem value="seller">California Buyers</SelectItem>
            <SelectItem value="buyers">New York</SelectItem>
            <SelectItem value="potential-customers">Texas</SelectItem>
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
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div className="grid gap-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            name="endTime"
            type="time"
            value={formData.endTime}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <Button type="submit" className="mt-4 w-fit">
        {initialData ? "Update Campaign" : "Create Campaign"}
      </Button>
    </form>
  )
}

