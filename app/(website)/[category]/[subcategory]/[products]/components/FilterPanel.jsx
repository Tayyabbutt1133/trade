import { X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

export default function FilterPanel({ 
  title, 
  onClose,
  options = []
}) {
  return (
    <div className="fixed inset-0 lg:inset-y-0 lg:left-80 z-50 w-full max-w-[400px] bg-white h-full border-r">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6 bg-white h-[calc(100%-73px)] overflow-y-auto">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search"
            className="pl-9 bg-gray-50"
          />
        </div>

        {/* Sorting */}
        <div className="space-y-2">
          <h3 className="text-sm text-gray-500 font-medium">SORTING</h3>
          <select className="w-full p-2 border rounded-md">
            <option value="matches"># Matches</option>
          </select>
        </div>

        {/* Options List */}
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option.label}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Checkbox id={option.label} />
                <span>{option.label}</span>
              </div>
              <span className="text-gray-500">({option.count})</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}