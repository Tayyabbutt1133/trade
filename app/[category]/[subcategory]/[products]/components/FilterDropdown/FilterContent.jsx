import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FilterContent({ data }) {
  const [expandedSections, setExpandedSections] = useState(new Set([data.categories[0].title]))
  const [searchTerm, setSearchTerm] = useState('')

  const toggleSection = (title) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedSections(newExpanded)
  }

  return (
    <div className="relative w-[400px]">
      <div className="sticky top-0 bg-white p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search"
            className="pl-9 bg-gray-50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto p-4">
        {data.categories.map((category) => (
          <div key={category.title} className="space-y-2 mb-4">
            <button
              onClick={() => toggleSection(category.title)}
              className="flex items-center justify-between w-full text-left font-medium"
            >
              {category.title}
              {expandedSections.has(category.title) ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {expandedSections.has(category.title) && (
              <div className="space-y-2">
                {category.items.map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Checkbox id={item.label} />
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm text-gray-500">({item.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

