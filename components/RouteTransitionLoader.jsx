// components/RouteTransitionLoader.tsx
"use client";

import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RouteTransitionLoader() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center space-x-3 px-6 py-4 bg-white rounded-2xl shadow-xl border border-gray-200"
        >
          <Loader2 className="animate-spin w-6 h-6 text-teal-600 drop-shadow-md" />
          <p className="text-gray-700 text-base font-semibold tracking-wide">Loading, please wait...</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
