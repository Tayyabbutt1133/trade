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
      <Select value={value?.countryCode} onValueChange={(code) => onChange(id, { ...value, countryCode: code })}>
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
        name={id}
        value={value?.number}
        onChange={(e) => {
          const newNumber = e.target.value.replace(/\D/g, "").slice(0, 10)
          onChange(id, { ...value, number: newNumber })
        }}
        className="flex-1 ml-2"
      />
    </div>
  )
}

