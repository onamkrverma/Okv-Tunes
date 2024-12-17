"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import React from "react";
import ImageWithFallback from "./ImageWithFallback";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import ls from "localstorage-slim";

type Props = {
  id: string;
  title: string;
  imageUrl?: string;
  artist?: string;
  audioUrl?: string;
  link?: string;
  username?: string;
  type: "song" | "artist" | "playlist" | "album" | "user-playlist";
};
const Card = ({
  title,
  imageUrl,
  artist,
  audioUrl,
  id,
  type,
  link,
  username,
}: Props) => {
  const { setGlobalState, session } = useGlobalContext();

  const router = useRouter();
  const pathname = usePathname();

  const handleUpdateState = () => {
    if (!id || !artist || !audioUrl || !imageUrl) return;
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
    if (!session) {
      return router.push(`/login?next=${pathname}`);
    }
  };

  const urlSlug =
    type === "artist"
      ? `artists/${encodeURIComponent(
          title.replaceAll(" ", "-").toLowerCase()
        )}-${id}`
      : type === "playlist"
      ? `/playlist/${encodeURIComponent(
          title.replaceAll(" ", "-").toLowerCase()
        )}-${id}`
      : type === "album"
      ? `/album/${encodeURIComponent(
          title.replaceAll(" ", "-").toLowerCase()
        )}-${id}`
      : link;

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
              alt={title + " okv tunes"}
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
      ) : type === "album" && imageUrl ? (
        <Link
          href={urlSlug ?? ""}
          className="flex flex-col gap-2 w-[150px] sm:w-[180px] rounded-md cursor-pointer group"
        >
          <div className="w-[150px] sm:w-[180px] relative">
            <ImageWithFallback
              id={id}
              src={imageUrl}
              alt={title + " okv tunes"}
              width={180}
              height={180}
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
          <p className="truncate w-full px-2 pb-2 text-center">
            {title.replaceAll("&quot;", '"')}
          </p>
        </Link>
      ) : type === "artist" && imageUrl ? (
        <Link
          href={urlSlug ?? ""}
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
          </div>
          <p className="truncate w-full px-2 pb-2 text-center">{title}</p>
        </Link>
      ) : (
        <Link
          href={urlSlug ?? ""}
          className="flex flex-col items-center justify-center gap-2 p-2 w-[150px] h-[150px] sm:w-[180px] sm:h-[180px] rounded-md cursor-pointer bg-custom_gradient relative hover:underline underline-offset-2"
        >
          <p className="w-[150px] sm:w-[160px] text-center p-2 text-lg font-bold line-clamp-3">
            {title}
          </p>
          <span className="absolute top-0 left-0 w-full h-28 bg-action/50 -z-10 rounded-t-md rounded-br-[100%]"></span>
          <div className="flex items-center gap-2 absolute bottom-2 left-2">
            {!username ? (
              <img
                src="/logo-circle.svg"
                alt="logo"
                width={32}
                height={32}
                className="w-8 h-8 "
              />
            ) : (
              <>
                <span className="uppercase bg-action text-primary rounded-full h-8 w-8 flex justify-center items-center font-bold">
                  {username?.at(0)}
                </span>

                <small className="truncate w-24">By: {username}</small>
              </>
            )}
          </div>
        </Link>
      )}
    </>
  );
};

export default Card;
