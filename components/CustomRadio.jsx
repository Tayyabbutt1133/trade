// import type React from "react"
import { useState } from "react"

// interface CustomRadioProps {
//   options: { value: string; label: string }[]
//   name: string
//   defaultValue?: string
//   onChange: (value: string) => void
// }

export const CustomRadio = ({ options, name, defaultValue, onChange }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue || "")

  const handleChange = (value) => {
    setSelectedValue(value)
    onChange(value)
  }

  return (
    <div className="flex space-x-4">
      {options.map((option) => (
        <label key={option.value} className="flex items-center cursor-pointer group">
          <div className="relative w-6 h-6 mr-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => handleChange(option.value)}
              className="absolute w-full h-full opacity-0 cursor-pointer"
            />
            <div
              className={`w-full h-full border-2 rounded-full transition-all duration-200 ${
                selectedValue === option.value
                  ? "border-[#37bfb1] bg-[#37bfb1]"
                  : "border-gray-300 group-hover:border-[#37bfb1]"
              }`}
            >
              {selectedValue === option.value && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-scale-in" />
                </div>
              )}
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  )
}

