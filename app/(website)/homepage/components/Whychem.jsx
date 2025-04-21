import React from "react";
import Container from "@/components/container";
import bg_img from "@/public/chembg.png";
import { fonts } from "@/components/ui/font";

const Whychem = () => {
  return (
    <section
      style={{
        backgroundImage: `url(${bg_img.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
      className="text-white min-h-screen"
    >
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the opacity as needed
        }}
      ></div>

      <Container>
        <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className={`${fonts.roboto} text-lg mb-2`}>Why Chem</p>
            <h1
              className={`${fonts.montserrat} text-2xl font-bold leading-tight mb-16 max-w-96`}
            >
              Propelling the world's most influential industry into the future.
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <p className={`text-[15px] ${fonts.montserrat} leading-relaxed`}>
              We streamline your sourcing process! Our platform connects
              manufacturers of paints, coatings, inks, adhesives and
              construction Chemicals with verified suppliers of specialty
              chemicals, resins, additives, and pigments. Save time, compare
              options, and discover a right product at best
              price—all in one place.
            </p>
            <p className={`text-[15px] ${fonts.montserrat} leading-relaxed`}>
              To empower professionals and organizations in the paints,
              adhesives, ink and allied chemical industries by curating a
              dynamic global platform for knowledge sharing, sustainable
              ingredient commerce, and cross-industry collaboration—driving
              measurable progress in innovation, efficiency, and
              environmental stewardship.
            </p>
          </div>
          <p
            className={`text-2xl font-medium ${fonts.montserrat} flex justify-end`}
          >
            We are excited to elevate your purchasing experience
            beyond expectations.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Whychem;
