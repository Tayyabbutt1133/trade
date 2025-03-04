"use server";

export async function GETSELLER(data) {
  // data is an object, e.g. { id: "3" }
  console.log("Data received at server:", data);

  try {
    // Build form-data because your endpoint specifically expects it
    const formData = new FormData();
    formData.append("regid", data.id);

    const res = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/responses/seller/",
      {
        method: "POST",
        body: formData,
      }
    );

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: json.message || "Seller fetch failed. Please try again.",
      };
    }

    // Check if we got valid data in the "Sellers" array
    if (json.Sellers && json.Sellers.length > 0) {
      // Return the first seller record
      return { success: true, seller: json.Sellers[0] };
    } else {
      return { success: false, error: "No record found for that ID." };
    }
  } catch (error) {
    console.error("Error in GETSELLER:", error);
    return { success: false, error: "A network error occurred. Please try again." };
  }
}
