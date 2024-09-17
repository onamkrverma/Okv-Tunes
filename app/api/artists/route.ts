import { NextResponse, type NextRequest } from "next/server";
const mainServerUrl = process.env.MAIN_SERVER_URL;

export const GET = async (requeset: NextRequest) => {
  const id = requeset.nextUrl.searchParams.get("id");
  const limit = requeset.nextUrl.searchParams.get("limit");

  try {
    if (!id) {
      return NextResponse.json(
        { error: "The artist ID is required in 'id' parameters" },
        { status: 404 }
      );
    }
    const res = await fetch(
      `${mainServerUrl}/api/artists/${id}?songCount=${limit}&albumCount=1`
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
