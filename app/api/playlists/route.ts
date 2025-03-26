import { randomServer } from "@/utils/server";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");
  const limit = request.nextUrl.searchParams.get("limit");
  const serverUrl = randomServer();
  try {
    if (!id) {
      return NextResponse.json(
        { error: "The playlist ID is required in 'id' parameters" },
        { status: 404 }
      );
    }
    const res = await fetch(
      `${serverUrl}/api/playlists?id=${id}&limit=${limit}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
