import Container from "@/components/container";
import { fonts } from "@/components/ui/font";
import React from "react";
import TabsMenu from "../tabs/TabsMenu";


const Hero = () => {
  return (
    <section className="">
      <Container className={`${fonts.montserrat}`}>
        <div className="w-full mt-9">
          {/* Advertisement Placeholder */}
          <div className="mb-16 py-16 bg-green-300 text-center text-gray-700">
            Advertisement
          </div>
          <div>
            <h1 className="text-3xl lg:text-[42px] font-semibold tracking-tight leading-[48px] text-[#222c2e] max-w-[560px] mb-10">
              The easiest way to source ingredients, polymers and chemistry.
            </h1>
            <p>
              Search, sample, quote and purchase from 8,000+ suppliers —{" "}
              <span className="font-semibold text-[#222c2e]">
                all in one place.
              </span>
            </p>
          </div>       
        </div>
      </Container>
    </section>
  );
};

export default Hero;
