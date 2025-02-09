"use server";

export async function DEMO(data) {
  try {
    const res = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/responses/demography/",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();

    if (!res.ok) {
      // Use the returned message if available; otherwise, use a default error message.
      return { success: false, error: json.message || "Registration failed. Please try again." };
    }

    // Extract the count from the response
    const count = json?.Demography?.[0]?.count || 0;
    return { success: true, count };

  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "A network error occurred. Please try again." };
  }
}
