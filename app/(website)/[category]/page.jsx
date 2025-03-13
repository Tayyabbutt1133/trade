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

  // Step 2: Fetch initial products in parallel using Promise.all
  const [fetchProducts] = await Promise.all([
    GETALLPRODUCT(
      decodedcategory,
      maincatid,
      subcatid,
      productid,
      logby,
      dynamicSize, // Dynamically calculated size
      initialPage
    ),
  ]);

  // Step 3: Extract products
  const isfetchProductsArray = Array.isArray(fetchProducts?.data?.Product)
    ? fetchProducts.data.Product
    : [];
  console.log("Half Fetched Products : ", isfetchProductsArray);



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
