"use server";

export async function Register(data) {
  try {

    // When sending FormData, do not set the "Content-Type" header manually.
    const response = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/requests/registeration/",
      {
        method: "POST",
        // Directly pass the FormData object as the request body
        body: data,
      }
    );

    // Check if the response is not OK (non-2xx status)
    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Registration failed:",
        response.status,
        response.statusText,
        errorText
      );
      return { success: false, error: response.statusText };
    }

    console.log("Registration Successful");
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("An error occurred during registration:", error);
    return { success: false, error: error.message };
  }
}
