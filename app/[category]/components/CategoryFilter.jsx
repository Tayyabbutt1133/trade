'use client'

import { fonts } from "@/components/ui/font"
import { TrendingUp } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const categories = [
  "Corn",
  "Potato",
  "Grape",
  "Tomato",
  "Apple",
  "Sprayers",
  "Foliage Applied",
  "Ground Soil Applied",
  "Chemigation",
  "Aerial Application",
  "Concentrate Solutions",
  "Granules",
  "Water-Soluble Packaging",
  "Emulsifiable Concentrates",
  "Water-Dispersible Granules (WDG)",
  "Fertilizer",
  "Micronutrient",
  "Herbicide",
  "Insecticide",
  "Other Categories"
]

export default function CategoryFilters() {
  const containerRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(categories.length) // Start with all categories
  const buttonRefs = useRef([])

  const calculateVisibleButtons = () => {
    if (!containerRef.current) return

    const container = containerRef.current
    const containerWidth = container.offsetWidth
    const firstButton = buttonRefs.current[0]
    
    if (!firstButton) return

    const buttonHeight = firstButton.offsetHeight
    const gap = 8 // gap-2 = 0.5rem = 8px
    
    let currentRowWidth = 0
    let rowCount = 1
    let count = 0

    // Calculate how many buttons fit
    for (let i = 0; i < buttonRefs.current.length; i++) {
      const button = buttonRefs.current[i]
      if (!button) continue

      const buttonWidth = button.offsetWidth + gap

      if (currentRowWidth + buttonWidth > containerWidth) {
        currentRowWidth = buttonWidth
        rowCount++
      } else {
        currentRowWidth += buttonWidth
      }

      // Determine max rows based on screen width
      const maxRows = window.innerWidth < 640 ? 2 : 3
      
      if (rowCount > maxRows) {
        break
      }
      
      count = i + 1
    }

    // Ensure minimum of 9 buttons on mobile
    if (window.innerWidth < 640 && count < 9) {
      count = 9
    }

    // Show all categories on larger screens
    if (window.innerWidth >= 1024) {
      count = categories.length
    }

    setVisibleCount(count)
  }

  useEffect(() => {
    // Initial render with all categories
    setVisibleCount(categories.length)

    // Wait for buttons to be rendered and measured
    const timer = setTimeout(() => {
      calculateVisibleButtons()
    }, 0)

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleButtons()
    })

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    // Cleanup
    return () => {
      clearTimeout(timer)
      resizeObserver.disconnect()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`${fonts.montserrat} w-full my-10 mb-10`}
    >
      <div className="flex flex-wrap gap-2">
        {categories.slice(0, visibleCount).map((category, index) => (
          <button
            key={category}
            ref={el => buttonRefs.current[index] = el}
            className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            {category}
          </button>
        ))}
      </div>
    </div>
  )
}