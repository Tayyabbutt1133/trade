"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import RichTextEditor from "@/components/RichTextEditor";

export function DescriptionListForm() {
  const [sections, setSections] = useState([
    {
      id: "1",
      title: "Identification & Functionality",
      items: [
        { id: "1-1", property: "Crop & Plant Type", details: "" },
        { id: "1-2", property: "Agrochemical Functions", details: "" },
        { id: "1-3", property: "Technologies", details: "" },
      ],
    },
  ]);

  const addSection = () => {
    setSections([
      ...sections,
      {
        id: Math.random().toString(36).substr(2, 9),
        title: "",
        items: [],
      },
    ]);
  };

  const addItem = (sectionId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: [
                ...section.items,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  property: "",
                  details: "",
                },
              ],
            }
          : section
      )
    );
  };

  const updateSection = (sectionId, title) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, title } : section
      )
    );
  };

  const updateItem = (sectionId, itemId, field, value) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) =>
                item.id === itemId ? { ...item, [field]: value } : item
              ),
            }
          : section
      )
    );
  };

  const removeSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const removeItem = (sectionId, itemId) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section
      )
    );
  };

  return (
    <form className="space-y-6">
      <div className="space-y-4">
        {sections.map((section) => (
          <Collapsible key={section.id} defaultOpen className="space-y-2">
            <div className="flex items-center gap-2 mb-5">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
              <div className="flex-1">
                <Input
                  placeholder="Section Title"
                  value={section.title}
                  onChange={(e) => updateSection(section.id, e.target.value)}
                  className="font-semibold"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(section.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CollapsibleContent className="space-y-4">
              {section.items.map((item) => (
                <div key={item.id} className="grid grid-cols-3 gap-4 pl-8">
                  <div className="flex flex-col gap-3">
                    <Label htmlFor={`property-${item.id}`} className="">
                      Property
                    </Label>
                    <Input
                      id={`property-${item.id}`}
                      placeholder="Property"
                      value={item.property}
                      onChange={(e) =>
                        updateItem(
                          section.id,
                          item.id,
                          "property",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`details-${item.id}`}>Details</Label>
                    <RichTextEditor
                      sectionId={section.id}
                      itemId={item.id}
                      updateItem={updateItem}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(section.id, item.id)}
                      className="mt-2"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Item
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addItem(section.id)}
                className="ml-8"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={addSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
        <Button type="submit">Save Details</Button>
      </div>
    </form>
  );
}
