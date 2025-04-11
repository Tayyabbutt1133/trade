import React, { lazy } from "react";
import { SEARCH } from "@/app/actions/Search";
import ProductCategoryHeader from "../../[category]/components/ProductCategoryHeader";
import CategoryFilters from "../../[category]/components/CategoryFilter";
import Container from "@/components/container";
import { Suspense } from "react";

const ProductsGrid = lazy(() =>
  import("../../[category]/components/ProductsGrid")
);

export default async function Page({ params }) {
  // Extract the search query string from the dynamic params
  const { search } = await params;

  const maincatid = "";
  const subcatid = "";

  // Call the SEARCH function on the server side using the query
  const results = await SEARCH(search);
  const searchResults = results.Response || [];
  const search_result_length = searchResults.length;

  return (
    <>
      <Container className="my-10 mt-16 space-y-10">
        <ProductCategoryHeader
          category={search}
          totalProducts={search_result_length}
        />
        <CategoryFilters catid={search} />
        <Suspense fallback={"Loading...."}>
          <ProductsGrid
            catid={search}
            maincatid={maincatid}
            subcatid={subcatid}
            totalProducts={search_result_length}
          />
        </Suspense>
      </Container>
    </>
  );
}
