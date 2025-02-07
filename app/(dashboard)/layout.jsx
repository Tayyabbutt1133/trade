import { SellerForm } from "./dashboard/seller/components/SellerForm";
import roleAccessStore from "@/store/role-access-permission";

export async function addSellerToDatabase(data) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  const response = await fetch("/api/sellers", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to add seller");
  }

  return response.json();
}

const SellerDetailClient = async ({ params }) => {
  const sellerId = (await params).sellerId;
  const roleData = roleAccessStore.getState().role; // Get role data from Zustand

  console.log("Zustand Response in dashboard", roleData);
  console.log(sellerId);

  try {
    const [countryRes, industryRes, designationRes] = await Promise.all([
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/country"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/industry"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/designation"),
    ]);

    if (!countryRes.ok || !industryRes.ok || !designationRes.ok) {
      throw new Error("One or more API requests failed");
    }

    const countriesData = await countryRes.json();
    const industriesData = await industryRes.json();
    const designationsData = await designationRes.json();

    const countries = countriesData?.Country || [];
    const industries = industriesData?.Industry || [];
    const designations = designationsData?.Designations || [];
    const countryCodes = countries.map((item) => item.code);

    let pageTitle = "Unauthorized Access";
    if (roleData === "admin") {
      pageTitle = sellerId === "new" ? "Add New Seller" : "Edit Seller";
    } else if (roleData === "buyer") {
      pageTitle = "Buyer";
    } else if (roleData === "seller") {
      pageTitle = "Seller";
    }

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">{pageTitle}</h1>
        {roleData === "admin" ? (
          <SellerForm
            countries={countries}
            industries={industries}
            countrycodes={countryCodes}
            designations={designations}
          />
        ) : (
          <p className="text-lg text-gray-700">You do not have permission to access this page.</p>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Failed to load seller data. Please try again.</div>;
  }
};

export default SellerDetailClient;
