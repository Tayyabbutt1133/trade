"use client";
import "./globals.css";
import Navbar from "./(website)/homepage/components/Navbar/Navbar";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Check if the current route is either '/dashboard' or '/expoevents'
  const isHiddenRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/expoevents");

  return (
    <html lang="en">
      <body>
        {/* Show Navbar and Footer only if not on dashboard or expoevents routes */}
        {!isHiddenRoute && <Navbar />}
        {children}
        {!isHiddenRoute && <Footer />}
      </body>
    </html>
  );
}
