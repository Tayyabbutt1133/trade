"use server"

export async function CONTACT(data) {
    console.log("Data Received at Server:", data);
  
    try {
      const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/contactus/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
  
      const responseData = await response.json();
      return { success: response.ok, data: responseData };
    } catch (error) {
      console.error("Error creating Contact:", error);
      return { success: false, error: error.message };
    }
  }
  