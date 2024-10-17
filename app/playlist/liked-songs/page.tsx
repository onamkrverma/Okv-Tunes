import { auth } from "@/auth";
import ImageWithFallback from "@/components/ImageWithFallback";
import SongsCollection from "@/components/SongsCollection";
import { getLikedSongs, getPlaylists, getSongs } from "@/utils/api";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import LoginIcon from "@/public/icons/login.svg";
import RefreshClient from "@/components/RefreshClient";

export const metadata: Metadata = {
  title: "Liked Songs • Okv-Tunes",
};

const LikedSongs = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const likedSongsIds = userId ? await getLikedSongs({ userId }) : [];

  const likedSongs = (await getSongs({ id: likedSongsIds })).data;

  return (
    <div className="inner-container flex flex-col gap-6">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={likedSongs?.[0].id}
            src={
              likedSongs?.[0].image.find((item) => item.quality === "500x500")
                ?.url ?? "/logo-circle.svg"
            }
            alt={likedSongs?.[0].name + "-okv tunes"}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-md shadow-lg shadow-neutral-700"
          />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            Liked Songs
          </h1>
          <small className="text-neutral-300 text-center sm:text-start">
            List of your liked songs
          </small>
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        {session ? (
          <>
            <div className="flex justify-end items-center">
              <RefreshClient />
            </div>
            {likedSongsIds.length > 0 ? (
              likedSongs.map((song) => (
                <SongsCollection key={song.id} song={song} />
              ))
            ) : (
              <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
                <p className="text-lg font-bold">Liked Song Not Found</p>
                <p className="text-neutral-400 text-sm">
                  Your liked songs will be displayed here. Please like any songs
                  to see them appear.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
            <p className="text-neutral-400 text-sm">
              Your liked songs will be displayed here. Please Login to see them
              appear.
            </p>
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

export default LikedSongs;
