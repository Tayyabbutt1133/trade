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
