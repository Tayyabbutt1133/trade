"use server";

export async function SEARCH(searchquery) {
    console.log("Data received at server:", searchquery);
    try {
        const formdata = new FormData;
        formdata.append('search', searchquery);
        const response = await fetch(
            `https://tradetoppers.esoftideas.com/esi-api/responses/searchproduct/`, {
            method: "POST",
            body: formdata
        });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
