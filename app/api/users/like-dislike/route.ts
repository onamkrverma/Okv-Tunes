import Users from "@/models/users";
import connectDB from "@/utils/db";
import { NextResponse, type NextRequest } from "next/server";

interface RequestBody {
  songId: string;
  userEmail: string;
}

export const POST = async (request: NextRequest) => {
  const { songId, userEmail }: RequestBody = await request.json();

  try {
    if (!songId || !userEmail) {
      return NextResponse.json(
        {
          error: "The songId and userEmail is required in request body",
        },
        { status: 404 }
      );
    }
    await connectDB();

    const user = await Users.findOne({ email: userEmail });
    if (!user) {
      throw new Error("User not exists");
    }
    const songIndex: number = user.likedSongs.findIndex(
      (likedSong: { songId: string }) => likedSong.songId.toString() === songId
    );
    if (songIndex === -1) {
      user.likedSongs.push({ songId: songId });
      await user.save();
      return NextResponse.json(
        { user, message: "Song Liked" },
        { status: 200 }
      );
    } else {
      user.likedSongs.splice(songIndex, 1);
      await user.save();
      return NextResponse.json(
        { user, message: "Song Disliked" },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
