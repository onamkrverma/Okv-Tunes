import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const authCookiesName =
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
  const authToken = (await cookies()).get(authCookiesName)?.value;
  if (authToken) {
    return NextResponse.json({ authToken });
  }
  return NextResponse.json({
    authToken: null,
  });
}
