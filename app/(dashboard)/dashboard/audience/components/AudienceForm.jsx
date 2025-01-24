"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recipientTypes = ["Seller", "Buyer"]
const originCountries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Japan",
  "Australia",
  "Brazil",
  "India",
  "China",
]
const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "Manufacturing",
  "Retail",
  "Agriculture",
  "Energy",
  "Transportation",
  "Entertainment",
]
const functions = [
  "Sales",
  "Marketing",
  "Operations",
  "Human Resources",
  "Finance",
  "IT",
  "Research and Development",
  "Customer Service",
  "Legal",
  "Executive",
]
const regions = ["North America", "South America", "Europe", "Asia", "Africa", "Australia", "Middle East"]
const taggings = ["Premium", "New", "Verified", "Partner", "High Volume"] // Example tags, replace with actual business tags from your directory

const formFields = [
  { id: "title", label: "Title", type: "text", required: true },
  { id: "recipient-type", label: "Recipient Type", type: "select", options: recipientTypes, required: true },
  { id: "origin-country", label: "Origin Country", type: "select", options: originCountries, required: true },
  { id: "industry", label: "Industry", type: "select", options: industries, required: true },
  { id: "functions", label: "Functions", type: "select", options: functions, required: true },
  { id: "region", label: "Region", type: "select", options: regions, required: true },
  { id: "tagging", label: "Tagging", type: "select", options: taggings, required: false },
]

// Mock data for the table
const mockTableData = [
  { id: 1, name: "Company A", industry: "Technology", region: "North America" },
  { id: 2, name: "Company B", industry: "Healthcare", region: "Europe" },
  { id: 3, name: "Company C", industry: "Finance", region: "Asia" },
]

export function AudienceForm() {
  const [formData, setFormData] = useState({})
  const [selectedAudience, setSelectedAudience] = useState([])
  const [allChecked, setAllChecked] = useState(false)

  const handleInputChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleCheckboxChange = (id) => {
    setSelectedAudience((prev) => {
      const newSelection = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      setAllChecked(newSelection.length === mockTableData.length)
      return newSelection
    })
  }

  const handleToggleAll = () => {
    if (allChecked) {
      setSelectedAudience([])
    } else {
      setSelectedAudience(mockTableData.map((item) => item.id))
    }
    setAllChecked(!allChecked)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form data:", formData)
    console.log("Selected audience:", selectedAudience)
    // Handle form submission logic here
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6">
      <div className="grid gap-4">
        {formFields.map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id}>
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </Label>
            {field.type === "select" ? (
              <Select onValueChange={(value) => handleInputChange(field.id, value)} required={field.required}>
                <SelectTrigger id={field.id}>
                  <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option} value={option.toLowerCase()}>
                      {option}
                    </SelectItem>
                  ))}
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

      <div className="mt-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Audience Selection</h2>
          <Button type="button" onClick={handleToggleAll} variant="outline">
            {allChecked ? "Uncheck All" : "Check All"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Select</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Region</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTableData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedAudience.includes(item.id)}
                    onCheckedChange={() => handleCheckboxChange(item.id)}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.industry}</TableCell>
                <TableCell>{item.region}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button className="w-fit" type="submit">
        Create Audience
      </Button>
    </form>
  )
}

