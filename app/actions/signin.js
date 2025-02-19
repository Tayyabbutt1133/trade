"use server";

import { cookies } from "next/headers";

export async function LOGIN(formdata) {
  const cookieStore = await cookies()
  try {
    const response = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/responses/registeration/",
      {
        method: "POST",
        body: formdata,
        // No need to set 'Content-Type' headers when sending FormData; the browser handles it.
      }
    );

    if (!response.ok) {
      let errorMessage = "Login failed. Please check your credentials.";

      // Attempt to extract a detailed error message from the server response
      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // If JSON parsing fails, try to get plain text
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }

      return { success: false, message: errorMessage };
    }

    // Parse the successful JSON response
    const data = await response.json();
    // Set the cookie with the user ID from the response
    if (data && data.id) {
      cookieStore.set("userId", data.id, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      cookieStore.set("userType", data.type, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      cookieStore.set("userBody", data.body, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    // Validate that we have the expected data structure
    if (!data || typeof data !== "object") {
      return { success: false, message: "Unexpected server response format." };
    }
    if (!data.id || !data.type) {
      return {
        success: false,
        message: "Invalid Login Credentials",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}
