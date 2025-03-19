"use server"

export async function GETPRODUCT(catid, maincatid, subcatid, product, logby, initialSize, initialPage) {
    // console.log("Product ID received at server:", product);

    try {
        const allproducts = new FormData();
        allproducts.append("catid", catid || "");  // Send empty string if null
        allproducts.append("maincatid", maincatid || "");
        allproducts.append("subcatid", subcatid || "");
        allproducts.append("productid", product || "");
        allproducts.append("logby", logby || "");
        allproducts.append("size", initialSize || "");
        allproducts.append("Page", initialPage || "");
        const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/products/", {
            method: "POST",
            body: allproducts,
        });
        // console.log("Product data recieved at server : ", allproducts);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(`API error: ${response.status} ${response.statusText}${errorData ? ' - ' + JSON.stringify(errorData) : ''}`);
        }

        const data = await response.json();
        return { success: true, data };

    } catch (error) {
        console.error("Error fetching product data:", error.message);

        // For client-friendly error handling
        return {
            success: false,
            error: {
                message: "Failed to fetch product data",
                details: process.env.NODE_ENV === "development" ? error.message : null,
                code: error.name === "TypeError" ? "NETWORK_ERROR" : "API_ERROR"
            }
        };
    }
}