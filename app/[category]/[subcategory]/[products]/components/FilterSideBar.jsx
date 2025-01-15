"use client"

import { useState } from 'react'
import { fonts } from "@/components/ui/font"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'
import MenuItem from './MenuItem'
import FilterPanel from './FilterPanel'
import { filterSections } from './data'

export default function FilterSidebar() {
    const [selectedFilter, setSelectedFilter] = useState(null)
    const [switches, setSwitches] = useState({})
    const [searchTerm, setSearchTerm] = useState('')
  
    const handleSwitchChange = (id) => {
      setSwitches(prev => ({
        ...prev,
        [id]: !prev[id]
      }))
    }
  
    const handleClear = () => {
      setSelectedFilter(null)
      setSwitches({})
      setSearchTerm('')
    }
  
    const getSelectedFilterData = () => {
      for (const section of filterSections) {
        const item = section.items.find(item => item.id === selectedFilter)
        if (item) {
          return {
            title: item.label,
            options: item.options || []
          }
        }
      }
      return null
    }
  
    const selectedFilterData = getSelectedFilterData()
  
    return (
      <div className={`${fonts.montserrat} relative`}>
        <aside className="w-80 border-r bg-white">
          <div className="sticky top-0">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">Filters</h2>
              <Button 
                variant="ghost" 
                className="text-gray-500 hover:text-gray-900"
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
  
            <div className="p-4 space-y-6">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search"
                  className="pl-9 bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
  
              {/* Filter Sections */}
              {filterSections.map(section => (
                <div key={section.id} className="space-y-4">
                  <h3 className="text-sm text-gray-500 font-medium">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.type === 'switches' ? (
                      section.items.map(item => (
                        <div key={item.id} className="flex items-center justify-between px-4">
                          <label htmlFor={item.id} className="text-sm font-medium">
                            {item.label}
                          </label>
                          <Switch 
                            id={item.id}
                            checked={switches[item.id] || false}
                            onCheckedChange={() => handleSwitchChange(item.id)}
                          />
                        </div>
                      ))
                    ) : (
                      section.items.map(item => (
                        <MenuItem 
                          key={item.id}
                          label={item.label}
                          isSelected={selectedFilter === item.id}
                          onClick={() => setSelectedFilter(item.id)}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
  
        {/* FilterPanel with overlay */}
        {selectedFilter && selectedFilterData && (
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedFilter(null)}>
            <div 
              className="absolute left-80 top-0 h-full"
              onClick={e => e.stopPropagation()}
            >
              <FilterPanel
                title={selectedFilterData.title}
                onClose={() => setSelectedFilter(null)}
                options={selectedFilterData.options}
              />
            </div>
          </div>
        )}
      </div>
    )
}