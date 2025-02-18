import { AudienceForm } from "../components/AudienceForm";

const AudienceFormPage = async ({ params }) => {
  const audienceId = (await params).audienceId; // assuming params is not a Promise
  const isNewAudience = audienceId === "new";

  try {
    // Create form-data for buyers and sellers endpoints.
    const formData = new URLSearchParams();
    formData.append("regid", "0");

    const [
      countryRes,
      industryRes,
      RegionRes,
      designationRes,
      buyersRes,
      sellersRes,
    ] = await Promise.all([
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/country"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/industry"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/region"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/designation"),
      // Pass form-data for buyers
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/buyers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }),
      // Pass form-data for sellers
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/seller/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      }),
    ]);

    // Check if responses are OK
    if (
      !countryRes.ok ||
      !industryRes.ok ||
      !RegionRes.ok ||
      !designationRes.ok ||
      !buyersRes.ok ||
      !sellersRes.ok
    ) {
      throw new Error("One or more API requests failed");
    }

    // Get raw text responses for debugging/parsing
    const countryText = await countryRes.text();
    const industryText = await industryRes.text();
    const RegionText = await RegionRes.text();
    const DesignText = await designationRes.text();
    const buyersText = await buyersRes.text();
    const sellersText = await sellersRes.text();

    // Parse the JSON data.
    const countriesData = JSON.parse(countryText);
    const industriesData = JSON.parse(industryText);
    const RegionData = JSON.parse(RegionText);
    const designData = JSON.parse(DesignText);
    const buyersData = JSON.parse(buyersText);
    const sellersData = JSON.parse(sellersText);

    console.log(buyersData);
    console.log(sellersData);

    // Extract the arrays (adjust the property names if necessary).
    const countries = countriesData?.Country || [];
    const industries = industriesData?.Industry || [];
    const regions = RegionData?.Regions || []; // Rename to regions
    const designation = designData?.Designations || [];
    const buyers = buyersData?.Buyers || []; // Adjust property if needed
    const sellers = sellersData?.Sellers || []; // Adjust property if needed

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {isNewAudience ? "Add New Audience" : "Edit Audience"}
        </h1>
        <div>
          {/* Notice we pass "regions" instead of "region" */}
          <AudienceForm
            audienceId={audienceId}
            countries={countries}
            designation={designation}
            industries={industries}
            regions={regions}
            sellers={sellers}
            buyers={buyers}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    // Render fallback UI or error message if needed
    return <div>Error loading data. Please try again later.</div>;
  }
};

export default AudienceFormPage;
