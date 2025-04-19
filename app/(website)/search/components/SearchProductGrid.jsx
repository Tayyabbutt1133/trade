"use client";

import { useState, useEffect } from "react";
import { fonts } from "@/components/ui/font";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../[category]/components/ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

function Pagination({ currentPage, totalPages, totalItems, onPageChange }) {
  const pageSize = 20; // Default page size
  const delta = 2;
  let range = [];
  let lastPage;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      if (lastPage && i - lastPage > 1) {
        range.push("...");
      }
      range.push(i);
      lastPage = i;
    }
  }

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

// Modified ProductCard component with proper image handling
function SafeProductCard({ product }) {
  // Define a default image URL
  const defaultImageUrl = "/images/placeholder-product.jpg"; // Update this to your actual default image path

  // Create a safe product object with all necessary fields to prevent errors
  const safeProduct = {
    ...product,
    // Ensure image fields have valid values
    image: defaultImageUrl,
    productImage: defaultImageUrl,
    thumbnail: defaultImageUrl,
  };

  return <ProductCard product={safeProduct} />;
}

// Main ProductsGrid component that fetches products based on search term
export default function ProductsGrid({ searchTerm, totalProducts = 0 }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20); // Default page size
  const [loading, setLoading] = useState(false);

  // Calculate total pages based on totalProducts and pageSize
  const totalPages = Math.ceil(totalProducts / pageSize);

  useEffect(() => {
    async function fetchData() {
      if (!searchTerm?.trim()) return;

      setLoading(true);
      try {
        const response = await fetch(
          `https://tradetoppers.esoftideas.com/esi-api/responses/searchproduct/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              search: searchTerm,
            }),
          }
        );

        const data = await response.json();

        // Check if we have valid product data
        const productData = data?.Response || [];
        setProducts(productData);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchTerm, currentPage]);

  // Handler for changing page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={fonts.montserrat}>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Search Results
      </h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((p) => <SafeProductCard key={p.id} product={p} />)
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
