import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function FunctionInput({ functions, setFunctions, existingFunctions }) {
  const [inputValue, setInputValue] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputValue) {
      const filteredResults = existingFunctions.filter(
        (func) => func.toLowerCase().includes(inputValue.toLowerCase()) && !functions.includes(func),
      )
      setSearchResults(filteredResults)
    } else {
      setSearchResults([])
    }
  }, [inputValue, existingFunctions, functions])

  const addFunction = (func) => {
    if (func && !functions.includes(func)) {
      setFunctions((prev) => [...prev, func])
      setInputValue("")
      setSearchResults([])
      inputRef.current?.focus()
    }
  }

  const removeFunction = (func) => {
    setFunctions((prev) => prev.filter((f) => f !== func))
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addFunction(inputValue)
    }
  }

  return (
    <div className="grid gap-2">
      <Label htmlFor="product-function">Chemical Function</Label>
      <div className="relative">
        <Input
          id="product-function"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter chemical function and press Enter"
          ref={inputRef}
        />
        {searchResults.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto">
            {searchResults.map((result) => (
              <li
                key={result}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => addFunction(result)}
              >
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {functions.map((func) => (
          <div key={func} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md flex items-center">
            {func}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-4 w-4"
              onClick={() => removeFunction(func)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

