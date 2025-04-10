'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const showcaseData = [
  {
    subtitle: "Insights and Innovation",
    title: "Get new products to market, fast.",
    logo: "/Lubrizol Logo.webp",
    heading: "Beauty by Lubrizol Life Science",
    description: "LLS partners with customers to develop, manufacture and market a broad range of differentiated ingredients for skin care, hair care and skin cleansing.",
    image: "/Lubrizol Insights.webp",
    cta: {
      text: "Discover LLS Beauty",
      link: "#"
    }
  },
  // Add more showcase items as needed
]

export default function InsightsAndInnovations() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ skipSnaps: false })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState([])

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    return () => emblaApi.off('select', onSelect)
  }, [emblaApi, onSelect])

  return (
    <div className="relative overflow-hidden">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {showcaseData.map((item, index) => (
            <div
              className="flex-[0_0_100%] min-w-0"
              key={index}
            >
              <div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4 py-16">
                <div className="relative aspect-[3/4] md:aspect-auto md:h-[600px] [display:none] md:block">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="space-y-6">
                  <p className="text-gray-600 text-lg">{item.subtitle}</p>
                  <h2 className="text-4xl md:text-5xl drop-shadow-[2px_2px_1px_rgba(0,0,0,0.2)] font-bold text-gray-900 leading-tight">
                    {item.title}
                  </h2>
                  <div className="h-12 relative">
                    <Image
                      src={item.logo}
                      alt="Company Logo"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {item.heading}
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {item.description}
                  </p>
                  <Button 
                    size="lg" 
                    variant="default"
                    className="bg-[#37bfb1] hover:bg-teal-600 text-white w-full md:w-auto"
                  >
                    {item.cta.text}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              selectedIndex === index ? 'bg-gray-900' : 'bg-gray-300'
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

