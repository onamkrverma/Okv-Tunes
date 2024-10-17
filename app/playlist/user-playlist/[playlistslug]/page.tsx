import { auth } from "@/auth";
import ImageWithFallback from "@/components/ImageWithFallback";
import SongsCollection from "@/components/SongsCollection";
import {
  getLikedSongs,
  getPlaylists,
  getSongs,
  getUserPlaylist,
} from "@/utils/api";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import LoginIcon from "@/public/icons/login.svg";
import RefreshClient from "@/components/RefreshClient";

type Props = {
  params: { playlistslug: string };
};

export const metadata: Metadata = {
  title: "User Playlist • Okv-Tunes",
};

const UserPlaylistSongs = async ({ params }: Props) => {
  const id = params.playlistslug.split("-").pop() as string;
  const title = params.playlistslug.split("-").slice(0, -1).join(" ");
  const session = await auth();
  const userId = session?.user?.id;
  let userPlaylist = userId
    ? await getUserPlaylist({ userId, playlistId: id })
    : null;

  const playlistSongs = (await getSongs({ id: userPlaylist?.songIds })).data;

  return (
    <div className="inner-container flex flex-col gap-6">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={playlistSongs[0].id}
            src={
              playlistSongs[0].image.find((item) => item.quality === "500x500")
                ?.url ?? "/logo-circle.svg"
            }
            alt={playlistSongs[0].name + "-okv tunes"}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-md shadow-lg shadow-neutral-700"
          />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            {title}
          </h1>
          <div className="flex flex-col gap-1 items-center sm:items-start">
            <small className="text-neutral-300 text-center sm:text-start capitalize">
              Visibility: {userPlaylist?.visibility}
            </small>
            <small className="text-neutral-300 text-center sm:text-start capitalize">
              Playlist Created By: {userPlaylist?.createdBy}
            </small>
            <span className="uppercase bg-action text-primary rounded-full flex justify-center items-center h-8 w-8 text-center font-bold">
              {userPlaylist?.createdBy.at(0) ?? "G"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        {session ? (
          <>
            <div className="flex justify-end items-center">
              <RefreshClient />
            </div>
            {userPlaylist && userPlaylist.songIds.length > 0 ? (
              playlistSongs.map((song) => (
                <SongsCollection
                  key={song.id}
                  song={song}
                  playlistId={userPlaylist._id}
                />
              ))
            ) : (
              <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
                <p className="text-lg font-bold">
                  No song found in this playlist
                </p>
                <small className="text-neutral-400">
                  User saved playlist songs will be displayed here. If this is
                  your playlist, please add songs to see them appear.
                </small>
              </div>
            )}
          </>
        ) : (
          <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
            <small className="text-neutral-400">
              User saved playlist songs will be displayed here. Please Login to
              see them appear.
            </small>
            <Link
              href={"/login"}
              title="login"
              className="flex items-center gap-2 text-xs bg-neutral-800 h-10 hover:bg-secondary hover:border p-2 px-3 rounded-lg"
            >
              <LoginIcon className="w-6 h-6" /> Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPlaylistSongs;
