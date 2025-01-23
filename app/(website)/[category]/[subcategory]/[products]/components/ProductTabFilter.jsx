"use client";

import { useState } from "react";
import { fonts } from "@/components/ui/font";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";

const tabs = [
  { id: "products", label: "Products" },
  { id: "brands", label: "Brands" },
  { id: "suppliers", label: "Suppliers" },
  { id: "formulations", label: "Formulations" },
  { id: "documents", label: "Documents" },
];

export default function ProductTabsFilter() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className={`${fonts.montserrat} border-b px-4`}>
      <div className="flex h-full items-center justify-between">
        {/* Dropdown option for smaller screens */}
        <div className="flex  lg:[display:none]">
          <Select defaultValue={tabs[0].id}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {
                tabs.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>
                    {tab.label}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>

        {/* Tabs view for large screens. */}
        <div className="[display:none] lg:flex h-full items-center">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              className={`px-6 h-auto text-base font-medium rounded-none border-b-2 ${
                activeTab === tab.id
                  ? "border-teal-500 text-teal-500"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-4 px-4 py-2">
          <Select defaultValue="relevance">
            <SelectTrigger className="w-[160px]">
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
