"use client"

import * as React from "react"
import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function SearchableCombobox({
  value,
  onChange,
  options = [],
  disabled = false,
  placeholder = "Select..."
}) {
  const [open, setOpen] = useState(false)
  const safeOptions = Array.isArray(options) ? options : []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={disabled}
        >
          {value
            ? safeOptions.find((option) => option.value === value)?.label || value
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
            <CommandGroup key={`group-${placeholder}`}>
              {safeOptions.map((option) => (
                <CommandItem
                  key={option.id}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.value}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function CategoryComboBoxWithDialog({ 
  label, 
  value, 
  onChange, 
  options = [],
  disabled = false,
  type
}) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")

  // If value is an object, extract the string using the key specified by 'type'
  const currentStringValue =
    value && typeof value === "object" ? value[type] : value

  const buttonText = !value || value === "default" ? `Add ${label}` : `Edit ${label}`

  const openDialog = () => {
    const isEdit = value && value !== "default"
    // Use the extracted string value to prefill the input
    setInputValue(isEdit ? currentStringValue : "")
    setDialogOpen(true)
    setError("")
  }

  const handleSave = async () => {
    try {
      if (!inputValue.trim()) {
        setError(`${label} cannot be empty`)
        return
      }

      const formData = new FormData()
      formData.append(type, inputValue)
      formData.append('trantype', (!value || value === "default") ? "New" : "Edit")
      formData.append('status', 'active')

      const res = await fetch(`https://tradetoppers.esoftideas.com/esi-api/requests/${type}/`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Failed to save')
      }
      
      const newValue = {
        id: Date.now(),
        body: "Success",
        [type]: inputValue,
        status: "True"
      }

      onChange(newValue)
      setDialogOpen(false)
      setError("")
    } catch (err) {
      console.error('Save error:', err)
      setError(`Failed to save ${label.toLowerCase()}`)
    }
  }

  const safeOptions = Array.isArray(options) ? options : []
  const displayValue = value ? (typeof value === 'object' ? value[type] : value) : ""

  const transformedOptions = safeOptions.map(option => {
    return {
      value: option[type] || option.value || '',
      id: option.id
    }
  })

  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <SearchableCombobox
          value={displayValue}
          onChange={(newValue) => {
            const selectedOption = safeOptions.find(opt => opt[type] === newValue)
            onChange(selectedOption || newValue)
          }}
          options={transformedOptions}
          disabled={disabled}
          placeholder={`Select ${label.toLowerCase()}...`}
        />
        <Button type="button" variant="outline" onClick={openDialog}>
          {buttonText}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => onChange("")} 
          disabled={!value}
        >
          Clear
        </Button>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {(!value || value === "default") ? "New" : "Edit"} {label}
            </DialogTitle>
            <DialogDescription>
              {(!value || value === "default") 
                ? `Enter a new ${label.toLowerCase()}.` 
                : `Edit the selected ${label.toLowerCase()}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="input-value" className="text-right">
                {label}
              </Label>
              <Input
                id="input-value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="col-span-3"
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
