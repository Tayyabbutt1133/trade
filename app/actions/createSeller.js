"use server"

export const createSeller = async (formData) => {
  const rawData = {
    sellername: formData.get('sellername'),
    email: formData.get('email'),
    ccontact: formData.get('compcontact'),
    address: formData.get('address'),
    pocname: formData.get('pocname'),
    poccontact: formData.get('poccontact'),
    country: formData.get('country'),
    designation: formData.get('designation'),
    industry: formData.get('industry'),
    status: formData.get('status'),
    blocked: formData.get('blocked'),
  }
  try {
    console.log(rawData);
    const res = await fetch("https://tradetoppers.esoftideas.com/esi-api/request/seller", {
      method: "POST",
      body: rawData,
    });
    if (!res.ok) {
      return { success: false, message: "Error creating seller" };
    }
    const data = await res.json();
    return { success: true, message: "Seller created successfully", data };
  } catch (error) {
    return { success: false, message: "Error creating seller" };
  }
}
