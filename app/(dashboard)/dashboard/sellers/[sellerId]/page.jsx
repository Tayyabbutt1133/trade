import { SellerForm } from "../components/SellerForm";

export async function addSellerToDatabase(data) {
  // Create a FormData object
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }

  // Send the data to the Next.js API route
  // const response = await fetch('/api/sellers', {
  //   method: 'POST',
  //   body: formData,
  // });

  // Handle errors
  if (!response.ok) {
    throw new Error('Failed to add seller');
  }

  return response.json();
}

const SellerDetailClient = async ({ params }) => {
  const sellerId =  (await params).sellerId;

  try {
    const [countryRes, industryRes, designationRes] = await Promise.all([
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/country"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/industry"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/designation"),
    ]);

    const [countries, industries, designations] = await Promise.all([
      countryRes.json(),
      industryRes.json(),
      designationRes.json(),
    ]);

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">
          {sellerId === "new" ? "Add New Seller" : "Edit Seller"}
        </h1>
        <SellerForm
          countries={countries?.Country || []}
          industries={industries?.Industry || []}
          designations={designations?.Designations || []}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    return <div>Failed to load seller data. Please try again.</div>;
  }
};

export default SellerDetailClient;

