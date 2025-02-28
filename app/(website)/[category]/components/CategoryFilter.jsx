"use client";

import { fonts } from "@/components/ui/font";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChartNoAxesCombined } from "lucide-react";

export default function CategoryFilters({ catid, maincatid = null }) {
  const containerRef = useRef(null);
  const buttonRefs = useRef([]);
  const [visibleCount, setVisibleCount] = useState(0);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!catid) return; // Ensure we have a category ID before fetching

    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append("main", catid); // Send `catid` instead of non-existent `decodedcategory`

        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/menu/",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        console.log("Fetched Data:", data);

        if (data.Records && data.Records.length > 0) {
          const mainCategoryData = data.Records[0][catid];

          if (mainCategoryData && mainCategoryData.length > 0) {
            const subCategories = mainCategoryData[0];

            if (maincatid) {
              // If `maincatid` exists, show subcategories of that category
              if (subCategories[maincatid]) {
                setItems(subCategories[maincatid]);
                setVisibleCount(subCategories[maincatid].length);
              } else {
                setItems([]);
              }
            } else {
              // If no `maincatid`, show the main category options
              setItems(Object.keys(subCategories));
              setVisibleCount(Object.keys(subCategories).length);
            }
          } else {
            setItems([]);
          }
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [catid, maincatid]); // Ensure correct dependency names

  const calculateVisibleButtons = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const gap = 8;
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

    if (window.innerWidth < 640 && count < 9) {
      count = 9;
    }
    if (window.innerWidth >= 1024) {
      count = items.length;
    }

    setVisibleCount(count);
  };

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
  }, [items]);

  return (
    <div ref={containerRef} className={`${fonts.montserrat} w-full my-10 mb-10`}>
      <div className="flex flex-wrap gap-2">
        {items.slice(0, visibleCount).map((item, index) => (
          <Link
            key={index}
            href={
              maincatid
                ? `/${catid}/${maincatid}/${encodeURIComponent(item)}`
                : `/${catid}/${encodeURIComponent(item)}`
            }
            ref={(el) => (buttonRefs.current[index] = el)}
            className="inline-flex items-center px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
          >
            <ChartNoAxesCombined className="w-4 h-4 mr-2" />
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
