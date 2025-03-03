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

    const data = await res.json();

    if(data.id === '0') {
      return { success: false, message: data.body }
    }
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
