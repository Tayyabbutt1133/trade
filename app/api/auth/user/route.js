// app/api/auth/user/route.js
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId");
  const userType = cookieStore.get("userType");
  const userBody = cookieStore.get("userBody");
  if (!userId || !userType) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  // Optional: You could fetch additional user data here based on the ID
  // const userData = await fetchUserData(userId);
  const userData = { id: userId.value, type: userType.value, body: userBody.value };
  return Response.json({
    authenticated: true,
    userData,
  });
}

export async function DELETE(){
  const cookieStore = await cookies();
  cookieStore.delete("userId");
  cookieStore.delete("userType");
  cookieStore.delete("userBody");
  
  return Response.json({
    success: true,
  });
}
