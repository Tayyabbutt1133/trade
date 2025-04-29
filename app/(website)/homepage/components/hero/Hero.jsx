import Container from "@/components/container";
import { fonts } from "@/components/ui/font";
import React from "react";
import Image from "next/image";
import TabsMenu from "../tabs/TabsMenu";
import advertisement from "./../../../../../public/grow_ads.png";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="">
      <div className="mb-16 mt-6 mx-4">
        <Image
          src={advertisement}
          alt="Advertisement"
          className="w-full h-auto max-h-[400px] rounded-sm"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 70vw"
        />
      </div>

      <Container className={`${fonts.montserrat}`}>
        <div className="w-full">
          {/* Advertisement Placeholder */}
          <div>
            <h1 className="text-3xl lg:text-[42px] font-semibold tracking-tight leading-[48px] text-[#222c2e] max-w-[560px] mb-10 drop-shadow-[4px_4px_2px_rgba(0,0,0,0.25)]">
              The most convenient way to acquire ingredients, polymers, and
              chemicals.
            </h1>
            <p>
              Search and explore products from suppliers around the globe —
              <span className="font-semibold text-[#222c2e]">
                all in one place.
              </span>
            </p>
            <Link href={"/contact-us"}>
              <p className="underline font-extrabold">
                Ask us about your biggest sourcing challenge?
              </p>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
