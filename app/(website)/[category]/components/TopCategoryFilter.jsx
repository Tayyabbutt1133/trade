import { CALLFILTER } from "@/app/actions/callTopfilters";
import React from "react";
import { ChartNoAxesCombined } from "lucide-react";
import Link from "next/link";
import { fonts } from "@/components/ui/font";

const TopCategoryFilter = async () => {
  console.log("Top category filter component rendered !");

  // Fisher–Yates shuffle
  const shuffleArray = (array) => {
    const shuffled = [...array]; // clone array to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const response = await CALLFILTER();
  const get_response_object = response.data[0];
  // ✅ Extract top-level categories only once
  const topCategories = shuffleArray(Object.entries(get_response_object));

  return (
    <>
      {/* Browse our top categories */}
      <div>
        <h1 className={`text-3xl font-bold ${fonts.montserrat}`}>
          Browse Categories
        </h1>
        <div className="flex flex-wrap gap-3 mt-6">
          {topCategories.map(([topCategory]) => (
            <div key={topCategory}>
              <Link href={`/${topCategory}`}>
                <p className="cursor-pointer inline-flex items-center px-4 py-2 rounded-full border border-gray-200 font-serif bg-white hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
                  <ChartNoAxesCombined className="w-4 h-4 mr-2" />
                  {topCategory}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Browse our Main Categories */}
      <div>
        <h1 className={`text-3xl font-bold ${fonts.montserrat}`}>
          Browse Main Categories
        </h1>
        <div className="flex flex-wrap gap-3 mt-6">
          {topCategories.map(([topCategory, secondLevelArray]) => {
            if (
              Array.isArray(secondLevelArray) &&
              secondLevelArray.length > 0
            ) {
              return Object.keys(secondLevelArray[0]).map((subCategory) => (
                <div key={`${topCategory}-${subCategory}`}>
                  <Link href={`/${topCategory}/${subCategory}`}>
                    <p className="cursor-pointer inline-flex items-center px-4 py-2 rounded-full border border-gray-200 font-serif bg-white hover:bg-gray-50 transition-colors text-sm whitespace-nowrap">
                      <ChartNoAxesCombined className="w-4 h-4 mr-2" />
                      {subCategory}
                    </p>
                  </Link>
                </div>
              ));
            }
          })}
        </div>
      </div>
    </>
  );
};

export default TopCategoryFilter;
