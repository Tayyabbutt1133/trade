"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ProductSpecsForm() {
  const [specs, setSpecs] = useState([
    {
      id: "1",
      property: "",
      value: "",
      units: "",
      testMethod: "",
    },
  ]);

  const addRow = () => {
    setSpecs([
      ...specs,
      {
        id: Math.random().toString(36).substr(2, 9),
        property: "",
        value: "",
        units: "",
        testMethod: "",
      },
    ]);
  };

  const removeRow = (id) => {
    if (specs.length === 1) return;
    setSpecs(specs.filter((spec) => spec.id !== id));
  };

  const updateSpec = (id, field, value) => {
    setSpecs(
      specs.map((spec) =>
        spec.id === id ? { ...spec, [field]: value } : spec
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(specs);
    // Handle form submission here
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-md border">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium">
          <div className="col-span-3">Property</div>
          <div className="col-span-3">Value</div>
          <div className="col-span-2">Units</div>
          <div className="col-span-3">Test Method / Conditions</div>
          <div className="col-span-1"></div>
        </div>
        <div className="p-4 space-y-4">
          {specs.map((spec) => (
            <div key={spec.id} className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-3">
                <Input
                  placeholder="e.g., Viscosity (at 80°F)"
                  value={spec.property}
                  onChange={(e) =>
                    updateSpec(spec.id, "property", e.target.value)
                  }
                  required
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder="e.g., max. 15"
                  value={spec.value}
                  onChange={(e) => updateSpec(spec.id, "value", e.target.value)}
                  required
                />
              </div>
              <div className="col-span-2">
                <Input
                  placeholder="e.g., cP"
                  value={spec.units}
                  onChange={(e) => updateSpec(spec.id, "units", e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Input
                  placeholder="Test method"
                  value={spec.testMethod}
                  onChange={(e) =>
                    updateSpec(spec.id, "testMethod", e.target.value)
                  }
                />
              </div>
              <div className="col-span-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(spec.id)}
                  disabled={specs.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={addRow}>
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
        <Button type="submit">Save Specifications</Button>
      </div>
    </form>
  );
}
