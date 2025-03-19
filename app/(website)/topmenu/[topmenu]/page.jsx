import Container from "@/components/container";
import ProductCategoryHeader from "../../[category]/components/ProductCategoryHeader";
import ProductsGrid from "../../[category]/components/ProductsGrid";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Product content component
const ProductContent = async ({ topMenu }) => {
  const decodedcategory = decodeURIComponent(topMenu);
  console.log(decodedcategory);

  const maincatid = "";
  const subcatid = "";
  const productid = "";
  const logby = "0";
  const initialSize = 1; // Fetch 1 product just to get total count
  const initialPage = "";

  // Step 1: Fetch total count and wait for response
  const initialFetch = await GETALLPRODUCT(
    decodedcategory,
    maincatid,
    subcatid,
    productid,
    logby,
    initialSize,
    initialPage
  );

  const totalCount = initialFetch?.data?.["Total Records"]?.[0]?.records || 0;
  // making sure that we initially get third half of total products that we have to reduce delay, and then each new record will come through pagination GETALLPRODUCT FUNCTION CALL
  const dynamicSize = Math.max(1, Math.ceil(totalCount / 3)); // Ensure at least 1 product is fetched
  console.log("Dynamic Category Products half size is : ", dynamicSize);



  return (
    <>
      <ProductCategoryHeader category={decodedcategory} />
      <ProductsGrid
        catid={decodedcategory}
        maincatid={maincatid}
        subcatid={subcatid}
        totalProducts={totalCount}
      />
    </>
  );
};

const Page = async ({ params }) => {
  const { topmenu } = await params;

  return (
    <Container className="my-10 mt-16 space-y-10">
      <Suspense fallback={<LoadingSpinner />}>
        <ProductContent topMenu={topmenu} />
      </Suspense>
    </Container>
  );
};

export default Page;
