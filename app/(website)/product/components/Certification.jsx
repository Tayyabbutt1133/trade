"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { fonts } from "@/components/ui/font";

export default function Certification({ docs }) {
  // Use the first product if available
  const singleproduct = docs && docs.length > 0 ? docs[0] : null;

  // If there's no product, nothing to show
  if (!singleproduct) {
    return <div>No product data available</div>;
  }

  // The array of doc objects
  const documents = singleproduct.docs || [];

  // Find each product certification doc by filetype
  const Doc1 = documents.find(
    (doc) => doc.filetype === "Product Certification 1"
  );
  const Doc2 = documents.find(
    (doc) => doc.filetype === "Product Certification 2"
  );
  const Doc3 = documents.find(
    (doc) => doc.filetype === "Product Certification 3"
  );
  const Doc4 = documents.find(
    (doc) => doc.filetype === "Product Certification 4"
  );
  const Doc5 = documents.find(
    (doc) => doc.filetype === "Product Certification 5"
  );

  // Check if any certification documents exist
  const hasAnyDocuments = Doc1 || Doc2 || Doc3 || Doc4 || Doc5;

  // Function to handle both opening and downloading the file
  const handleButtonClick = (doc) => {
    if (!doc) return;

    // Extract filename from path
    const filename = doc.path.split("/").pop();

    // Open in new tab first
    window.open(doc.path, "_blank");

    // Create a direct download link instead of using fetch
    const downloadLink = document.createElement("a");
    downloadLink.href = doc.path;
    downloadLink.setAttribute("download", filename || "certification-document");
    downloadLink.setAttribute("target", "_blank");
    downloadLink.style.display = "none";

    // Append to body, click, and remove
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // If no documents are available, show a message
  if (!hasAnyDocuments) {
    return (
      <div className="p-6 space-y-4">
        <h2 className={`text-2xl font-semibold ${fonts.montserrat}`}>
          Product Certifications
        </h2>
        <div className="p-4 border rounded-md bg-gray-50">
          <p className="text-gray-500 text-center">
            No certification documents available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className={`text-2xl font-semibold ${fonts.montserrat}`}>
        Product Certifications
      </h2>
      <div className="flex flex-wrap gap-4">
        {/* Product Certification 1 */}
        <Button
          variant="outline"
          className={`gap-2 ${fonts.montserrat} font-medium text-lg hover:scale-105 transition-all`}
          disabled={!Doc1}
          onClick={() => handleButtonClick(Doc1)}
        >
          Product Certification 1
        </Button>

        {/* Product Certification 2 */}
        <Button
          variant="outline"
          className={`gap-2 ${fonts.montserrat} font-medium text-lg hover:scale-105 transition-all`}
          disabled={!Doc2}
          onClick={() => handleButtonClick(Doc2)}
        >
          Product Certification 2
        </Button>

        {/* Product Certification 3 */}
        <Button
          variant="outline"
          className={`gap-2 ${fonts.montserrat} font-medium text-lg hover:scale-105 transition-all`}
          disabled={!Doc3}
          onClick={() => handleButtonClick(Doc3)}
        >
          Product Certification 3
        </Button>

        {/* Product Certification 4 */}
        <Button
          variant="outline"
          className={`gap-2 ${fonts.montserrat} font-medium text-lg hover:scale-105 transition-all`}
          disabled={!Doc4}
          onClick={() => handleButtonClick(Doc4)}
        >
          Product Certification 4
        </Button>

        {/* Product Certification 5 */}
        <Button
          variant="outline"
          className={`gap-2 ${fonts.montserrat} font-medium text-lg hover:scale-105 transition-all`}
          disabled={!Doc5}
          onClick={() => handleButtonClick(Doc5)}
        >
          Product Certification 5
        </Button>
      </div>
    </div>
  );
}
