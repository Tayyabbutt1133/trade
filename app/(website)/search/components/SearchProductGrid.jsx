"use client";
import { useState, useEffect, useMemo, useCallback,memo } from "react";
import { fonts } from "@/components/ui/font";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../[category]/components/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { SEARCH } from "@/app/actions/Search";

// Memoized pagination component to prevent unnecessary re-renders
const Pagination = memo(
  ({ currentPage, totalPages, totalItems, onPageChange }) => {
    const pageSize = 20; // Default page size
    const delta = 2;

    // Calculate pagination range using useMemo to avoid recalculation
    const range = useMemo(() => {
      let result = [];
      let lastPage;

      for (let i = 1; i <= totalPages; i++) {
        if (
          i === 1 ||
          i === totalPages ||
          (i >= currentPage - delta && i <= currentPage + delta)
        ) {
          if (lastPage && i - lastPage > 1) {
            result.push("...");
          }
          result.push(i);
          lastPage = i;
        }
      }
      return result;
    }, [currentPage, totalPages, delta]);

    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(startItem + pageSize - 1, totalItems);

    return (
      <div className="flex flex-col md:flex-row items-center justify-between mt-8 space-y-2 md:space-y-0">
        {/* Left side: results count */}
        <div className="text-sm text-gray-600">
          Results: {startItem} - {endItem} of {totalItems}
        </div>

        {/* Right side: page navigation */}
        <div className="flex items-center space-x-1">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeft size={16} />
          </button>

          {range.map((page, idx) =>
            page === "..." ? (
              <span key={`ellipsis-${idx}`} className="px-3 py-1">
                ...
              </span>
            ) : (
              <button
                key={`page-${page}-${idx}`}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 border rounded ${
                  page === currentPage ? "bg-green-500 text-white" : ""
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }
);

// Memoized ProductCard to prevent unnecessary re-renders
const SafeProductCard = memo(({ product }) => {
  return <ProductCard product={product} />;
});

// Main ProductsGrid component that handles products from search
export default function ProductsGrid({
  searchTerm,
  totalProducts = 0,
  initialProducts = [],
}) {
  const [products, setProducts] = useState(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Default page size
  const [loading, setLoading] = useState(false);

  // Calculate total pages based on totalProducts and pageSize
  const totalPages = useMemo(
    () => Math.ceil(totalProducts / pageSize),
    [totalProducts, pageSize]
  );

  // Only fetch if we don't have initialProducts or when page changes
  const shouldFetch = !initialProducts.length || currentPage > 1;

  // Memoized page change handler
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    // Skip fetching if search term is empty or we already have initial products for page 1
    if (
      !searchTerm?.trim() ||
      (currentPage === 1 && initialProducts.length > 0)
    )
      return;

    async function fetchData() {
      setLoading(true);
      try {
        // In a real implementation, you'd add pagination parameters to your SEARCH function
        // For example: SEARCH(searchTerm, currentPage, pageSize)
        const results = await SEARCH(searchTerm);
        const searchResults = results.Response || [];
        setProducts(searchResults);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    if (shouldFetch) {
      fetchData();
    }
  }, [searchTerm, currentPage, initialProducts, shouldFetch]);

  // Filter current page products from all products
  const currentPageProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return products.slice(startIndex, endIndex);
  }, [products, currentPage, pageSize]);

  return (
    <div className={fonts.montserrat}>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Search Results</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {currentPageProducts.length > 0 ? (
            currentPageProducts.map((p) => (
              <SafeProductCard key={p.id} product={p} />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}

      {products.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={products.length}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
