import { NextResponse, type NextRequest } from "next/server";
const mainServerUrl = process.env.MAIN_SERVER_URL;

export const GET = async (request: NextRequest) => {
  const query = request.nextUrl.searchParams.get("query");
  const limit = request.nextUrl.searchParams.get("limit");

  try {
    if (!query) {
      return NextResponse.json(
        { error: "search query is required in 'query' parameters" },
        { status: 404 }
      );
    }
    const res = await fetch(
      `${mainServerUrl}/api/search/artists?query=${query}&limit=${limit}`
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
