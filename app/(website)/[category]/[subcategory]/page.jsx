import ProductCategoryHeader from "../components/ProductCategoryHeader";
import Container from "@/components/container";
// import SearchBar from '../../homepage/components/Navbar/Search'
import CategoryFilters from "../components/CategoryFilter";
import ProductsGrid from "../components/ProductsGrid";
// import SuppliersGrid from '../components/SupplierGrid/SuppliersGrid'
import { GETALLPRODUCT } from "@/app/actions/getallproducts";

const Page = async ({ params }) => {
  const { category } = await params;
  const { subcategory } = await params;
  const catid = decodeURIComponent(category);
  const maincatid = decodeURIComponent(subcategory);
  console.log("Top Categories:", catid);
  console.log("MainCategory:", maincatid);

  // now here we have topcategory and maincategory so that's why we only pass subcatid and productid is equal to empty

  const subcatid = "";
  const productid = "";
  const logby = "0";
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
  // console.log("Top Category data:", isfetchProductsArray);
  const totalProducts = isfetchProductsArray.length;
  // console.log("Total Products :", totalProducts);

  return (
    <Container className="my-10  space-y-10">
      <ProductCategoryHeader
        totalProducts={totalProducts}
        category={maincatid}
      />
      {/* <SearchBar placeholder={`Search ${maincatid}`} /> */}
      <CategoryFilters catid={catid} maincatid={maincatid} />
      <ProductsGrid
        products={isfetchProductsArray}
        category={maincatid}
        totalProducts={totalProducts}
      />
      {/* <SuppliersGrid /> */}
    </Container>
  );
};

export default Page;
