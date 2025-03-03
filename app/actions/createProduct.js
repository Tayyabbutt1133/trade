"use server";

export const createProduct = async (formData, imageData) => {
  console.log("Creating product with data:", formData);
  try {
    // First, create the product
    const productRes = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/requests/products/",
      {
        method: "POST",
        body: formData,
      }
    );

    const productData = await productRes.json();

    console.log("Product created successfully :", productData);
    // Handle different response structures based on the API response
    // Check if Product array exists and has data (success case)
    if (productData.Product && productData.Product.length > 0) {
      const productId = productData.Product[0].id;

      // If we have images, upload them one by one
      const images = JSON.parse(imageData.get("images") || "[]");

      if (images.length > 0) {
        const imageUploadPromises = images.map(async (image, index) => {
          const imageFormData = new FormData();

          // Clean the base64 string more thoroughly
          let base64Data = image.base64;
          if (base64Data.includes(",")) {
            // Extract only the base64 part after the comma
            base64Data = base64Data.split(",")[1];
          }
          // Remove any whitespace, newlines, or other non-base64 characters
          base64Data = base64Data.replace(/[^A-Za-z0-9+/=]/g, "");

          imageFormData.append("img", base64Data);
          imageFormData.append("productid", productId);
          imageFormData.append("logby", formData.get("logby"));

          console.log(`Uploading image ${index + 1}/${images.length}`);
          console.log(
            `ProductID: ${productId}, LogBy: ${formData.get("logby")}`
          );

          try {
            const imageRes = await fetch(
              "https://tradetoppers.esoftideas.com/esi-api/requests/products/Default2.aspx",
              {
                method: "POST",
                body: imageFormData,
              }
            );

            const responseText = await imageRes.text();
            console.log(`Image upload response: ${responseText}`);

            try {
              return JSON.parse(responseText);
            } catch (e) {
              console.error("Failed to parse image upload response:", e);
              return {
                success: false,
                error: "Invalid response format",
                rawResponse: responseText,
              };
            }
          } catch (uploadError) {
            console.error(`Error uploading image ${index + 1}:`, uploadError);
            return { success: false, error: uploadError.message };
          }
        });

        // Wait for all image uploads to complete
        await Promise.all(imageUploadPromises);
      }

      return {
        success: true,
        message: "Product and images created successfully",
        data: productData.Product[0],
      };
    }
    // Check if it's the "already registered" error case
    else if (
      productData.id === "0" &&
      productData.body === "Product already registered"
    ) {
      return {
        success: false,
        message: "Product already registered",
        errorCode: "ALREADY_EXISTS",
      };
    }
    // Handle any other error cases
    else {
      const errorMessage = productData.Response || "Failed to create product";
      return {
        success: false,
        message: errorMessage,
        data: productData,
      };
    }
  } catch (error) {
    console.error("Error in createProduct:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};
