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
  console.log("Total count is : ", totalCount);
    // making sure that we initially get third half of total products that we have to reduce delay, and then each new record will come through pagination GETALLPRODUCT FUNCTION CALL
  const dynamicSize = Math.max(1, Math.ceil(totalCount / 3)); // Ensure at least 1 product is fetched
  console.log("Dynamic Category Products half size is : ", dynamicSize);


    // // Step 2: Fetch initial products in parallel using Promise.all
    // const [fetchProducts] = await Promise.all([
    //   GETALLPRODUCT(
    //     catid,
    //     maincatid,
    //     subcatid,
    //     productid,
    //     logby,
    //     dynamicSize, // Dynamically calculated size
    //     initialPage
    //   ),
    // ]);
  
    // // Step 3: Extract products
    // const isfetchProductsArray = Array.isArray(fetchProducts?.data?.Product)
    //   ? fetchProducts.data.Product
    //   : [];
    // console.log("Half Fetched Products : ", isfetchProductsArray);




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
