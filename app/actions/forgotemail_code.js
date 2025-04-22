// Server Action - app/actions/forgotemail_code.js
"use server"

export async function FORGOTPASS(email) {
  try {
    const formdata = new FormData();
    formdata.append('email', email);
    
    const response = await fetch('https://tradetoppers.esoftideas.com/esi-api/requests/forgetpass/', {
      method: "POST",
      body: formdata
    });
    
    const json_formatting_response = await response.json();
    return json_formatting_response;
  } catch (error) {
    // Proper error handling
    console.error("Server action error:", error);
    return { 
      success: false, 
      message: "Failed to process request. Please try again." 
    };
  }
}