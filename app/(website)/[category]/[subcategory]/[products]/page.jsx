
import SidebarProductsGrid from "./components/SidebarProductsGrid";
// import SidebarBreadcrumbs from "./components/SidebarBreadCrumbs";
import FilterDropdowns from "./components/FilterDropdown/FilterDropdown";
import FilterSidebar from "./components/FilterSideBar";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";


const Page = async ({ params }) => {
  const { category } = await params;
  const { subcategory } = await params;
  const { products } = await params;
  const catid = decodeURIComponent(category);
  const maincatid = decodeURIComponent(subcategory);
  const subcatid = decodeURIComponent(products);
  const logby = "0";
  console.log("TopCategories:", catid)
  console.log("MainCategories:",maincatid)
  console.log("Subcategory:", subcatid);


    const productid = "";
    const fetchallproducts = await GETALLPRODUCT(catid, maincatid, subcatid, productid, logby)
  
      console.log("Actual response data:", fetchallproducts);
  
  
    const isfetchProductsArray = Array.isArray(fetchallproducts?.data?.Product) ? fetchallproducts.data.Product : [];
    // console.log("Top Category data:", isfetchProductsArray);
    const totalProducts = isfetchProductsArray.length;
    // console.log("Total Products :", totalProducts);



  return (
    <div className="flex min-h-screen">
      <FilterSidebar />
      <main className="flex-1 my-10 mx-2">
        <FilterDropdowns />
        <SidebarProductsGrid
          products={isfetchProductsArray}
          categoryName={subcatid}
          totalProducts={totalProducts}
        />
      </main>
    </div>
  );
};

export default Page;
