
"use server"

export async function LOGIN(formdata) {
  try {

    console.log(formdata);
    const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/registeration/", {
      method: 'POST',
      body: formdata  
    });

    if (!response.ok) {
      // Attempt to extract error information from the response.
      // Depending on your API, this might be JSON or plain text.
      const errorText = await response.text();
      throw new Error(`Login failed: ${response.status} ${errorText}`);
    }

  // Parse and return the JSON response from the API.
    const data = await response.json();
    console.log("sever response : ", data);
    return data;
  }
  
  catch (error) {
    // Log the error to the console (handle it as needed in your application)
    console.error('Error during login:', error);
    throw error;
  }
}
