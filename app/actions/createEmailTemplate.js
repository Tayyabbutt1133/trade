"use server";

export const createEmailTemplate = async (formData) => {
  console.log(formData);
  try {
    const res = await fetch(
      "https://tradetoppers.esoftideas.com/esi-api/requests/emailtemplate/",
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
      console.error(
        "Failed to parse response as JSON:",
        responseText.substring(0, 500)
      );
      return { success: false, message: "Server did not return valid JSON" };
    }
    console.log(data);
    // Check if response indicates success
    if (data.EmailTemplate && data.EmailTemplate[0]?.body === "No Record") {
      return { success: false, message: "No record created" };
    }

    return {
      success: true,
      message: "Email template created successfully",
      data: data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
