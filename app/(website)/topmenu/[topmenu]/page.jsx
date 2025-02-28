import Container from "@/components/container";
import ProductCategoryHeader from "../../[category]/components/ProductCategoryHeader";
import CategoryFilters from "../../[category]/components/CategoryFilter";
import ProductsGrid from "../../[category]/components/ProductsGrid";
import SuppliersGrid from "../../[category]/components/SupplierGrid/SuppliersGrid";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";



const Page = async ({ params }) => {
  const { topmenu } = await params;
  const decodedcategory = decodeURIComponent(topmenu);
  console.log(decodedcategory);
  // console.log("data in menubar:",decodedcategory);

  const maincatid = "";
  const subcatid = "";
  const productid = "";
  const logby = "0";
  const topmenus = "";

  const fetchProducts = await GETALLPRODUCT(
    topmenus,
    maincatid,
    subcatid,
    productid,
    logby
  );

  // console.log("Actual response data:", fetchProducts);
  // This will make a check that if we have product, is it array then only we need to fetch because that is how out mechanism is set further
  const isfetchProductsArray = Array.isArray(fetchProducts?.data?.Product)
    ? fetchProducts.data.Product
    : [];
  // console.log("Top Category data:", isfetchProductsArray);
  const totalProducts = isfetchProductsArray.length;
  // console.log("Total Products :", totalProducts);

  return (
    <>
      <Container className="my-10 space-y-10">
        <ProductCategoryHeader category={decodedcategory} />
        {/* <SearchBar placeholder={`Search ${decodedcategory}`} /> */}
        {/* <CategoryFilters decodedcategory={decodedcategory} /> */}
        <ProductsGrid
          products={isfetchProductsArray}
          categoryName={decodedcategory}
          totalProducts={totalProducts}
        />
        {/* <SuppliersGrid /> */}
      </Container>
    </>
  );
};

export default Page;
