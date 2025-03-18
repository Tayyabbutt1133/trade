import React from 'react';
import Container from '@/components/container';
import bg_img from '@/public/chembg.png';
import { fonts } from '@/components/ui/font';

const Whychem = () => {
  return (
    <section 
      style={{
        backgroundImage: `url(${bg_img.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
              position: 'relative',
      }}
      className="text-white min-h-screen"
    >
      {/* Dark overlay */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as needed
        }}
      ></div>

      <Container>
        <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className={`${fonts.roboto} text-lg mb-2`}>Why Chem</p>
            <h1 className={`${fonts.montserrat} text-2xl font-bold leading-tight mb-16 max-w-96`}>
            Propelling the world's most influential industry into the future.
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <p className={`text-[15px] ${fonts.montserrat} leading-relaxed`}>
            At Trade Toppers, we believe in the transformative power of chemistry. We are committed to providing seamless and efficient access to information and raw materials, empowering you to work smarter and faster—driving meaningful global impact.
            </p>
            <p className={`text-[15px] ${fonts.montserrat} leading-relaxed`}>
            Your innovations have reduced the automotive industry's carbon footprint, reimagined a sustainable future for agriculture, created biodegradable packaging alternatives, and revolutionized connectivity—just to name a few. And this is just the beginning.
            </p>
          </div>
          <p className={`text-2xl font-medium ${fonts.montserrat} flex justify-end`}>
          We are excited to elevate your purchasing experience beyond expectations.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Whychem;
