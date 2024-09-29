"use client";
import React, { ChangeEvent, MouseEvent } from "react";
import { TSong } from "@/utils/api.d";
import secondsToTime from "@/utils/secondsToTime";
import { useGlobalContext } from "@/app/GlobalContex";
import ImageWithFallback from "./ImageWithFallback";
import HeartIcon from "@/public/icons/heart.svg";

type Props = {
  song: TSong;
};

const SongsCollection = ({ song }: Props) => {
  const { setGlobalState, likedSongs } = useGlobalContext();

  const { id, album, artists, downloadUrl, image, name, duration } = song;

  const artistName = artists.all.map((artist) => artist.name).join(" , ");
  const albumName = album.name;
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
      },
    }));
  };

  const isLikedSongId =
    likedSongs && likedSongs.length > 0
      ? likedSongs?.some((songId) => songId === id)
      : false;

  const handleLiked = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (isLikedSongId) {
      const updateList = likedSongs.filter((songId) => songId !== id);
      return setGlobalState((prev) => ({
        ...prev,
        likedSongs: updateList,
      }));
    }
    setGlobalState((prev) => ({
      ...prev,
      likedSongs: [...likedSongs, id],
    }));
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
      <span role="button" onClick={(e) => handleLiked(e)}>
        <HeartIcon
          className={`w-6 h-6 fill-none ${
            isLikedSongId ? "!fill-action stroke-action" : ""
          }`}
        />
      </span>
      <small className="text-neutral-400">{secondsToTime(duration)}</small>
    </button>
  );
};

export default SongsCollection;
