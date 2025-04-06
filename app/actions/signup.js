"use server"
import { cookies } from "next/headers"

export async function Register(data) {
  try {
    const cookieStore = await cookies()

    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/registeration/", {
      method: "POST",
      body: data,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const result = await response.json();
    // return result;


    if (!response.ok || (result.Registeration && result.Registeration[0].body === "Email already registered")) {
      const errorMessage = result.Registeration?.[0]?.body || "Registration failed. Please try again."
      return { success: false, error: errorMessage }
    }
    if (result.Registeration && result.Registeration[0] && result.Registeration[0].id) {
      const registrationData = result.Registeration[0]
      cookieStore.set("userId", registrationData.id.toString(), {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
      cookieStore.set("userType", registrationData.type.replace(/\s+/g, "_"), {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
      })      
      cookieStore.set("userBody", registrationData.status, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
      })
      return { success: true, data: registrationData }
    } else {
      return { success: false, error: "Invalid response from server" }
    }



  } catch (error) {
    console.error("Registration Error:", error)
    if (error.name === 'AbortError') {
      return { success: false, error: "Connection timed out. Please try again later." }
    }
    return { success: false, error: "A network error occurred. Please try again." }
  }
}