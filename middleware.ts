import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const { AUTH_SECRET } = process.env;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: AUTH_SECRET });
  console.log(pathname);
  if (!token) {
    if (
      pathname.startsWith("/playlist/liked-songs") ||
      pathname.startsWith("/playlist/user-playlist")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/api/users")) {
      return NextResponse.json({ error: "Unauthorized!" }, { status: 401 });
    }
  } else {
    if (
      !pathname.startsWith(`/api/users/${token.sub}`) &&
      pathname !== "/api/users/public-playlist"
    ) {
      return NextResponse.json(
        { error: "You do not have access" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/playlist/:path*", "/api/users/:path*"],
};
