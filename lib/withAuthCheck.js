"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function withAuthCheck(Component) {
  return function ProtectedComponent(props) {
    const router = useRouter();
    const pathname = usePathname();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Function to fetch user data from API
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/auth/user");
          const { userData } = await response.json();
          setUserData(userData);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserData();
    }, []);

    // Handle redirect in useEffect, not during render
    useEffect(() => {
      if (!isLoading && isPendingAndRestricted()) {
        router.push("/dashboard/profile");
      }
    }, [isLoading, pathname, router]);

    // Check if registration is pending and should be restricted
    const isPendingAndRestricted = () => {
      if (!userData) return false;

      // Check if the user is pending registration
      const isPending =
        (userData.type === "seller" || userData.type === "buyer" || 
         userData.type === "Seller" || userData.type === "Buyer") &&
        (userData.body === "Pending Registeration" ||
         userData.body === "Pending");

      // List of allowed paths for pending users
      const allowedPaths = ["/dashboard/profile", "/signin"];

      // Return true if the user is pending and trying to access a restricted path
      return isPending && !allowedPaths.includes(pathname);
    };

    // Handle loading state
    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-xl animate-pulse">Loading...</p>
        </div>
      );
    }

    return (
      <>
        <Component {...props} userData={userData} />
      </>
    );
  };
}