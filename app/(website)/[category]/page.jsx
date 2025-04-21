import ProductCategoryHeader from "./components/ProductCategoryHeader";
import Container from "@/components/container";
import CategoryFilters from "./components/CategoryFilter";
import ProductsGrid from "./components/ProductsGrid";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const CategoryPage = async ({ category }) => {
  const decodedcategory = decodeURIComponent(category);

  const maincatid = "";
  const subcatid = "";
  const productid = "";
  const logby = "0";
  const initialSize = 1; // Fetch 1 product just to get total count
  const initialPage = "";

  //  Fetch total count and wait for response
  const initialFetch = await GETALLPRODUCT(
    decodedcategory,
    maincatid,
    subcatid,
    productid,
    logby,
    initialSize,
    initialPage
  );
  console.log("Sidemenu response :", initialFetch);
  const totalCount = initialFetch?.data?.["Total Records"]?.[0]?.records || 0;
  
  return (
    <>
      <ProductCategoryHeader
        category={decodedcategory}
        totalProducts={totalCount}
      />
      <CategoryFilters catid={decodedcategory} />
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
  const { category } = await params;

  return (
    <Container className="my-10 mt-16 space-y-10">
      <Suspense fallback={<LoadingSpinner />}>
        <CategoryPage category={category} />
      </Suspense>
    </Container>
  );
};

export default Page;
