import React from "react";
import Container from "@/components/container";
import { fonts } from "@/components/ui/font";
import Link from "next/link";

const ActivityFeed = ({
  stats = {
    searches: "1000",
    products: "1230",
    quotes: "500",
  },
}) => {
  const StatCard = ({ number, label, sublabel }) => (
    <div className="bg-white border p-6">
      <div className="flex flex-col items-center justify-center min-h-[166px]">
        <p
          className={`text-4xl text-center md:text-5xl ${fonts.montserrat} text-[#37bfb1] mb-4`}
        >
          {number}+
        </p>
        <div className="text-gray-600">
          <p className={`text-lg font-bold ${fonts.montserrat} text-center`}>
            {label}
          </p>
          <p className={`text-lg font-bold ${fonts.montserrat} text-center`}>
            {sublabel}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-24 bg-gray-50">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-16">
          <div className="">
            <p className={`${fonts.montserrat} text-gray-400 mb-3`}>
              Activity Feed
            </p>
            <h2
              className={`${fonts.montserrat} drop-shadow-[2px_2px_1px_rgba(0,0,0,0.2)] text-2xl font-semibold mb-8 leading-tight`}
            >
              The ultimate hub for industry innovation and discovery.
            </h2>
            <Link href={'/signup'}>
            <button
              className={`bg-[#37bfb1] text-white px-8 py-3 rounded hover:bg-teal-600 transition-colors ${fonts.montserrat} font-medium`}
            >
              Sign Up for FREE
            </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              number={stats.searches}
              label="Searches"
              // sublabel="Completed"
            />
            <StatCard
              number={stats.products}
              label="Products"
              // sublabel="Requested"
            />
            <StatCard
              number={stats.quotes}
              label="cup of coffees"
              // sublabel="Received"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ActivityFeed;