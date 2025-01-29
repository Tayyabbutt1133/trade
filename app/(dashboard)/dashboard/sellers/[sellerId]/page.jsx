import { SellerForm } from "../components/SellerForm";

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
