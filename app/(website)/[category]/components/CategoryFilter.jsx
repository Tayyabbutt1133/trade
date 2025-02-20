"use client";

import { fonts } from "@/components/ui/font";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function CategoryFilters({ decodedcategory }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    // Only fetch if we have a valid decodedcategory
    if (!decodedcategory) return;

    const fetchSubcategories = async () => {
      try {
        // Create FormData and append the category
        const formData = new FormData();
        formData.append("category", decodedcategory);

        // Make the POST request
        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/topsubcategories/",
          {
            method: "POST",
            body: formData,
          }
        );

        // Parse the JSON
        const data = await response.json();
        console.log("Fetched subcategories:", data);

        // Update state if we have a valid records array
        if (data.Records && data.Records.length) {
          setSubcategories(data.Records);
          setVisibleCount(data.Records.length);
        } else {
          setSubcategories([]);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [decodedcategory]);

  // Calculates how many subcategory buttons fit in the container
  const calculateVisibleButtons = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const gap = 8; // gap-2 = 0.5rem = 8px
    let currentRowWidth = 0;
    let rowCount = 1;
    let count = 0;

    for (let i = 0; i < buttonRefs.current.length; i++) {
      const button = buttonRefs.current[i];
      if (!button) continue;

      const buttonWidth = button.offsetWidth + gap;

      if (currentRowWidth + buttonWidth > containerWidth) {
        currentRowWidth = buttonWidth;
        rowCount++;
      } else {
        currentRowWidth += buttonWidth;
      }

      const maxRows = window.innerWidth < 640 ? 2 : 3;
      if (rowCount > maxRows) break;

      count = i + 1;
    }

    // Ensure minimum of 9 buttons on smaller screens
    if (window.innerWidth < 640 && count < 9) {
      count = 9;
    }
    // Show all subcategories on larger screens
    if (window.innerWidth >= 1024) {
      count = subcategories.length;
    }

    setVisibleCount(count);
  };

  // Recalculate button visibility on subcategories change or container resize
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateVisibleButtons();
    }, 0);

    const resizeObserver = new ResizeObserver(() => {
      calculateVisibleButtons();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [subcategories]);

  return (
    <div ref={containerRef} className={`${fonts.montserrat} w-full my-10 mb-10`}>
      <div className="flex flex-wrap gap-2">
        {subcategories.slice(0, visibleCount).map((item, index) => (
          <Link
            key={item.id}
            href={`/${decodedcategory}/${encodeURIComponent(item.subcategory)}`}
            ref={(el) => (buttonRefs.current[index] = el)}
            className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
          >
            {item.imgpath ? (
              <img
                src={
                  item.imgpath.startsWith("http")
                    ? item.imgpath
                    : `https://${item.imgpath}`
                }
                alt={item.subcategory}
                className="w-4 h-4 mr-2"
              />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            {item.subcategory}
          </Link>
        ))}
      </div>
    </div>
  );
}
