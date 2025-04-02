import { randomServer } from "@/utils/server";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");
  const serverUrl = randomServer();

  try {
    if (!id) {
      return NextResponse.json(
        { error: "The album ID is required in 'id' parameters" },
        { status: 404 }
      );
    }
    const res = await fetch(`${serverUrl}/api/albums?id=${id}`);
    const data = await res.json();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "s-maxage=43200, stale-while-revalidate=21600",
      },
    });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
