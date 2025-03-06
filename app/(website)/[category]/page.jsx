import ProductCategoryHeader from "./components/ProductCategoryHeader";
import Container from "@/components/container";
import CategoryFilters from "./components/CategoryFilter";
import ProductsGrid from "./components/ProductsGrid";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const CategoryPage = async ({ category }) => {
  const decodedcategory = decodeURIComponent(category);

  // because we are at first level and we don't have these further categories data neither we require but at the same time api is expecting these as a parameters as empty to get data back
  const maincatid = "";
  const subcatid = "";
  const productid = "";
  const logby = "0"; // It is compulsory to send logby to fetch data

  const fetchProducts = await GETALLPRODUCT(
    decodedcategory,
    maincatid,
    subcatid,
    productid,
    logby
  );
  // This will make a check that if we have product, is it array then only we need to fetch because that is how out mechanism is set further
  const isfetchProductsArray = Array.isArray(fetchProducts?.data?.Product)
    ? fetchProducts.data.Product
    : [];
  const totalProducts = isfetchProductsArray.length;

  return (
    <>
      <ProductCategoryHeader
        category={decodedcategory}
        totalProducts={totalProducts}
      />
      <CategoryFilters catid={decodedcategory} />
      <ProductsGrid
        products={isfetchProductsArray}
        categoryName={decodedcategory}
        totalProducts={totalProducts}
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

