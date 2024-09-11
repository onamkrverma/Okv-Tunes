"use client";
import secondsToTime from "@/utils/secondsToTime";
import Image from "next/image";
import React, { useState } from "react";
import Loading from "../Loading";
import type { Song, TSongs } from "@/utils/api.d";
import { useGlobalContext } from "@/app/GlobalContex";
import CaretUpIcon from "@/public/icons/caret-up.svg";

type Props = {
  suggestedSongsData?: TSongs;
  isLoading: boolean;
};

const SuggestedSongs = ({ suggestedSongsData, isLoading }: Props) => {
  const { setGlobalState } = useGlobalContext();
  const [isUpnextClick, setIsUpnextClick] = useState(false);

  const handleUpdateState = (song: Song) => {
    setGlobalState({
      currentSong: {
        id: song.id,
        artist: song.artists.primary[0].name,
        title: song.name,
        imageUrl:
          song.image.find((item) => item.quality === "500x500")?.url ?? "",
        audioUrl:
          song.downloadUrl.find((item) => item.quality === "320kbps")?.url ??
          "",
        isMaximise: true,
        isRefetchSuggestion: true,
      },
    });
  };

  return (
    <div
      className={`flex sm:translate-x-0 flex-col gap-2 w-full max-w-[80%] sm:max-w-sm h-[300px] sm:h-[400px] rounded-md p-2 sm:bg-secondary/70 bg-secondary absolute sm:static transition-transform duration-500 ${
        isUpnextClick ? "translate-x-0 " : "translate-x-[95%] "
      }`}
    >
      <button
        type="button"
        title="queue"
        onClick={() => setIsUpnextClick(!isUpnextClick)}
        className="sm:hidden flex items-center justify-center gap-1 absolute top-[30%] -left-[50px]  bg-secondary rounded-md rounded-b-none p-2 text-xs -rotate-90 transition-transform duration-500"
      >
        Up Next
        <CaretUpIcon
          className={`w-4 h-4 ${isUpnextClick ? "rotate-180" : "rotate-0"}`}
        />
      </button>
      <h2 className="font-bold text-sm sm:text-xl border-b underline decoration-wavy underline-offset-4 py-2 ">
        Up Next
      </h2>
      <div className="upnext-songs overflow-y-scroll ">
        {!isLoading ? (
          suggestedSongsData?.data?.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-2 cursor-pointer rounded-md hover:bg-secondary"
              onClick={() => handleUpdateState(song)}
            >
              <Image
                src={
                  song.image.find((item) => item.quality === "500x500")?.url ??
                  ""
                }
                alt={song.name + "okv tunes"}
                width={50}
                height={50}
                priority
                className="w-[50px] h-[50px] object-cover rounded-md"
              />
              <p className="truncate w-80">
                {song.name.replaceAll("&quot;", '"')}
              </p>
              <small className="text-neutral-400">
                {secondsToTime(song.duration)}
              </small>
            </div>
          ))
        ) : (
          <Loading loadingText="loading" />
        )}
      </div>
    </div>
  );
};

export default SuggestedSongs;
