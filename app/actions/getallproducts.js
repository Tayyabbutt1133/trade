"use server";

export async function GETALLPRODUCT(catid, maincatid, subcatid, productid, logby, size, Page) {
    // console.log("TopCategory Response at server:", catid);
    // console.log("MainCategory Response at server:", maincatid);
    // console.log("subCategory Response at server:", subcatid);
    // console.log("ProductID Response at server:", productid);

    try {
        const allproducts = new FormData();
        allproducts.append("catid", catid || "");  // Send empty string if null
        allproducts.append("maincatid", maincatid || "");
        allproducts.append("subcatid", subcatid || "");
        allproducts.append("productid", productid || "");
        allproducts.append("logby", logby || "");
        allproducts.append("size", size || "");
        allproducts.append("Page", Page || "");
        console.log("Product data recieve at server :", allproducts);

        const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/products/", {
            method: "POST",
            body: allproducts
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("API Error:", response.status, errorText);
            return {
                success: false,
                error: `API Request Failed: ${response.statusText} (${response.status})`,
            };
        }

        let jsonData;
        try {
            jsonData = await response.json();
        } catch (parseError) {
            console.error("JSON Parsing Error:", parseError);
            return {
                success: false,
                error: "Invalid response format from API.",
            };
        }

        return {
            success: true,
            data: jsonData
        };
    } catch (error) {
        console.error("Network or Server Error:", error);
        return {
            success: false,
            error: "Something went wrong. Please try again later.",
        };
    }
}
