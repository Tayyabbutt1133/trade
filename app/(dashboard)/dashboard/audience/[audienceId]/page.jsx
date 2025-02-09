import { AudienceForm } from "../components/AudienceForm";

const AudienceFormPage = async ({ params }) => {
  const audienceId = params.audienceId; // assuming params is not a Promise
  const isNewAudience = audienceId === "new";

  try {
    const [countryRes, industryRes, RegionRes] = await Promise.all([
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/country"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/industry"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/region"),
    ]);

    // Check if responses are OK
    if (!countryRes.ok || !industryRes.ok || !RegionRes.ok) {
      throw new Error("One or more API requests failed");
    }

    // Get raw text responses for debugging/parsing
    const countryText = await countryRes.text();
    const industryText = await industryRes.text();
    const RegionText = await RegionRes.text();

    // Parse the JSON data.
    const countriesData = JSON.parse(countryText);
    const industriesData = JSON.parse(industryText);
    const RegionData = JSON.parse(RegionText); // Fixed here

    // Extract the arrays (adjust the property names if necessary).
    const countries = countriesData?.Country || [];
    const industries = industriesData?.Industry || [];
    const regions = RegionData?.Regions || []; // Rename to regions

    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {isNewAudience ? "Add New Audience" : "Edit Audience"}
        </h1>
        <div>
          {/* Notice we pass "regions" instead of "region" */}
          <AudienceForm countries={countries} industries={industries} regions={regions} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    // You can render an error message or fallback UI here
  }
};

export default AudienceFormPage;
