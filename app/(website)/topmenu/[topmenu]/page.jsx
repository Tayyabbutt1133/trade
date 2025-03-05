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

  // Ensure we have an array of products
  const isfetchProductsArray = Array.isArray(fetchProducts?.data?.Product)
    ? fetchProducts.data.Product
    : [];

  // Fisher-Yates shuffle function
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Create a copy of the array and shuffle it
  const shuffledProducts = shuffleArray([...isfetchProductsArray]);
  const totalProducts = shuffledProducts.length;

  return (
    <Container className="my-10 space-y-10">
      <ProductCategoryHeader category={decodedcategory} />
      {/* Optionally, add your SearchBar or CategoryFilters here */}
      <ProductsGrid
        products={shuffledProducts}
        categoryName={decodedcategory}
        totalProducts={totalProducts}
      />
      {/* <SuppliersGrid /> */}
    </Container>
  );
};

export default Page;
