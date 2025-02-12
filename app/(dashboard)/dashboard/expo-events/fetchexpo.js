"use server";

export async function fetchMetaData() {
  try {
    const [countryRes, industryRes] = await Promise.all([
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/country"),
      fetch("https://tradetoppers.esoftideas.com/esi-api/responses/industry"),
    ]);

    if (!countryRes.ok || !industryRes.ok) {
      throw new Error("Failed to fetch metadata");
    }

    const [countriesData, industriesData] = await Promise.all([
      countryRes.json(),
      industryRes.json(),
    ]);

    // Extract country names
    const countries = countriesData?.Country?.map((c) => c.country) || [];
    // Extract industry names
    const industries = industriesData?.Industry?.map((i) => i.industry) || [];

    return { countries, industries };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return { countries: [], industries: [] };
  }
}
