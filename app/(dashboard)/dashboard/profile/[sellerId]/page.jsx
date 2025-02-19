import { ProfileForm } from "../components/ProfileForm";
import { SellerHeader } from "./sellerheader";

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
        {/* Use the client header component that determines the title */}
        {/* <SellerHeader sellerId={sellerId} /> */}
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
