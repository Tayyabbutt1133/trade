import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  "Entertainment"
]

const formFields = [
  { id: "buyer-name", label: "Name", type: "text", required: true },
  { id: "buyer-email", label: "Email", type: "email", required: true },
  { id: "buyer-company-contact", label: "Company Contact", type: "tel", required: true },
  { id: "buyer-address", label: "Address", type: "text", required: true },
  { id: "buyer-country", label: "Country", type: "text", required: true },
  { id: "poc-name", label: "POC Name", type: "text", required: false },
  { id: "poc-contact", label: "POC Contact", type: "text", required: false },
  { id: "document", label: "Document", type: "file", required: false },
]

export function BuyerForm() {
  return (
    <form className="grid gap-6">
      <div className="grid gap-4">
        {formFields.map((field) => (
          <div key={field.id} className="grid gap-2">
            <Label htmlFor={field.id}>{field.label} <span className="text-red-500">{field.required ? "*" : ""}</span></Label>
            <Input id={field.id} type={field.type} required={field.required} />
          </div>
        ))}
        {/* <div className="grid gap-2">
          <Label htmlFor="seller-industry">Industry</Label>
          <Select>
            <SelectTrigger id="seller-industry">
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry.toLowerCase()}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}
      </div>
      <Button className="w-fit" type="submit">Save Buyer</Button>
    </form>
  )
}

