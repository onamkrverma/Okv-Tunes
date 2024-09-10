"use client";
import secondsToTime from "@/utils/secondsToTime";
import Image from "next/image";
import React from "react";
import Loading from "../Loading";
import type { Song, TSongs } from "@/utils/api.d";
import { useGlobalContext } from "@/app/GlobalContex";

type Props = {
  suggestedSongsData?: TSongs;
  isLoading: boolean;
};

const SuggestedSongs = ({ suggestedSongsData, isLoading }: Props) => {
  const { currentSong, setGlobalState } = useGlobalContext();

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
    <div className="flex flex-col gap-2 w-full max-w-sm h-[400px] rounded-md p-2">
      <h2 className="font-bold text-xl border-b underline decoration-wavy underline-offset-4 py-2 ">
        Up Next
      </h2>
      <div className="upnext-songs overflow-y-scroll ">
        {!isLoading ? (
          suggestedSongsData?.data?.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-2 cursor-pointer hover:bg-secondary"
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
