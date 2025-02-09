"use server";

export async function CREATEAUDIENCE(data) {
  console.log("Data recieved at server :", data);
  try {
    const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/audience/", {
      method: "POST",
      body: data,
    });

    // Read the JSON response once
    const json = await res.json();

    if (!res.ok) {
      // Use the returned message if available; otherwise, use a default error message.
      return { success: false, error: json.message || "Audience failed. Please try again." };
    }

    return { success: true, response: json };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "A network error occurred. Please try again." };
  }
}
