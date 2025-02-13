"use server";

export async function CREATEAUDIENCE(data) {
  console.log("Data received at server:", data);
  try {
    const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/audience/", {
      method: "POST",
      body: data,
      // No need to set Content-Type header when sending FormData.
    });

    // Parse the JSON response.
    const json = await res.json();

    if (!res.ok) {
      // Return a failure message based on the server response.
      return { success: false, error: json.message || "Audience failed. Please try again." };
    }

    return { success: true, response: json };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "A network error occurred. Please try again." };
  }
}
