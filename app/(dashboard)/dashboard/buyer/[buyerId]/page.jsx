import { BuyerForm } from "../components/BuyerForm";

const Buyer = async ({ params }) => {
  const buyerId = (await params).buyerId;
  const isNewBuyer = buyerId === "new";
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
        <h1 className="text-3xl font-bold mb-6 capitalize">
          {isNewBuyer ? "Add Buyer" : "Edit Buyer"}
        </h1>
        <div>
          <BuyerForm countries={countries.Country} industries={industries.Industry} designations={designations.Designations} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching buyer data:", error);
    return <div>Error fetching buyer data</div>;
  }
};

export default Buyer;