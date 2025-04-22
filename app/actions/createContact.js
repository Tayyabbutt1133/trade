"use server"

export async function CONTACT(formdata) {
    console.log("Data Received at Server:", formdata);
  
    try {
      const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/contactus/", {
        method: "POST",
        body: formdata,
      });
  
      const responseData = await response.json();
      return { success: response.ok, data: responseData };
    } catch (error) {
      console.error("Error creating Contact:", error);
      return { success: false, error: error.message };
    }
  }
  