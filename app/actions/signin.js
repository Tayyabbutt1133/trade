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
      }
    );

    if (!response.ok) {
      let errorMessage = "Login failed. Please check your credentials.";

      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        const errorText = await response.text();
        if (errorText) {
          errorMessage = errorText;
        }
      }

      return { success: false, message: errorMessage };
    }

    // Parse the successful JSON response
    const responseData = await response.json();
    
    // Handle both response formats
    let userData;
    
    // Check if response contains the Registeration array format
    if (responseData && responseData.Registeration && Array.isArray(responseData.Registeration) && responseData.Registeration.length > 0) {
      // Use the first item from the Registeration array
      userData = responseData.Registeration[0];
      // Convert id to string if it's a number with decimal
      if (typeof userData.id === 'number') {
        userData.id = String(Math.floor(userData.id));
      }
    } else if (responseData && responseData.id) {
      // Direct format
      userData = responseData;
    } else {
      return { success: false, message: "Unexpected server response format." };
    }

    // Validate that we have the expected data after normalization
    if (!userData.id || !userData.type) {
      return {
        success: false,
        message: "Invalid Login Credentials",
      };
    }

    // Set cookies with user data
    cookieStore.set("userId", userData.id, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    cookieStore.set("userType", userData.type, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    cookieStore.set("userBody", userData.body, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    // If there's additional data in the admin response, you might want to store it
    // if (userData.status) {
    //   cookieStore.set("userStatus", userData.status, {
    //     path: "/",
    //     httpOnly: true,
    //     maxAge: 60 * 60 * 24 * 7,
    //   });
    // }
    
    // if (userData.email) {
    //   cookieStore.set("userEmail", userData.email, {
    //     path: "/",
    //     httpOnly: true,
    //     maxAge: 60 * 60 * 24 * 7,
    //   });
    // }

    return { success: true, data: userData };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    };
  }
}