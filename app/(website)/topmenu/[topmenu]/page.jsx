import Container from "@/components/container";
import ProductCategoryHeader from "../../[category]/components/ProductCategoryHeader";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import TopCategoryFilter from "../../[category]/components/TopCategoryFilter";


// Product content component
const ProductContent = async ({ topMenu }) => {
  const decodedcategory = decodeURIComponent(topMenu);
  console.log(decodedcategory);

  // for now we are sending empty to get all data because we don't have data for topmenu
  const catid = ""
  const maincatid = "";
  const subcatid = "";
  const productid = "";
  const logby = "0";
  const initialSize = 1; // Fetch 1 product just to get total count
  const initialPage = "";

  // Step 1: Fetch total count and wait for response
  const initialFetch = await GETALLPRODUCT(
    catid,
    maincatid,
    subcatid,
    productid,
    logby,
    initialSize,
    initialPage
  );
  // console.log("Topmenu response :", initialFetch);

  const totalCount = initialFetch?.data?.["Total Records"]?.[0]?.records || 0;


  return (
    <>
      <ProductCategoryHeader category={decodedcategory} totalProducts={totalCount} />
      <TopCategoryFilter category={decodedcategory} />
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
