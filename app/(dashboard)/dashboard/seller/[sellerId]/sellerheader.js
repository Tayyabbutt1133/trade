// components/SellerHeader.js
"use client";

import roleAccessStore from "@/store/role-access-permission";

export function SellerHeader({ sellerId }) {
  // Retrieve the role from Zustand.
  const roleData = roleAccessStore((state) => state.role);
    console.log(roleData);
  let headerText = "";
  if (roleData?.type === "admin") {
    headerText = sellerId === "new" ? "Add New Seller" : "Edit Seller";
  } else if (roleData?.type === "seller") {
    headerText = sellerId === "new" ? "Your Profile" : "Edit Profile";
  } else {
    headerText = "Seller Detail";
  }

  return (
    <h1 className="text-3xl font-bold mb-6">
      {headerText}
    </h1>
  );
}
