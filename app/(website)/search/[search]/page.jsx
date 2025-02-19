import React from "react";
import { SEARCH } from "@/app/actions/Search";
import FilterSidebar from "../../[category]/[subcategory]/[products]/components/FilterSideBar";
import FilterDropdowns from "../../[category]/[subcategory]/[products]/components/FilterDropdown/FilterDropdown";
import SidebarProductsGrid from "../../[category]/[subcategory]/[products]/components/SidebarProductsGrid";

export default async function Page({ params }) {
  // Extract the search query string from the dynamic params
  const { search } = params;

  // Call the SEARCH function on the server side using the query
  const results = await SEARCH(search);
  const searchResults = results.Response || [];
  console.log("Array:", searchResults);

  return (
    <>
      <div className="flex min-h-screen">
        <FilterSidebar />
        <main className="flex-1 my-10 mx-2">
          <FilterDropdowns />
          <SidebarProductsGrid heading={search} productdata={searchResults} />
        </main>
      </div>
    </>
  );
}
