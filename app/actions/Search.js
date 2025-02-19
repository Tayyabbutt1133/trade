"use server";

export async function SEARCH(searchquery) {
    console.log("Data received at server:", searchquery);
    try {
        const response = await fetch(
            `https://tradetoppers.esoftideas.com/esi-api/responses/searchproduct/?search=${encodeURIComponent(searchquery)}`, {
                cache: "no-cache",
                next: {
                    tags: ["results"]
                }
            });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
