"use server"

export const createProduct = async (formData) => {
  try {
    // First, create the product
    const productRes = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/products/", {
      method: "POST",
      body: formData,
    });

    const productData = await productRes.json();

    // Handle different response structures based on the API response
    // Check if Product array exists and has data (success case)
    if (productData.Product && productData.Product.length > 0) {
      const productId = productData.Product[0].id;
      
      // If we have images, upload them one by one
      const images = JSON.parse(formData.get("images") || "[]");
      
      if (images.length > 0) {
        const imageUploadPromises = images.map(async (image) => {
          const imageFormData = new FormData();
          imageFormData.append("productid", productId);
          imageFormData.append("img", image.base64);
          imageFormData.append("logby", formData.get("logby"));

          const imageRes = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/products/Default2.aspx", {
            method: "POST",
            body: imageFormData,
          });

          return imageRes.json();
        });

        // Wait for all image uploads to complete
        await Promise.all(imageUploadPromises);
      }

      return { 
        success: true, 
        message: "Product and images created successfully", 
        data: productData.Product[0]
      };
    } 
    // Check if it's the "already registered" error case
    else if (productData.id === '0' && productData.body === 'Product already registered') {
      return {
        success: false,
        message: "Product already registered",
        errorCode: "ALREADY_EXISTS"
      };
    }
    // Handle any other error cases
    else {
      const errorMessage = productData.body || "Failed to create product";
      return {
        success: false,
        message: errorMessage,
        data: productData
      };
    }

  } catch (error) {
    console.error("Error in createProduct:", error);
    return { 
      success: false, 
      message: error.message || "An unexpected error occurred"
    };
  }
}