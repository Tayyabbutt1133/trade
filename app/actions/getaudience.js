"use server";

export async function GETAUDIENCE(data) {
  // data is an object, e.g. { id: "3" }
  console.log("Data received at server:", data);

  try {
    // Build form-data because your endpoint specifically expects it
    const formData = new FormData();
    formData.append("id", data.id);

    const res = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/responses/audience/",
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Audience fetch failed. Please try again.",
      };
    }

    // Check if we got valid data
    if (json.Audience && json.Audience.length > 0 && json.Audience[0].body !== "No Record") {
      return { success: true, audience: json.Audience[0] };
    } else {
      // "No Record" or empty array
      return { success: false, error: "No record found for that ID." };
    }
  } catch (error) {
    console.error("Error in GETAUDIENCE:", error);
    return { success: false, error: "A network error occurred. Please try again." };
  }
}
