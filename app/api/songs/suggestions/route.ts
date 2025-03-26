import { randomServer } from "@/utils/server";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get("id");
  const limit = request.nextUrl.searchParams.get("limit");
  const serverUrl = randomServer();

  try {
    if (!id) {
      return NextResponse.json(
        { error: "The song ID is required in 'id' parameters" },
        { status: 404 }
      );
    }
    const res = await fetch(
      `${serverUrl}/api/songs/${id}/suggestions?limit=${limit}`
    );
    const data = await res.json();
    if (!data.success) {
      return NextResponse.json(
        { error: "No suggestions found for the given song" },
        { status: 404 }
      );
    }
    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
