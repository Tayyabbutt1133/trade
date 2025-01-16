"use client"
import { useState } from "react";
import { fonts } from "@/components/ui/font";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import MenuItem from "./MenuItem";
import FilterPanel from "./FilterPanel";
import { filterSections } from "./data";
import { useFilter } from "@/store/use-filter";

export default function FilterSidebar() {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [switches, setSwitches] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const isFilter = useFilter((state) => state.isFilter);
  const onFilterClose = useFilter((state) => state.onFilterClose);

  const handleSwitchChange = (id) => {
    setSwitches((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleClear = () => {
    setSelectedFilter(null);
    setSwitches({});
    setSearchTerm("");
  };

  const getSelectedFilterData = () => {
    for (const section of filterSections) {
      const item = section.items.find((item) => item.id === selectedFilter);
      if (item) {
        return {
          title: item.label,
          options: item.options || [],
        };
      }
    }
    return null;
  };

  const selectedFilterData = getSelectedFilterData();

  // Base styles for the sidebar container
  const sidebarBaseStyles = `
    ${fonts.montserrat}
    bg-white
    w-80
    border-r
    transition-transform
    duration-300
    ease-in-out
    lg:translate-x-0
    lg:static
    lg:h-auto
    flex
    flex-col
  `;

  // Mobile-specific styles when filter is closed
  const mobileSidebarStyles = isFilter
    ? "fixed inset-y-0 left-0 z-50 transform translate-x-0"
    : "fixed inset-y-0 left-0 z-50 transform -translate-x-full";

  return (
    <>
      {/* Overlay for mobile */}
      {isFilter && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onFilterClose}
        />
      )}

      <div className="flex z-0">
        {/* Main sidebar */}
        <div className={`${sidebarBaseStyles} ${mobileSidebarStyles}`}>
          {/* Fixed Header */}
          <div className="flex items-center justify-between p-4 border-b bg-white">
            <h2 className="text-xl font-semibold">Filters</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-gray-500 hover:text-gray-900"
                onClick={handleClear}
              >
                Clear
              </Button>
              <Button
                variant="ghost"
                className="lg:hidden"
                onClick={onFilterClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
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
              {filterSections.map((section) => (
                <div key={section.id} className="space-y-4">
                  <h3 className="text-sm text-gray-500 font-medium">
                    {section.title}
                  </h3>
                  <div className="space-y-1">
                    {section.type === "switches"
                      ? section.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between px-4"
                          >
                            <label
                              htmlFor={item.id}
                              className="text-sm font-medium"
                            >
                              {item.label}
                            </label>
                            <Switch
                              id={item.id}
                              checked={switches[item.id] || false}
                              onCheckedChange={() => handleSwitchChange(item.id)}
                            />
                          </div>
                        ))
                      : section.items.map((item) => (
                          <MenuItem
                            key={item.id}
                            label={item.label}
                            isSelected={selectedFilter === item.id}
                            onClick={() => setSelectedFilter(item.id)}
                          />
                        ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FilterPanel - Now part of the flex container on desktop */}
        {selectedFilter && selectedFilterData && (
          <>
            {/* Mobile overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black/20 z-40"
              onClick={() => setSelectedFilter(null)}
            />
            {/* Panel */}
            <FilterPanel
              title={selectedFilterData.title}
              onClose={() => setSelectedFilter(null)}
              options={selectedFilterData.options}
            />
          </>
        )}
      </div>
    </>
  );
}