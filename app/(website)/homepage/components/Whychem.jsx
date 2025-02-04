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
            <p className={`${fonts.roboto} text-lg mb-2`}>Why Chemistry</p>
            <h1 className={`${fonts.montserrat} text-2xl font-bold leading-tight mb-16 max-w-96`}>
              Driving the world's most impactful industry forward.
            </h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <p className={`text-[15px] ${fonts.montserrat} leading-relaxed`}>
              At trade toppers, we believe in the power of chemistry. We believe that easy and efficient access to information and raw materials enables you to work smarter and faster so you can continue to make a rich global impact.
            </p>
            <p className={`text-[15px] ${fonts.montserrat} leading-relaxed`}>
              Your innovations have decreased the carbon footprint of the automotive industry, imagined a sustainable agricultural future, developed alternative, biodegradable packaging materials, and changed the landscape of connectivity forever – to name a few. This is only the beginning.
            </p>
          </div>
          <p className={`text-2xl font-medium ${fonts.montserrat} flex justify-end`}>
            We can't wait to see what you create with trade toppers.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Whychem;
