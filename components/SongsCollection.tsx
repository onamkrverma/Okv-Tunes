"use client";
import React from "react";
import { TSong } from "@/utils/api.d";
import Image from "next/image";
import secondsToTime from "@/utils/secondsToTime";
import { useGlobalContext } from "@/app/GlobalContex";
import ImageWithFallback from "./ImageWithFallback";

type Props = {
  song: TSong;
};

const SongsCollection = ({ song }: Props) => {
  const { setGlobalState } = useGlobalContext();

  const { id, album, artists, downloadUrl, image, name, duration } = song;

  const artistName = artists.primary[0].name;
  const albumName = album.name;
  const imageUrl =
    image.find((item) => item.quality === "500x500")?.url ?? "logo-circle.svg";
  const audioUrl =
    downloadUrl.find((item) => item.quality === "320kbps")?.url ?? "";

  const handleUpdateState = () => {
    setGlobalState({
      currentSong: {
        id,
        artist: artistName,
        title: name,
        imageUrl,
        audioUrl,
        isMaximise: true,
        isRefetchSuggestion: true,
      },
    });
  };

  return (
    <button
      type="button"
      onClick={handleUpdateState}
      className="flex items-center gap-4 p-2 cursor-pointer hover:bg-secondary"
    >
      <ImageWithFallback
        id={id}
        src={imageUrl}
        alt={name + "okv tunes"}
        width={50}
        height={50}
        priority
        className="w-[50px] h-[50px] object-cover rounded-md"
      />
      <p className="truncate w-80 text-start">
        {name.replaceAll("&quot;", '"')}
      </p>
      <small className="truncate w-60 text-neutral-400 hidden sm:block">
        {artistName}
      </small>
      <small className="truncate w-60 text-neutral-400 hidden sm:block">
        {albumName.replaceAll("&quot;", '"')}
      </small>
      <small className="text-neutral-400">{secondsToTime(duration)}</small>
    </button>
  );
};

export default SongsCollection;
