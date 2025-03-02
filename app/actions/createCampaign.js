"use server"

export async function createCampaign(formData) {
  try {
    console.log("Creating campaign with data:", formData)

    const response = await fetch("https://tradetoppers.esoftideas.com/esi-api/requests/campaign/", {
      method: "POST",
      body: formData
    })
    
    const data = await response.json()
    
    return { success: true, data }
  } catch (error) {
    console.error("Error creating campaign:", error)
    return { success: false, error: error.message }
  }
}