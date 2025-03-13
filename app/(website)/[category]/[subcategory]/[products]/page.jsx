import SidebarProductsGrid from "./components/SidebarProductsGrid";
// import FilterDropdowns from "./components/FilterDropdown/FilterDropdown";
// import FilterSidebar from "./components/FilterSideBar";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";
import Container from "@/components/container";
import ProductCategoryHeader from "../../components/ProductCategoryHeader";
import ProductsGrid from "../../components/ProductsGrid";

const Page = async ({ params }) => {
  const { category } = await params;
  const { subcategory } = await params;
  const { products } = await params;
  const catid = decodeURIComponent(category);
  const maincatid = decodeURIComponent(subcategory);
  const subcatid = decodeURIComponent(products);
  const logby = "0";
  const productid = "";
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
  console.log("total count : ", totalCount);
    // making sure that we initially get third half of total products that we have to reduce delay, and then each new record will come through pagination GETALLPRODUCT FUNCTION CALL
  const dynamicSize = Math.max(1, Math.ceil(totalCount / 3)); // Ensure at least 1 product is fetched
  console.log("Dynamic Category Products half size is : ", dynamicSize);




  //  // Step 2: Fetch initial products in parallel using Promise.all
  //  const [fetchProducts] = await Promise.all([
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
      {/* REMEMBER : WHEN THE DATA WILL COMPLETE AT BACKEND, LATER ON THEN WE WILL BE USING FILTER SYSTEM */}
      {/* <div className="flex min-h-screen"> */}
      {/* <FilterSidebar /> */}
      {/* <main className="flex-1 my-10 mx-2"> */}
      {/* <FilterDropdowns /> */}
      <Container className="my-10 space-y-10">
        <ProductCategoryHeader
          category={subcatid}
          totalProducts={totalCount}
        />
        <ProductsGrid
          catid={catid}
          maincatid={maincatid}
          subcatid={subcatid}
          totalProducts={totalCount}
        />
      </Container>
      {/* </main> */}
      {/* // </div> */}
    </>
  );
};

export default Page;
