import ProductCategoryHeader from "./components/ProductCategoryHeader";
import Container from "@/components/container";
import CategoryFilters from "./components/CategoryFilter";
import ProductsGrid from "./components/ProductsGrid";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";



const Page = async ({ params }) => {
  const { category } = await params;
  const decodedcategory = decodeURIComponent(category);

  // because we are at first level and we don't have these further categories data neither we require
  const maincatid = "";
  const subcatid = "";
  const productid = "";

  // console.log("TopCategory:", decodedcategory);
  const fetchProducts = await GETALLPRODUCT(
    decodedcategory,
    maincatid,
    subcatid,
    productid
  );
  // console.log("Actual response data:", fetchProducts);
  // This will make a check that if we have product, is it array then only we need to fetch because that is how out mechanism is set further
  const isfetchProductsArray = Array.isArray(fetchProducts?.data?.Product) ? fetchProducts.data.Product : [];
  // console.log("Top Category data:", isfetchProductsArray);
  const totalProducts = isfetchProductsArray.length;
  // console.log("Total Products :", totalProducts);

  return (
    <Container className="my-10 space-y-10">
      <ProductCategoryHeader category={decodedcategory} totalProducts={totalProducts} />
      <CategoryFilters />
      <ProductsGrid
        products={isfetchProductsArray}
        categoryName={decodedcategory}
        totalProducts={totalProducts}
      />
    </Container>
  );
};

export default Page;
