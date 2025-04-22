"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Container from "@/components/container";
import { fonts } from "@/components/ui/font";
import Link from "next/link";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const ActivityFeed = React.memo(
  ({
    stats = {
      searches: "1000",
      quotes: "500",
    },
  }) => {
    const [productsCount, setProductsCount] = useState("0");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductsData = useCallback(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://tradetoppers.esoftideas.com/esi-api/responses/topcategories/"
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        if (
          data &&
          data.Products &&
          Array.isArray(data.Products) &&
          data.Products[0] &&
          data.Products[0].count
        ) {
          setProductsCount(data.Products[0].count.toString());
        } else {
          setProductsCount("1230");
          console.warn("Products count not found in API response");
        }
      } catch (err) {
        console.error("Error fetching products data:", err);
        setError(err.message);
        setProductsCount("1230");
      } finally {
        setIsLoading(false);
      }
    }, []);

    useEffect(() => {
      fetchProductsData();
    }, [fetchProductsData]);

    // Animated counter with no flickering
    const StatCard = React.memo(({ number, label, sublabel, loading }) => {
      const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

      return (
        <div ref={ref} className="bg-white border p-6">
          <div className="flex flex-col items-center justify-center min-h-[166px]">
            <p
              className={`text-4xl md:text-5xl font-mono text-[#37bfb1] mb-4`}
              style={{ minWidth: "100px", textAlign: "center" }} // 👈 Layout stability
            >
              {loading ? (
                "Loading..."
              ) : inView ? (
                <CountUp end={parseInt(number)} duration={2} />
              ) : (
                "0"
              )}
              +
            </p>
            <div className="text-gray-600">
              <p
                className={`text-lg font-bold ${fonts.montserrat} text-center`}
              >
                {label}
              </p>
              {sublabel && (
                <p
                  className={`text-lg font-bold ${fonts.montserrat} text-center`}
                >
                  {sublabel}
                </p>
              )}
            </div>
          </div>
        </div>
      );
    });

    const statsCards = useMemo(
      () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard number={stats.searches} label="Searches" />
          <StatCard
            number={productsCount}
            label="Products"
            loading={isLoading}
          />
          <StatCard number={stats.quotes} label="Cups of Coffee" />
        </div>
      ),
      [stats.searches, productsCount, stats.quotes, isLoading, StatCard]
    );

    return (
      <section className="py-24 bg-gray-50">
        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-16">
            <div>
              <p className={`${fonts.montserrat} text-gray-400 mb-3`}>
                Activity Feed
              </p>
              <h2
                className={`${fonts.montserrat} text-2xl font-semibold mb-8 leading-tight drop-shadow-[2px_2px_1px_rgba(0,0,0,0.2)]`}
              >
                The ultimate hub for industry innovation and discovery.
              </h2>
              <Link href={"/signup"}>
                <button
                  className={`bg-[#37bfb1] text-white px-8 py-3 rounded hover:bg-teal-600 transition-colors ${fonts.montserrat} font-medium`}
                >
                  Sign Up for FREE
                </button>
              </Link>
              {error && (
                <p className="text-red-500 mt-4">
                  Failed to load products data. Using fallback values.
                </p>
              )}
            </div>

            {statsCards}
          </div>
        </Container>
      </section>
    );
  }
);

ActivityFeed.displayName = "ActivityFeed";

export default ActivityFeed;
