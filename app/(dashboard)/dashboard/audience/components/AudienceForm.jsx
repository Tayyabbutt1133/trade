"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Static options for fields that aren't dynamic
const recipientTypes = ["Seller", "Buyer", "Both"]
const taggings = ["Premium", "New", "Verified", "Partner", "High Volume"]

export function AudienceForm({ countries = [], industries = [], regions = [] }) {
  const [formData, setFormData] = useState({})
  const [analytics, setAnalytics] = useState({
    totalAudience: 0,
    averageAge: 0,
    topIndustries: [],
    genderDistribution: { male: 0, female: 0, other: 0 },
  })

  const dynamicFormFields = [
    { id: "title", label: "Title", type: "text", required: true },
    {
      id: "recipient-type",
      label: "Recipient Type",
      type: "select",
      options: recipientTypes,
      required: true,
    },
    {
      id: "origin-country",
      label: "Origin Country",
      type: "select",
      options: countries,
      required: true,
      optionKey: "country",
    },
    {
      id: "industry",
      label: "Industry",
      type: "select",
      options: industries,
      required: true,
      optionKey: "industry",
    },
    {
      id: "region",
      label: "Region",
      type: "select",
      options: regions,
      required: true,
      optionKey: "region",
    },
    { id: "tagging", label: "Tagging", type: "select", options: taggings, required: false },
  ]

  const handleInputChange = async (id, value) => {
    const newFormData = { ...formData, [id]: value }
    setFormData(newFormData)

    // Make API call to fetch updated analytics
    try {
      const response = await fetch("/api/audience-analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFormData),
      })
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form data:", formData)
    console.log("Final analytics:", analytics)
    // Handle form submission logic here
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4">
        {dynamicFormFields.map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.type === "select" ? (
              <Select onValueChange={(value) => handleInputChange(field.id, value)} required={field.required}>
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder={`Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options && field.options.length > 0 ? (
                    field.options.map((option) => {
                      const display = field.optionKey ? option[field.optionKey] : option
                      return (
                        <SelectItem key={display} value={display}>
                          {display}
                        </SelectItem>
                      )
                    })
                  ) : (
                    <SelectItem disabled>No options available</SelectItem>
                  )}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.id}
                type={field.type}
                required={field.required}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Analytics Display */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Audience</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalAudience.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Button className="w-fit" type="submit">
        Create Audience
      </Button>
    </form>
  )
}

