"use client";
import "./globals.css";
import Navbar from "./(website)/homepage/components/Navbar/Navbar";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Monitoring } from 'react-scan/monitoring/next'
import NewsTicker from "@/components/NewsTicker";
export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check if the current route is either '/dashboard' or '/expoevents'
  const isHiddenRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/expoevents");

  return (
    <html lang="en">
      <head>
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head>
      <body
        suppressHydrationWarning >
        <Monitoring
          apiKey="i0__qb8huyw_GWMgr29BMR7cmvDai3o1" // Safe to expose publically
          url="https://monitoring.react-scan.com/api/v1/ingest"
          commit={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA} // optional but recommended
          branch={process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF} // optional but recommended
        />
        {/* {!isHiddenRoute && <NewsTicker />} */}
        {/* Show Navbar and Footer only if not on dashboard or expoevents routes */}
        {!isHiddenRoute && <Navbar />}
        {children}
        {!isHiddenRoute && <Footer />}
      </body>
    </html>
  );
}
