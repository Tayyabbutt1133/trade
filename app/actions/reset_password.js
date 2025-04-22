"use server"

export async function RESETPASS(data) {
    try {

        const response = await fetch('https://tradetoppers.esoftideas.com/esi-api/requests/resetpass/', {
            method: 'POST',
            body: data
        })
        
        const response_formatting = response.json();
        return response_formatting;

    } catch (error) {
        
    }


    
}
