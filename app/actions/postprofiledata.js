"use server"



export async function POSTPROFILE(formdata) {

    try {

        console.log("Sending profile data:", Object.fromEntries(formdata));
        const response = await fetch('https://tradetoppers.esoftideas.com/esi-api/requests/profile/', {
            method: "POST",
            body: formdata
        })

        // Parse the response
        const result = await response.json();

        if (!response.ok) {
            console.error("Profile update failed:", result);
            return {
                success: false,
                message: result.message || "Failed to update profile"
            };
        }

        console.log("Profile updated successfully:", result);
        return {
            success: true,
            data: result
        };

    } catch (error) {
        console.error("Error in POSTPROFILE:", error);
        return {
            success: false,
            message: "An error occurred while processing your request"
        };
    }


}