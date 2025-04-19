import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


export function ContactInput({ id, value, onChange, countryCodes }) {

  const uniqueCountryCodes = [...new Set(countryCodes)];


  return (
    <div className="flex">
      <Select value={value?.countryCode} onValueChange={(code) => onChange(id, { ...value, countryCode: code })}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Code" />
        </SelectTrigger>
        <SelectContent>
          {uniqueCountryCodes.map((code) => (
            <SelectItem key={code} value={code}>
              {code}
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

