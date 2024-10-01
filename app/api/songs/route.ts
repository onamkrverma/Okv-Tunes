import { NextResponse, type NextRequest } from "next/server";
const mainServerUrl = process.env.MAIN_SERVER_URL;

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.getAll("id");

  try {
    if (!id) {
      return NextResponse.json(
        { error: "The song ID is required in 'id' parameters" },
        { status: 404 }
      );
    }
    const res = await fetch(`${mainServerUrl}/api/songs/${id.join(",")}`);
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
