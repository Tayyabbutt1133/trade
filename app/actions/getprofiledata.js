"use server";

export async function GETPROFILE(webcode) {
    try {
        const formdata = new FormData();
        formdata.append('code', webcode);

        const response = await fetch('https://tradetoppers.esoftideas.com/esi-api/responses/profile/', {
            method: 'POST',
            body: formdata
        });

        const response_json = await response.json();
        console.log("Response from server:", response_json);

        // ✅ Extract the "Registeration" array
        const registrationArray = response_json?.Registeration;

        // ✅ Safely get the first user data object
        if (Array.isArray(registrationArray) && registrationArray.length > 0) {
            return registrationArray[0]; // returning the user data
        } else {
            return null; // no user data found
        }

    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}
