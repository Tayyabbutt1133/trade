"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Container from "@/components/container";
import { fonts } from "@/components/ui/font";

const testimonials = [
  {
    quote:
      "TradeTroppers is especially helping us with newer, smaller but up-and-coming suppliers that are useful to have on our radar especially in the field of Sustainability.",
    author: "Unilever",
    position: "Team Leader",
    image: "/building 1.jpg",
  },
  {
    quote:
      "Purchasing ingredients should always be this easy!",
    author: "Curio Wellness",
    position: "Procurement Rep",
    image: "/building 2.jpg",
  },
  {
    quote:
      "It's an amazing website to search for chemicals and more!",
    author: "Diamond",
    position: "Team Member",
    image: "/building 3.jpg",
  },
];

export default function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ skipSnaps: false });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <Container className={`relative px-4 py-8 mx-auto my-20 ${fonts.montserrat}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div className="flex-[0_0_100%] min-w-0 relative px-4" key={index}>
              <div className="grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-5">
                  <div className="aspect-[4/3] relative rounded-2xl overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-7">
                  <blockquote>
                    <p className="text-lg md:text-xl lg:text-2xl font-medium  leading-relaxed text-gray-900 mb-8">
                      {testimonial.quote}
                    </p>
                    <footer>
                      <p className="text-lg font-semibold text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-base text-gray-600">
                        {testimonial.position}
                      </p>
                    </footer>
                  </blockquote>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-colors",
              selectedIndex === index ? "bg-primary" : "bg-gray-300"
            )}
            onClick={() => scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Container>
  );
}
