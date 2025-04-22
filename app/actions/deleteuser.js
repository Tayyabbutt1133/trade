"use server"



export async function DELETEUSER(webcode) {

    try {

        const response = await fetch('https://tradetoppers.esoftideas.com/esi-api/requests/deactivate/', {
            method: "POST",
            body: webcode
        })


        const response_formatting = response.json();
        return response_formatting


    } catch (error) {

    }

}