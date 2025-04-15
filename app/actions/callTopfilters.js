"use server"

export const CALLFILTER = async () => {
    try {
        const response = await fetch('https://tradetoppers.esoftideas.com/esi-api/responses/menu/');

        // Network error or bad response
        if (!response.ok) {
            console.error("Fetch failed with status:", response.status);
            return { success: false, error: `HTTP Error: ${response.status}` };
        }

        const data = await response.json();

        // Validate Records structure
        if (!Array.isArray(data.Records)) {
            return { success: false, error: "Invalid data format: Records is not an array" };
        }

        // Handle "No Record" type cases
        if (
            data.Records.length === 1 &&
            (data.Records[0]?.body === "No Record" || data.Records[0]?.body === "No Records found")
        ) {
            return { success: true, data: [] }; // or return null or a message, depending on frontend expectations
        }

        // If all good, return data
        return { success: true, data: data.Records };

    } catch (error) {
        console.error("Error during CALLFILTER:", error);
        return { success: false, error: "Something went wrong while fetching data" };
    }
};
