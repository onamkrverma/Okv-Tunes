import Users from "@/models/users";
import connectDB from "@/utils/db";
import { NextResponse, type NextRequest } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    if (!id) {
      return NextResponse.json(
        {
          error: "The user id is required in ':id' params",
        },
        { status: 404 }
      );
    }
    await connectDB();

    let user = null;
    try {
      user = await Users.findById(id);
    } catch (error) {
      user = await Users.findOne({ googleId: id });
    }
    if (!user) {
      throw new Error("User not exists");
    }
    const likedSongs = user.likedSongs.map(
      (item: { songId: string }) => item.songId
    );

    return NextResponse.json(likedSongs, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        },
      }
    );
  }
};
