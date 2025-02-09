"use server"

export const createBuyer = async (formData) => {

  try {
    await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/buyer/", 
      {
        method: "POST",
        body: formData,
      }
    );
    // const data = await res.json(); 
    return { success: true, message: "Buyer created successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: error.response?.data?.message || error.message };
  }
}
