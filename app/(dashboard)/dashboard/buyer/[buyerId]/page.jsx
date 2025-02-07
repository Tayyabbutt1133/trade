import { BuyerForm } from "../components/BuyerForm";

const SellerDetailClient = async ({ params }) => {
  const buyerId = (await params).buyerId;
  const isNewBuyer = buyerId === "new";

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {isNewBuyer ? "Add New Buyer" : "Edit Buyer"}
      </h1>
      <div>
        <BuyerForm />
      </div>
    </div>
  );
};

export default SellerDetailClient;