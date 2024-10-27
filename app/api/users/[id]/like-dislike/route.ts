import Users from "@/models/users";
import connectDB from "@/utils/db";
import { NextResponse, type NextRequest } from "next/server";

interface RequestBody {
  songId: string;
}

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { songId }: RequestBody = await request.json();

  try {
    if (!songId) {
      return NextResponse.json(
        { error: "The songId is required in request body" },
        { status: 404 }
      );
    }

    await connectDB();

    const user = await Users.findById(id, { likedSongIds: 1 });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    const songIndex: number = user.likedSongIds.findIndex(
      (likedSongId: string) => likedSongId === songId
    );

    if (songIndex === -1) {
      user.likedSongIds.push(songId);
    } else {
      user.likedSongIds.splice(songIndex, 1);
    }

    await Users.updateOne(
      { _id: id },
      { $set: { likedSongIds: user.likedSongIds } }
    );

    return NextResponse.json(
      {
        message: songIndex === -1 ? "Song Liked" : "Song Disliked",
        likedSongIds: user.likedSongIds,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
