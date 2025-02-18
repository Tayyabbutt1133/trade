"use server"

import { cookies } from "next/headers"

export async function Register(data) {
  try {
    const cookieStore = await cookies()
    const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/registeration/", {
      method: "POST",
      body: data,
    })

    const result = await response.json()
    console.log("Registration result:", result)

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
      cookieStore.set("userType", registrationData.type, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7, // 1 week
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
    return { success: false, error: "A network error occurred. Please try again." }
  }
}

