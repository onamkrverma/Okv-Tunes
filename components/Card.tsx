"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import Image from "next/image";
import React from "react";
import PlayIcon from "@/public/icons/play.svg";

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
      className="flex flex-col gap-2 w-[150px] sm:w-[180px] bg-secondary border rounded-md hover:shadow-primary cursor-pointer group"
    >
      <div className="w-[150px] sm:w-[180px] relative">
        <Image
          src={imageUrl}
          alt={title + "okv tunes"}
          width={180}
          height={180}
          priority
          className="w-full h-auto object-cover rounded-t-md"
        />
        <span className="hidden group-hover:flex transition-colors duration-500 rounded-md absolute top-0 w-full h-full items-center justify-center backdrop-brightness-50">
          <PlayIcon className="w-8 h-8 p-1 rounded-full bg-action transition-transform duration-500 hover:scale-150" />
        </span>
      </div>
      <p className="truncate w-full px-2 pb-2 text-center">{title}</p>
    </button>
  );
};

export default Card;
