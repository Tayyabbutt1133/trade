"use server";

export async function GETBUYER(data) {
  // data is an object, e.g. { id: "3" }
  console.log("Data received at server:", data);

  try {
    // Build form-data because your endpoint specifically expects it
    const formData = new FormData();
    formData.append("regid", data.id);

    const res = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/responses/buyers/",
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Buyer fetch failed. Please try again.",
      };
    }

    // Check if we got valid data in the "Buyers" array
    if (json.Registeration && json.Registeration.length > 0) {
      // Return the first buyer record
      return { success: true, buyer: json.Registeration[0] };
    } else {
      // "No Record" or empty array
      return { success: false, error: "No record found for that ID." };
    }
  } catch (error) {
    console.error("Error in GETBUYER:", error);
    return { success: false, error: "A network error occurred. Please try again." };
  }
}
