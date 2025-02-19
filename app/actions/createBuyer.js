"use server"
export const createBuyer = async (formData) => {
  try {
    // Use the correct singular "buyer" endpoint
    const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/buyer/", 
      {
        method: "POST",
        body: formData,
      }
    );
    
    // Get the response as text first
    const responseText = await res.text();
    
    // Try to parse it as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", responseText.substring(0, 500));
      return { success: false, message: "Server did not return valid JSON" };
    }
    
    // Check if response indicates no record
    if (data.Buyers && data.Buyers[0]?.body === "No Record") {
      return { success: false, message: "No record created/found" };
    }
    
    return { success: true, message: "Buyer created successfully", data: data };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
}