"use server"

export async function LOGIN(formdata) {
  try {
    console.log(formdata);
    const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/responses/registeration/", {
      method: 'POST',
      body: formdata  
    });

    if (!response.ok) {
      // Try to extract an error message from the response
      const errorText = await response.text();
      return { success: false, message: `Login failed: ${errorText}` };
    }

    // Parse the JSON response
    const data = await response.json();
    console.log("Server response:", data);

    return { success: true, data };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "An unexpected error occurred. Please try again later." };
  }
}
