"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import Image from "next/image";
import React from "react";

type Props = {
  id: string;
  title: string;
  imageUrl: string;
  artist: string;
  audioUrl: string;
};
const Card = ({ title, imageUrl, artist, audioUrl, id }: Props) => {
  const { setGlobalState } = useGlobalContext();

  const handleUpdateState = () => {
    setGlobalState({
      currentSong: {
        id,
        artist,
        title,
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
      className="flex flex-col gap-2 w-[180px] bg-secondary border rounded-md hover:shadow-primary cursor-pointer"
    >
      <div className="w-[180px] h-[180px]">
        <Image
          src={imageUrl}
          alt={title + "okv tunes"}
          width={180}
          height={180}
          priority
          className="w-full h-full object-cover rounded-t-md"
        />
      </div>
      <p className="truncate w-full px-2 pb-2 text-center">{title}</p>
    </button>
  );
};

export default Card;
