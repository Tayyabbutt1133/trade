import SidebarProductsGrid from "./components/SidebarProductsGrid";
import FilterDropdowns from "./components/FilterDropdown/FilterDropdown";
import FilterSidebar from "./components/FilterSideBar";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";
import Container from "@/components/container";
import ProductCategoryHeader from "../../components/ProductCategoryHeader";

const Page = async ({ params }) => {
  const { category } = await params;
  const { subcategory } = await params;
  const { products } = await params;
  const catid = decodeURIComponent(category);
  const maincatid = decodeURIComponent(subcategory);
  const subcatid = decodeURIComponent(products);
  const logby = "0";
  console.log("TopCategories:", catid);
  console.log("MainCategories:", maincatid);
  console.log("Subcategory:", subcatid);

  const productid = "";
  const fetchallproducts = await GETALLPRODUCT(
    catid,
    maincatid,
    subcatid,
    productid,
    logby
  );

  console.log("Actual response data:", fetchallproducts);

  const isfetchProductsArray = Array.isArray(fetchallproducts?.data?.Product)
    ? fetchallproducts.data.Product
    : [];
  const totalProducts = isfetchProductsArray.length;

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
          totalProducts={totalProducts}
        />
        <SidebarProductsGrid
          products={isfetchProductsArray}
          categoryName={subcatid}
          totalProducts={totalProducts}
        />
      </Container>
      {/* </main> */}
      {/* // </div> */}
    </>
  );
};

export default Page;
