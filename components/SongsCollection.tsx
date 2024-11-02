"use client";
import React, { ChangeEvent, MouseEvent, useState } from "react";
import { TSong } from "@/utils/api.d";
import secondsToTime from "@/utils/secondsToTime";
import { useGlobalContext } from "@/app/GlobalContex";
import ImageWithFallback from "./ImageWithFallback";
import dynamic from "next/dynamic";
import ThreeDotsIcon from "@/public/icons/three-dots.svg";
import DeleteIcon from "@/public/icons/delete.svg";
import { usePathname, useRouter } from "next/navigation";
import { deleteUserPlaylistSongs } from "@/utils/api";
const LikeDislike = dynamic(() => import("./LikeDislike"), { ssr: false });

type Props = {
  song: TSong;
  playlistId?: string;
  index: number;
  type?: "public" | "private";
};

const SongsCollection = ({ song, playlistId, index, type }: Props) => {
  const { setGlobalState, authToken, session } = useGlobalContext();
  const router = useRouter();
  const pathname = usePathname();

  const [isMoreBtnClick, setIsMoreBtnClick] = useState(false);

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
    if (!session) {
      return router.push(`/login?next=${pathname}`);
    }
  };

  const handleRemoveSongs = async (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    try {
      if (!session || !authToken || !playlistId) return;
      const userId = session?.user?.id ?? "";

      const res = await deleteUserPlaylistSongs({
        authToken,
        userId,
        playlistSongIds: [song.id],
        playlistId,
      });
      setGlobalState((prev) => ({
        ...prev,
        alertMessage: {
          isAlertVisible: true,
          message: res?.message ?? "Success",
        },
      }));
      setIsMoreBtnClick(false);
    } catch (error) {
      if (error instanceof Error)
        setGlobalState((prev) => ({
          ...prev,
          alertMessage: { isAlertVisible: true, message: error.message },
        }));
    }
  };

  return (
    <div
      onClick={handleUpdateState}
      className="flex items-center gap-4 p-2 cursor-pointer hover:bg-secondary relative rounded-md"
    >
      <span className="text-neutral-400 text-sm">{index + 1}</span>
      <ImageWithFallback
        id={id}
        src={imageUrl}
        alt={name + "-okv tunes"}
        width={50}
        height={50}
        className="w-[50px] h-[50px] object-cover rounded-md"
      />
      <div className="song-title-wrapper w-16 sm:w-20 lg:w-full">
        <p className="truncate text-start max-w-[90%]">
          {name.replaceAll("&quot;", '"')}
        </p>
        <small className="truncate text-neutral-400 block sm:hidden">
          {artistName.slice(0, 30)}
        </small>
      </div>
      <small className="truncate w-60 text-neutral-400 hidden sm:block">
        {artistName}
      </small>
      <small className="truncate w-60 text-neutral-400 hidden sm:block">
        {albumName.replaceAll("&quot;", '"')}
      </small>
      <LikeDislike songId={id} />
      <small className="text-neutral-400">{secondsToTime(duration)}</small>
      <button
        type="button"
        title="more"
        className=""
        onClick={(e) => {
          e.stopPropagation();
          setIsMoreBtnClick(!isMoreBtnClick);
        }}
      >
        <ThreeDotsIcon className="w-6 h-6" />
      </button>
      <div
        className={`absolute bottom-2 right-12 bg-neutral-800 border flex-col gap-2 p-2 rounded-md z-[5] hover:bg-secondary ${
          isMoreBtnClick ? "flex" : "hidden"
        } `}
      >
        {playlistId && type === "private" ? (
          <button
            type="button"
            className="flex items-center gap-1 text-xs"
            onClick={handleRemoveSongs}
          >
            <DeleteIcon className="w-4 h-4" />
            Remove from playlist
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SongsCollection;
