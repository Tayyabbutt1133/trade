import ProductCategoryHeader from "../components/ProductCategoryHeader";
import Container from "@/components/container";
import CategoryFilters from "../components/CategoryFilter";
import ProductsGrid from "../components/ProductsGrid";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { Suspense } from "react";

const SubCategory = async ({ category, subcategory }) => {
  const catid = decodeURIComponent(category);
  const maincatid = decodeURIComponent(subcategory);
  // console.log("Top Categories:", catid);
  // console.log("MainCategory:", maincatid);

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

  // console.log("Actual response data:", fetchallproducts);

  // checking if the Product that we are getting is Array or not because on that basis we are slicing no.of products
  const isfetchProductsArray = Array.isArray(fetchallproducts?.data?.Product)
    ? fetchallproducts.data.Product
    : [];
  const totalProducts = isfetchProductsArray.length;

  return (
    <>
      <ProductCategoryHeader
        totalProducts={totalProducts}
        category={maincatid}
      />
      <CategoryFilters catid={catid} maincatid={maincatid} />
      <ProductsGrid
        products={isfetchProductsArray}
        category={maincatid}
        totalProducts={totalProducts}
      />
    </>
  );
};


const Page = async ({ params }) => {
  const { category, subcategory } = await params;
  
  return (
    <Container className="my-10 mt-16 space-y-10">
      <Suspense fallback={<LoadingSpinner />}>
        <SubCategory category={category} subcategory={subcategory}/>
      </Suspense>
    </Container>
  );
};

export default Page;