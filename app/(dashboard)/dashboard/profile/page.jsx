// "use client";
// import Link from "next/link";
// import { PlusCircle } from "lucide-react";
// import { fonts } from "@/components/ui/font";
// import { DataTable } from "@/components/data-table";
// import TableActionBtn from "@/components/table-action-btn";
// import { useEffect, useState } from "react";
// // import roleAccessStore from "@/store/role-access-permission";

// export default function ProfilePage() {
//   const columns = [
//     { accessorKey: "name", header: "Name" },
//     { accessorKey: "email", header: "Email" },
//     { accessorKey: "phone", header: "Phone" },
//     { accessorKey: "address", header: "Address" },
//     { accessorKey: "country", header: "Country" },
//     {
//       accessorKey: "Actions",
//       cell: ({ row }) => <TableActionBtn page="seller" data={row.original} />,
//     },
//   ];

//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchdata = async () => {
//       const formData = new FormData();

//       const getUserId = await fetch("/api/auth/user");
//       const { userData } = await getUserId.json();
//       formData.append("regid", userData.id);
//       const userType = userData.type;

//       console.log(userData)

//       if (userType === "Seller") {
//         const res = await fetch(
//           `https://tradetoppers.esoftideas.com/esi-api/responses/seller/`,
//           {
//             method: "POST",
//             body: formData,
//           }
//         );
//         const data = await res.json();

//         // Transform the data to match column accessors
//         const transformedData = data.Sellers.map((seller) => ({
//           id: seller.id,
//           name: seller.sname,
//           email: seller.email,
//           phone: seller.compcontact,
//           address: seller.saddress,
//           country: seller.country || "-", // Using || '-' to show dash if null
//         }));

//         setData(transformedData);
//       }else if(userType === 'Buyer'){
//         const res = await fetch(`https://tradetoppers.esoftideas.com/esi-api/responses/buyer/`, {
//           method: "POST",
//           body: formData
//         });
//         const data = await res.json();
        
//         // Transform the data to match column accessors
//         const transformedData = data.Buyers.map(buyer => ({
//           id: buyer.id,
//           name: buyer.bname,
//           email: buyer.email,
//           phone: buyer.compcontact,
//           address: buyer.saddress,
//           country: buyer.country || '-',
//         }));

//         setData(transformedData);
//       }
//     };
//     fetchdata();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className={`text-3xl font-bold ml-14 ${fonts.montserrat} sm:ml-0`}>
//           Your Profile
//         </h1>

//         {!data.length === 0 ? null : 
//           <Link href="/dashboard/profile/new/">
//             <button
//               className={`flex items-center px-4 py-2 bg-black text-white rounded hover:bg-black capitalize ${fonts.montserrat}`}
//             >
//               <PlusCircle className="mr-2 h-4 w-4" />
//               Add Profile Detail
//             </button>
//           </Link>
//         }
//       </div>

//       {/* DataTable Component */}
//       <DataTable columns={columns} data={data} />
//     </div>
//   );
// }


import { ProfileForm } from "./components/ProfileForm";

export async function addSellerToDatabase(data) {
  // Create a FormData object
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  // Send the data to the Next.js API route
  const response = await fetch("/api/sellers", {
    method: "POST",
    body: formData,
  });

  // Handle errors
  if (!response.ok) {
    throw new Error("Failed to add seller");
  }

  return response.json();
}




const SellerDetailClient = async ({ params }) => {
  const sellerId = (await params).sellerId;
  console.log("Seller ID:", sellerId);

  try {
    const [countryRes, industryRes, designationRes] = await Promise.all([
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/country"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/industry"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/designation"),
    ]);

    if (!countryRes.ok || !industryRes.ok || !designationRes.ok) {
      throw new Error("One or more API requests failed");
    }

    const countryText = await countryRes.text();
    const industryText = await industryRes.text();
    const designationText = await designationRes.text();

    const countriesData = JSON.parse(countryText);
    const industriesData = JSON.parse(industryText);
    const designationsData = JSON.parse(designationText);

    const countries = countriesData?.Country || [];
    const industries = industriesData?.Industry || [];
    const designations = designationsData?.Designations || [];
  
    const countryCodes = countries.map((item) => item.code);

    return (
      <div className="container mx-auto py-10">

        <h1 className="sm:text-3xl text-2xl font-bold ml-14 sm:ml-0 capitalize mb-6">your profile</h1>
        <ProfileForm
          countries={countries}
          industries={industries}
          countrycodes={countryCodes}
          designations={designations}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Failed to load seller data. Please try again.</div>;
  }
};


export default SellerDetailClient;
