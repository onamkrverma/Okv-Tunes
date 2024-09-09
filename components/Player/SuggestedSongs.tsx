"use client";
import { getSuggestedSongs } from "@/utils/api";
import secondsToTime from "@/utils/secondsToTime";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import Loading from "../Loading";

const SuggestedSongs = ({ songId }: { songId: string }) => {
  const dataFetcher = () => getSuggestedSongs({ id: songId });
  const { data, isLoading } = useSWR("/suggested-songs", dataFetcher, {
    // revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return (
    <div className="flex flex-col gap-2 w-full max-w-sm h-[400px] rounded-md p-2">
      <h2 className="font-bold text-xl border-b underline decoration-wavy underline-offset-4 py-2 ">
        Up Next
      </h2>
      <div className="upnext-songs overflow-y-scroll ">
        {!isLoading ? (
          data?.data?.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center gap-4 p-2 cursor-pointer hover:bg-secondary"
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
