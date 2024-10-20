import { NextRequest, NextResponse } from "next/server";
import { decode, getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const httpMethod = req.method;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  // console.log(token);

  console.log({ pathname });

  if (!token) {
    if (
      pathname === "/playlist/liked-songs" ||
      pathname.startsWith("/playlist/user-playlist")
    ) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (
      pathname.startsWith("/api/users") &&
      pathname.includes("/public-playlist")
    ) {
      return NextResponse.json(
        { error: "Unauthorized!" },
        {
          status: 401,
        }
      );
    }
    if (pathname.startsWith("/api/users") && pathname.endsWith("/playlist")) {
      // return NextResponse.json(
      //   { error: "Unauthorized!" },
      //   {
      //     status: 401,
      //   }
      // );
      console.log(token);
    }
    if (
      pathname.startsWith("/api/users") &&
      pathname.includes("/liked-songs")
    ) {
      return NextResponse.json(
        { error: "Unauthorized!" },
        {
          status: 401,
        }
      );
    }
  } else {
    if (
      pathname.startsWith("/api/users/") &&
      pathname.includes("/playlist") &&
      httpMethod !== "GET"
    ) {
      return NextResponse.json(
        { error: "You do not have access to this playlist" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/playlist/:path*", "/api/users/:path*"],
};
