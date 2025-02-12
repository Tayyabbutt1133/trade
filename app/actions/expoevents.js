"use server";

export async function EXPO(formdata) {
  console.log("Received form data at server:", formdata);

  try {
    const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/expoevents/", {
      method: "POST",
      body: formdata,
    });

    // Check if the response status is not OK (not 2xx)
    if (!res.ok) {
      const errorText = await res.text();
      const errorMessage = `Request failed with status ${res.status}: ${errorText}`;
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }

    const responseData = await res.json();
    console.log("Server response:", responseData);
    return { success: true, data: responseData };

  } catch (error) {
    console.error("Error in EXPO function:", error);
    return { success: false, error: error.message || "An unknown error occurred" };
  }
}
