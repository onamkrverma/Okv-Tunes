"use client";
import React, { useState } from "react";
import PlayIcon from "@/public/icons/play.svg";
import { useGlobalContext } from "@/app/GlobalContex";
import { usePathname, useRouter } from "next/navigation";
import { TSong } from "@/utils/api.d";

type Props = {
  firstSong: TSong;
  suggessionSongIds: string[];
};

const PlayAllSongs = ({ firstSong, suggessionSongIds }: Props) => {
  const { setGlobalState, authToken } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();

  const { id, album, artists, downloadUrl, image, name, duration } = firstSong;

  const artistName = artists.all.map((artist) => artist.name).join(" , ");
  const imageUrl =
    image.find((item) => item.quality === "500x500")?.url ?? "logo-circle.svg";
  const audioUrl =
    downloadUrl.find((item) => item.quality === "320kbps")?.url ?? "";

  const handleUpdateState = () => {
    setGlobalState((prev) => ({
      ...prev,
      currentSong: {
        id,
        artist: artistName,
        title: name,
        imageUrl,
        audioUrl,
        isMaximise: true,
        isRefetchSuggestion: true,
        suggessionSongIds: suggessionSongIds,
      },
    }));
    if (!authToken) {
      return router.push(`/login?next=${pathname}`);
    }
  };

  return (
    <button
      title="play all"
      type="button"
      onClick={handleUpdateState}
      className="group flex items-center justify-center w-14 h-14 border bg-action hover:bg-neutral-800 rounded-full"
    >
      <PlayIcon className="w-6 h-6" />
    </button>
  );
};

export default PlayAllSongs;