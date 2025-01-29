import React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  // Add more country codes as needed
]

export function ContactInput({ id, value, onChange }) {
  return (
    <div className="flex">
      <Select onValueChange={(code) => onChange(id, { ...value, countryCode: code })}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {countryCodes.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              {country.code} ({country.country})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={value.number}
        onChange={(e) => onChange(id, { ...value, number: e.target.value })}
        className="flex-1 ml-2"
      />
    </div>
  )
}

