import React from "react";
import Container from "@/components/container";
import { fonts } from "@/components/ui/font";

const ActivityFeed = ({
  stats = {
    searches: "1.1M",
    samples: "38.4K",
    quotes: "18.8K",
  },
}) => {
  const StatCard = ({ number, label, sublabel }) => (
    <div className="bg-white border p-6">
      <div className="flex flex-col items-center justify-center min-h-[166px]">
        <p
          className={`text-4xl text-center md:text-5xl ${fonts.montserrat} text-[#37bfb1] mb-4`}
        >
          +{number}
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
              className={`${fonts.montserrat} text-2xl font-semibold mb-8 leading-tight`}
            >
              The industry's destination for discovery.
            </h2>
            <button
              className={`bg-[#37bfb1] text-white px-8 py-3 rounded hover:bg-teal-600 transition-colors ${fonts.montserrat} font-medium`}
            >
              Sign Up for FREE
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              number={stats.searches}
              label="Searches"
              sublabel="Completed"
            />
            <StatCard
              number={stats.samples}
              label="Samples"
              sublabel="Requested"
            />
            <StatCard
              number={stats.quotes}
              label="Quotes"
              sublabel="Received"
            />
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ActivityFeed;