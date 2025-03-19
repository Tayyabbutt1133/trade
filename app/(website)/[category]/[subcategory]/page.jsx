import ProductCategoryHeader from "../components/ProductCategoryHeader";
import Container from "@/components/container";
import CategoryFilters from "../components/CategoryFilter";
import ProductsGrid from "../components/ProductsGrid";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";

const SubCategory = async ({ category, subcategory }) => {
  const catid = decodeURIComponent(category);
  const maincatid = decodeURIComponent(subcategory);
  // console.log("Top Categories:", catid);
  // console.log("MainCategory:", maincatid);

  // now here we have topcategory and maincategory so that's why we only pass subcatid and productid is equal to empty
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

  const totalCount = initialFetch?.data?.["Total Records"]?.[0]?.records || 0;
  // console.log("Total count is : ", totalCount);



  return (
    <>
      <ProductCategoryHeader
        totalProducts={totalCount}
        category={maincatid}
      />
      <CategoryFilters catid={catid} maincatid={maincatid} />
      <ProductsGrid
        catid={catid}
        maincatid={maincatid}
        subcatid={subcatid}
        totalProducts={totalCount}
      />
    </>
  );
};

const Page = async ({ params }) => {
  const { category, subcategory } = await params;

  return (
    <Container className="my-10 mt-16 space-y-10">
      <Suspense fallback={<LoadingSpinner />}>
        <SubCategory category={category} subcategory={subcategory} />
      </Suspense>
    </Container>
  );
};

export default Page;
