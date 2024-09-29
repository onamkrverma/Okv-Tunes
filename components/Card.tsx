"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";

type Props = {
  id: string;
  title: string;
  imageUrl?: string;
  artist?: string;
  audioUrl?: string;
  type: "song" | "artist" | "playlist";
};
const Card = ({ title, imageUrl, artist, audioUrl, id, type }: Props) => {
  const { setGlobalState } = useGlobalContext();

  const handleUpdateState = () => {
    if (!artist || !audioUrl || !imageUrl) return;
    setGlobalState((prev) => ({
      ...prev,
      currentSong: {
        id,
        artist,
        title,
        imageUrl,
        audioUrl,
        isMaximise: true,
        isRefetchSuggestion: true,
      },
    }));
  };

  const urlSlug =
    type === "artist"
      ? `artists/${encodeURIComponent(
          title.replaceAll(" ", "-").toLowerCase()
        )}-${id}`
      : `/playlist/${encodeURIComponent(
          title.replaceAll(" ", "-").toLowerCase()
        )}-${id}`;

  return (
    <>
      {type === "song" && imageUrl ? (
        <button
          type="button"
          onClick={handleUpdateState}
          className="flex flex-col gap-2 w-[150px] sm:w-[180px] rounded-md cursor-pointer group"
        >
          <div className="w-[150px] sm:w-[180px] relative">
            <ImageWithFallback
              id={id}
              src={imageUrl}
              alt={title + "okv tunes"}
              width={180}
              height={180}
              className="w-full h-auto object-cover rounded-md"
            />
            <span className="hidden group-hover:flex transition-colors duration-500 absolute top-0 w-full h-full items-center justify-center backdrop-brightness-50 rounded-md">
              <img
                src="/logo-circle.svg"
                alt="logo"
                width={32}
                height={32}
                className="w-8 h-8 z-[1]"
              />
              <span className="absolute w-14 h-14 rounded-full bg-primary/80 transition-transform duration-500 scale-100 hover:scale-150"></span>
            </span>
          </div>
          <p className="truncate w-full px-2 pb-2 text-center">
            {title.replaceAll("&quot;", '"')}
          </p>
        </button>
      ) : type === "artist" && imageUrl ? (
        <Link
          href={urlSlug}
          className="flex flex-col gap-2 w-[150px] sm:w-[180px] rounded-full cursor-pointer group"
        >
          <div className="w-[150px] sm:w-[180px] relative">
            <ImageWithFallback
              id={id}
              src={imageUrl}
              alt={title + "okv tunes"}
              width={180}
              height={180}
              className="w-full h-auto object-cover rounded-full"
            />
            <span className="hidden group-hover:flex transition-colors duration-500 rounded-full absolute top-0 w-full h-full items-center justify-center backdrop-brightness-50">
              <img
                src="/logo-circle.svg"
                alt="logo"
                width={32}
                height={32}
                className="w-8 h-8 z-[1]"
              />
              <span className="absolute w-14 h-14 rounded-full bg-primary/80 transition-transform duration-500 scale-100 hover:scale-150"></span>
            </span>
          </div>
          <p className="truncate w-full px-2 pb-2 text-center">{title}</p>
        </Link>
      ) : (
        <Link
          href={urlSlug}
          className="flex flex-col items-center justify-center gap-2 p-2 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-md cursor-pointer bg-custom_gradient relative"
        >
          <img
            src="/logo-circle.svg"
            alt="logo"
            width={32}
            height={32}
            className="w-8 h-8 absolute bottom-2 left-2"
          />

          <p className="w-full text-center text-xl font-bold">{title}</p>
          <span className="absolute top-0 left-0 w-full h-28 bg-action/50 -z-10 rounded-t-md rounded-br-[100%]"></span>
        </Link>
      )}
    </>
  );
};

export default Card;
