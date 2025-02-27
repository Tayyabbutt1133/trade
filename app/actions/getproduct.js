"use server"

export async function GETPRODUCT(productId, catid, maincatid, subcatid) {
    console.log("Product ID received at server:", productId);

    try {
        const allproducts = new FormData();
        allproducts.append("catid", catid || "");  // Send empty string if null
        allproducts.append("maincatid", maincatid || "");
        allproducts.append("subcatid", subcatid || "");
        allproducts.append("productid", productId || "");
        const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/products/", {
            method: "POST",
            body: allproducts,
        });

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