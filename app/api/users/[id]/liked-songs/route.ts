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

    const user = await Users.findById(id);
    if (!user) {
      throw new Error("User not exists");
    }
    const likedSongs = user.likedSongs.map(
      (item: { songId: string }) => item.songId
    );

    return NextResponse.json(likedSongs, { status: 200 });
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
