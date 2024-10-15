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
        {
          error: "The songId is required in request body",
        },
        { status: 404 }
      );
    }
    await connectDB();

    const user = await Users.findById(id, { likedSongs: 1 });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }
    const songIndex: number = user.likedSongs.findIndex(
      (likedSong: { songId: string }) => likedSong.songId.toString() === songId
    );
    if (songIndex === -1) {
      user.likedSongs.push({ songId: songId });
      await user.save();
      const likedSongs = user.likedSongs.map(
        (item: { songId: string }) => item.songId
      );
      return NextResponse.json(
        { message: "Song Liked", likedSongs },
        { status: 200 }
      );
    } else {
      user.likedSongs.splice(songIndex, 1);
      await user.save();
      const likedSongs = user.likedSongs.map(
        (item: { songId: string }) => item.songId
      );
      return NextResponse.json(
        { message: "Song Disliked", likedSongs },
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
