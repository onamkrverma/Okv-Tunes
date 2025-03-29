import { randomServer } from "@/utils/server";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get("query");
  const limit = request.nextUrl.searchParams.get("limit");
  const page = request.nextUrl.searchParams.get("page");
  const serverUrl = randomServer();

  try {
    if (!query) {
      return NextResponse.json(
        { error: "search query is required in 'query' parameters" },
        { status: 404 }
      );
    }
    const res = await fetch(
      `${serverUrl}/api/search/songs?query=${query}&limit=${limit}&page=${page}`
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
