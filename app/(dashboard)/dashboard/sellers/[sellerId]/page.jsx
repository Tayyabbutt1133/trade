import { SellerForm } from "../components/SellerForm";

export async function addSellerToDatabase(data) {
  // Create a FormData object on the server from the plain data.
  const formData = new FormData();

  // Loop through each key in the data and append it to formData.
  // (If you have files, you'll need to handle them appropriately.)
  for (const key in data) {
    formData.append(key, data[key]);
  }

  // Make the POST request to your external API.
  const response = await fetch(
    "https://tradetoppers.esoftideas.com/esi-api/requests/seller/",
    {
      method: "POST",
      body: formData,
      credentials: "include",
      mode: "cors",
    }
  );

  // Check for errors and return the result.
  if (!response.ok) {
    throw new Error("Failed to add seller");
  }
  return response.json();
}


const SellerDetailClient = async ({params}) => {
  const sellerId = (await params).sellerId;
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        {sellerId === "new" ? "Add New Seller" : "Edit Seller"}
      </h1>
      <div>
        <SellerForm />
      </div>
    </div>
  );
};

export default SellerDetailClient;
