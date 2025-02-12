"use server"


export async function ADDUSER(data) {
    // console.log("Data recieved at server side :", data);
    try {

        const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/users/",
            {
                method: "POST",
                body: data,
            }
        )

        const json = await res.json();

        if (!res.ok) {
            // Return a failure message based on the server response.
            return { success: false, error: json.message || "User failed. Please try again." };
        }

        return { success: true, response: json };


    } catch (error) {
        console.error("Error:", error);
        return { success: false, error: "A network error occurred. Please try again." };
    }
}