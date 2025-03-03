"use server"



export async function GETCOUNT() {

    const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/dashboard/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        cache: "no-store",
        next: {
            revalidate: 0
        }
    });

    const jsonCount = await response.json();
    return jsonCount;

}