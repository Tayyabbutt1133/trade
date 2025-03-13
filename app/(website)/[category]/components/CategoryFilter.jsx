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
  const [noRecordsMessage, setNoRecordsMessage] = useState("");

  useEffect(() => {
    if (!catid) return; // Ensure we have a category ID before fetching

    const fetchData = async () => {
      try {
        const formData = new FormData();
        formData.append("main", catid); // The API param

        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/menu/",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        console.log("Fetched Data:", data);

        // --- 1) Check for "No Record" at top-level (body property) ---
        if (
          Array.isArray(data.Records) &&
          data.Records.length === 1 &&
          (data.Records[0]?.body === "No Record" ||
            data.Records[0]?.body === "No Records found")
        ) {
          setItems([]);
          setNoRecordsMessage("No categories found.");
          return;
        }

        // --- 2) Parse normal data structure ---
        if (data.Records && data.Records.length > 0) {
          const mainCategoryData = data.Records[0][catid];

          if (mainCategoryData && mainCategoryData.length > 0) {
            // This is usually an array of objects: e.g. [ { someCategory: [...] } ]
            const subCategories = mainCategoryData[0];

            // If we have a maincatid (e.g. second/third layer)
            if (maincatid) {
              if (subCategories[maincatid]) {
                // subCategories[maincatid] might be ["No Record"] or real items
                const subItems = subCategories[maincatid];
                if (
                  Array.isArray(subItems) &&
                  subItems.length === 1 &&
                  subItems[0] === "No Record"
                ) {
                  // We found the literal string "No Record" in the array
                  setItems([]);
                  setNoRecordsMessage("No categories found.");
                } else {
                  setItems(subItems);
                  setNoRecordsMessage("");
                  setVisibleCount(subItems.length);
                }
              } else {
                setItems([]);
                setNoRecordsMessage("No categories found.");
              }
            } else {
              // If no maincatid, show top-level category options
              const topKeys = Object.keys(subCategories);
              // Check if the only key is "No Record"
              if (topKeys.length === 1 && topKeys[0] === "No Record") {
                setItems([]);
                setNoRecordsMessage("No categories found.");
              } else {
                setItems(topKeys);
                setNoRecordsMessage("");
                setVisibleCount(topKeys.length);
              }
            }
          } else {
            setItems([]);
            setNoRecordsMessage("No categories found.");
          }
        } else {
          setItems([]);
          setNoRecordsMessage("No categories found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setItems([]);
        setNoRecordsMessage("Error fetching categories.");
      }
    };

    fetchData();
  }, [catid, maincatid]);

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

    // If mobile and fewer than 9 buttons fit, show at least 9
    if (window.innerWidth < 640 && count < 9) {
      count = 9;
    }
    // If large screens (>= 1024), show all
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
      {items.length === 0 && noRecordsMessage ? (
        <p className="text-gray-500 text-sm">{noRecordsMessage}</p>
      ) : (
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
      )}
    </div>
  );
}
