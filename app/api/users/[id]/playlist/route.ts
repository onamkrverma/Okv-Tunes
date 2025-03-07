import Users from "@/models/users";
import connectDB from "@/utils/db";
import { NextResponse, type NextRequest } from "next/server";

interface RequestBody {
  songIds: string[];
  title: string;
  visibility?: "public" | "private";
  playlistId?: string;
  isFullDeletePlaylist?: boolean;
}

export const POST = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const { songIds, title, visibility }: RequestBody = await request.json();

  try {
    if (
      !Array.isArray(songIds) ||
      typeof title !== "string" ||
      songIds.length < 1 ||
      !title
    ) {
      return NextResponse.json(
        { error: "The songIds must be an array and title must be a string" },
        { status: 400 }
      );
    }
    await connectDB();

    const user = await Users.findById(id, { name: 1, playlist: 1 });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    const isPlaylistTitleExist = user.playlist.some((item: { title: string }) =>
      title.toLowerCase().includes(item.title.toLowerCase())
    );
    if (isPlaylistTitleExist) {
      return NextResponse.json(
        { error: "Playlist title already exist" },
        { status: 404 }
      );
    }

    user.playlist.push({ title, songIds, visibility, createdBy: user.name });
    await user.save();

    return NextResponse.json(
      { message: "Playlist created successfully" },
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

// get single playlist with playlistid search param else get all playlist
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const playlistId = request.nextUrl.searchParams.get("playlistid");

  try {
    await connectDB();

    const user = await Users.findById(id, { playlist: 1 });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exists" },
        { status: 400 }
      );
    }

    const playlist = playlistId
      ? user.playlist.find((item: { id: string }) => item.id === playlistId)
      : user.playlist;

    return NextResponse.json(playlist, {
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
      { status: 500 }
    );
  }
};

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const { songIds, title, playlistId, visibility }: RequestBody =
    await request.json();

  try {
    if (typeof playlistId !== "string" || !playlistId) {
      return NextResponse.json(
        {
          error: "The songIds must be an array and playlistId must be a string",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await Users.findById(id, { playlist: 1 });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    const playlist = user.playlist.find(
      (item: { id: string }) => item.id === playlistId
    );

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist does not exist" },
        { status: 404 }
      );
    }

    // Update fields based on provided values
    if (title) {
      playlist.title = title;
    }

    if (visibility) {
      playlist.visibility = visibility;
    }

    if (songIds) {
      const duplicateSongs = songIds.filter((songId) =>
        playlist.songIds.includes(songId)
      );

      if (duplicateSongs.length > 0) {
        return NextResponse.json(
          "The selected song already exist in this playlist",
          { status: 400 }
        );
      }

      playlist.songIds = [...playlist.songIds, ...songIds];
    }

    await Users.updateOne(
      { _id: id, "playlist._id": playlistId },
      {
        $set: {
          "playlist.$.title": playlist.title,
          "playlist.$.visibility": playlist.visibility,
          "playlist.$.songIds": playlist.songIds,
        },
      }
    );

    return NextResponse.json(
      {
        message: "Playlist updated successfully",
        updatedPlaylist: playlist,
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

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const songIds = request.nextUrl.searchParams.getAll("songid");
  const playlistId = request.nextUrl.searchParams.get("playlistid");
  const isFullDeletePlaylist =
    request.nextUrl.searchParams.get("delete-playlist");

  try {
    if (!playlistId) {
      return NextResponse.json(
        {
          error: "The playlistId must be a string",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await Users.findById(id, { playlist: 1 });

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 }
      );
    }

    if (isFullDeletePlaylist === "true") {
      await Users.updateOne(
        { _id: id },
        { $pull: { playlist: { _id: playlistId } } }
      );
      return NextResponse.json(
        { message: "Playlist deleted successfully" },
        { status: 200 }
      );
    }

    const playlist = user.playlist.find(
      (item: { id: string }) => item.id === playlistId
    );

    if (!playlist) {
      return NextResponse.json(
        { error: "Playlist does not exist" },
        { status: 404 }
      );
    }

    const updatedSongIds = playlist.songIds.filter(
      (songId: string) => !songIds.includes(songId)
    );

    await Users.updateOne(
      { _id: id, "playlist._id": playlistId },
      { $set: { "playlist.$.songIds": updatedSongIds } }
    );

    return NextResponse.json(
      {
        message: "Playlist song(s) deleted successfully",
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
