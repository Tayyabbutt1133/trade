import ProductCategoryHeader from "./components/ProductCategoryHeader";
import Container from "@/components/container";
import CategoryFilters from "./components/CategoryFilter";
import ProductsGrid from "./components/ProductsGrid";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";

const Page = async ({ params }) => {
  const { category } = await params;
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
    <Container className="my-10 space-y-10">
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
    </Container>
  );
};

export default Page;
