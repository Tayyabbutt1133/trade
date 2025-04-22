"use client";
import { fonts } from "@/components/ui/font";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const containerVariants = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
  transition: { duration: 1 },
};

const textVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: (i = 1) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.3,
      type: "spring",
      stiffness: 200,
    },
  }),
};

const subHeadlineVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.5,
      duration: 1,
      ease: "easeOut",
    },
  },
};

const WelcomeIntro = () => {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");

    if (!hasVisited) {
      setShowIntro(true);
      localStorage.setItem("hasVisited", "true");

      const timer = setTimeout(() => {
        setShowIntro(false);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  const words = ["Welcome", "to", "TradeToppers"];

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={containerVariants}
          className="fixed top-0 left-0 w-full h-screen bg-gradient-to-r from-[#2c7e92] to-[#005a5a] z-[9999] flex flex-col items-center justify-center text-center px-4"
        >
          <div className="flex flex-wrap gap-3 justify-center items-center mb-6">
            {words.map((word, index) => (
              <motion.span
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className={`text-white ${fonts.lexendDeca} text-5xl md:text-7xl font-extrabold tracking-wide`}
              >
                {word === "TradeToppers" ? (
                  <span className="text-green-400">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={subHeadlineVariant}
            className={`text-white ${fonts.montserrat} text-xl md:text-2xl font-medium tracking-wide max-w-[90%] md:max-w-2xl`}
          >
            The most convenient way to acquire ingredients, polymers, and
            chemicals.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeIntro;
