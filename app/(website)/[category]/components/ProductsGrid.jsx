"use client";

import { useState, useMemo } from "react";
import { fonts } from "@/components/ui/font";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

function usePaginationRange(currentPage, totalPages) {
  const delta = 2; // How many pages to show around the current page
  let range = [];
  let lastPage;

  for (let i = 1; i <= totalPages; i++) {
    // Always show the first and last pages,
    // or pages within [currentPage - delta, currentPage + delta]
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      // If there's a gap between this page and the last one we added, insert an ellipsis
      if (lastPage && i - lastPage > 1) {
        range.push("...");
      }
      range.push(i);
      lastPage = i;
    }
  }

  return range;
}


function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
  const paginationRange = usePaginationRange(currentPage, totalPages);

  // Calculate which items are being shown
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mt-8 space-y-2 md:space-y-0">
      {/* Left side: "Results: X - Y of Z" + page-size dropdown */}
      <div className="flex items-center space-x-4">
        <span className="text-sm text-gray-600">
          Results: {startItem} - {endItem} of {totalItems}
        </span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Show:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Right side: pagination controls */}
      <div className="flex items-center space-x-1">
        {/* Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers with ellipses */}
        {paginationRange.map((page, idx) =>
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

        {/* Next */}
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

export default function ProductsGrid({ products, categoryName, totalProducts }) {
  // The total number of items
  const totalItems = totalProducts;
  // State for current page & page size
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  // Compute current slice of products
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return products.slice(startIndex, endIndex);
  }, [currentPage, pageSize, products]);

  // Handlers
  function handlePageChange(page) {
    setCurrentPage(page);
  }

  function handlePageSizeChange(size) {
    setPageSize(size);
    setCurrentPage(1); // Reset to page 1 if page size changes
  }

  return (
    <div className={fonts.montserrat}>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Browse All Products in {categoryName} ({totalItems})
      </h1>

      {/* Products grid (max 4 per row) */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {currentProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* Pagination UI */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
