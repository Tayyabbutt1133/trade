import React, { lazy } from "react";
import { SEARCH } from "@/app/actions/Search";
import ProductCategoryHeader from "../../[category]/components/ProductCategoryHeader";
import CategoryFilters from "../../[category]/components/CategoryFilter";
import Container from "@/components/container";
import { Suspense } from "react";

const SearchProductsGrid = lazy(() =>
  import("../components/SearchProductGrid")
);

export default async function Page({ params }) {
  // Extract the search query string from the dynamic params
  const final_search = decodeURIComponent(params.search);

  // Call the SEARCH function on the server side using the query
  const results = await SEARCH(final_search);
  const searchResults = results.Response || [];
  const search_result_length = searchResults.length;

  return (
    <>
      <Container className="my-10 mt-16 space-y-10">
        <ProductCategoryHeader
          category={final_search}
          totalProducts={search_result_length}
        />
        <CategoryFilters catid={final_search} />
        <Suspense
          fallback={
            <div className="text-center py-10">Loading search results...</div>
          }
        >
          <SearchProductsGrid
            totalProducts={search_result_length}
            searchTerm={final_search}
            initialProducts={searchResults} // Pass the already-fetched products
          />
        </Suspense>
      </Container>
    </>
  );
}
