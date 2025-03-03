"use server"



export async function GETCOUNT() {

    const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/dashboard/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
    });

    const jsonCount = response.json();
    return jsonCount;

}