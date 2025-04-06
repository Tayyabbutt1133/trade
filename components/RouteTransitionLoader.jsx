// components/RouteTransitionLoader.tsx
'use client';

import { Loader2 } from "lucide-react";

export default function RouteTransitionLoader() {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="flex items-center space-x-2">
        <Loader2 className="animate-spin w-8 h-8 text-black" />
        <p className="text-black text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
