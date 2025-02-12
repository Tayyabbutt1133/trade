"use server";

export async function Register(data) {
  try {
    const response = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/requests/registeration/",
      {
        method: "POST",
        body: data,
      }
    );

    if (!response.ok) {
      let errorMessage = "Registration failed. Please try again.";
      try {
        const errorData = await response.json();
        errorMessage = errorData?.message || errorMessage;
      } catch {
        // Ignore JSON parsing error, use default error message
      }
      return { success: false, error: errorMessage };
    }

    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error("Registration Error:", error);
    return { success: false, error: "A network error occurred. Please try again." };
  }
}
