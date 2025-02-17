import React from "react";
import Image from "next/image";
import { fonts } from "@/components/ui/font";
import vision from "@/public/vision.png";
import mission from "@/public/mission.png";
import purpose from "@/public/purpose.png";
import Container from "@/components/container";

const TradeStory = () => {
  return (
    <>
      <Container>
        {/* vision */}
        <div className="flex flex-col md:flex-row items-center py-16  gap-8">
          {/* Left side: Image */}
          <div className="md:w-1/2">
            <Image
              alt="Vision"
              src={vision}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Right side: Text */}
          <div className="md:w-1/2 md:pl-10">
            <h1
              className={`${fonts.montserrat} font-bold text-5xl text-gray-800`}
            >
              Vision
            </h1>
            <p
              className={`mt-6 text-lg ${fonts.montserrat} text-gray-600 leading-relaxed`}
            >
              To become the world’s most trusted hub for sustainable material
              science, where chemists, engineers, and enterprises collaborate to
              transform industrial practices and pioneer solutions for a greener
              future.
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-start py-16 gap-12">
          {/* Left side: Text */}
          <div className="md:w-1/2 md:pl-10">
            <h1
              className={`${fonts.montserrat} font-bold text-5xl text-gray-900`}
            >
              Mission
            </h1>
            <p
              className={`mt-6 text-lg ${fonts.montserrat} text-gray-700 leading-relaxed`}
            >
              We equip professionals and organizations with the tools,
              expertise, and marketplace they need to thrive. Through our
              platform, we:
            </p>
            <ul
              className={`mt-6 list-none list-inside text-lg ${fonts.montserrat} text-gray-700 leading-relaxed space-y-3`}
            >
              <li>
                Connect buyers with verified, eco-certified suppliers in a
                transparent B2B marketplace.
              </li>
              <li>
                Build trust through verified suppliers, real-time regulatory
                updates, and collaborative forums for cross-departmental
                problem-solving.
              </li>
              <li>
                Deliver actionable insights on regulatory trends, cutting-edge
                technologies, and sustainability benchmarks.
              </li>
              <li>
                Stay at the forefront of industry trends, technologies, and
                regulatory developments, ensuring our members are informed and
                equipped to succeed.
              </li>
              <li>
                Promote sustainable practices, environmental responsibility, and
                social accountability throughout the industries we serve.
              </li>
            </ul>
          </div>
          {/* Right side: Image */}
          <div className="md:w-1/2 h-full my-14 flex items-center">
            <Image
              alt="Mission"
              src={mission}
              className="w-full h-[500px] object-cover rounded-xl shadow-xl"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center py-16  gap-8">
          <div className="md:w-1/2">
            <Image
              alt="Vision"
              src={purpose}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-1/2 md:pl-10">
            <h1
              className={`${fonts.montserrat} font-bold text-5xl text-gray-800`}
            >
              Purpose
            </h1>
            <p
              className={`mt-6 text-lg ${fonts.montserrat} text-gray-600 leading-relaxed`}
            >
              To empower professionals and organizations in the paints,
              adhesives, ink and allied chemical industries by curating a
              dynamic global platform for knowledge sharing, sustainable
              ingredient commerce, and cross-industry collaboration—driving
              measurable progress in innovation, efficiency, and environmental
              stewardship.
            </p>
          </div>
        </div>
      </Container>
    </>
  );
};

export default TradeStory;
