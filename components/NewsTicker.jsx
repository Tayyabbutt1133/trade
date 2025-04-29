"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fonts } from "./ui/font";

export default function NewsTicker() {
  const messages = [
    "Please note, some features will not respond as long as website is under development/construction stage",
    "This website is in development and data uploading stage. Proper launching will be in a few month time.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 8000); // Change message every 8 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <>
      <div className="fixed top-0 w-full bg-teal-500 text-white py-2 shadow-md z-[9999] overflow-hidden flex px-4">
        {/* News Ticker (83%) */}
        <div className="w-[83%] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              <span className="mr-2">🔧</span>
              <span className={`${fonts.lexendDeca} font-medium`}>
                {messages[currentIndex]}
              </span>
              <span className="ml-2">🚧</span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Book & Advertisement (17%) */}
        <div
          className={`w-[17%] flex items-center justify-center text-sm font-semibold  
  bg-yellow-400 text-[#222c2e]  transition duration-300
  animate-pulse shadow-[0_0_8px_rgba(255,215,0,0.6)]
  ${fonts.lexendDeca}`}
        >
          📢 Book & Advertisement
        </div>
      </div>
    </>
  );
}
