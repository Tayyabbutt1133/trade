// app/api/auth/user/route.js
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const userWebcode = cookieStore.get("webcode");

  if (!userWebcode ) {
    return Response.json({ authenticated: false }, { status: 401 });
  }

  // Optional: You could fetch additional user data here based on the ID
  // const userData = await fetchUserData(userId);
  const userData = {
    webcode: userWebcode.value,
  };
  return Response.json({
    authenticated: true,
    userData,
  });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("webcode");
  cookieStore.delete("userType");

  return Response.json({
    success: true,
  });
}
