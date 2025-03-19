"use client";

import { useState, useEffect } from "react";
import { fonts } from "@/components/ui/font";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { GETALLPRODUCT } from "@/app/actions/getallproducts";

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


// Main ProductsGrid component that fetches products based on offset (page) and pageSize
export default function ProductsGrid({ catid, totalProducts, maincatid, subcatid }) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Default page size
  const [loading, setLoading] = useState(false);

  // Calculate total pages based on totalProducts (passed from initial fetch) and pageSize
  const totalPages = Math.ceil(totalProducts / pageSize);

  // Calculate offset based on currentPage and pageSize
  const offset = (currentPage - 1) * pageSize;
  console.log("Category name is : ", catid);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const productid = "";
        const logby = "0";
  
        const response = await GETALLPRODUCT(
          catid,
          maincatid,
          subcatid,
          productid,
          logby,
          pageSize,
          offset
        );
  
        const productData = response?.data?.Product || [];
  
        // Check for "No Record" scenario
        if (productData.length === 1 && productData[0]?.body === "No Record") {
          setProducts([]);
        } else {
          // Shuffle products before setting state
          setProducts(shuffleArray(productData));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, [currentPage, pageSize, catid, maincatid, subcatid, offset]);
  
  // Fisher-Yates shuffle function
  function shuffleArray(array) {
    let shuffled = [...array]; // Copy array to avoid mutating original
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  
  // Handlers for changing page and page size
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to page 1 on page size change
  };

  return (
    <div className={fonts.montserrat}>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
              Browse All Products ({totalProducts})
      </h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalProducts}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
