import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        // Parse the incoming request body (ensure `req` is passed correctly)
        const formData = await req.formData();

        // Log the received form data for debugging
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log("Received form data:", data);

        // Create a FormData object for the external API request
        const externalFormData = new FormData();
        for (const [key, value] of formData.entries()) {
            externalFormData.append(key, value);
        }

        // Send the data to the external API
        const response = await fetch('https://tradetoppers.esoftideas.com/esi-api/requests/seller/', {
            method: 'POST',
            body: externalFormData,
            credentials: 'include', // If needed for cookies
        });

        // Handle the response
        if (!response.ok) {
            console.error("Failed to add seller. Status:", response.status);
            return NextResponse.json({ error: 'Failed to add seller' }, { status: response.status });
        }

        // Parse and return the response from the external API
        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error in POST route:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
