"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PlayerControls from "./PlayerControls";
import { useGlobalContext } from "@/app/GlobalContex";
import SuggestedSongs from "./SuggestedSongs";
import { getSuggestedSongs } from "@/utils/api";
import useSWR from "swr";

const Plalyer = () => {
  const { currentSong, setGlobalState } = useGlobalContext();
  const { id, imageUrl, title, isMaximise, isRefetchSuggestion } = currentSong;

  currentSong.id
    ? localStorage.setItem("currentSong", JSON.stringify(currentSong))
    : null;

  useEffect(() => {
    document.body.style.overflow = isMaximise ? "hidden" : "auto";
  }, [isMaximise]);

  const dataFetcher = () => getSuggestedSongs({ id: id });
  const { data: suggestedSongsData, isLoading } = useSWR(
    "/suggested-songs",
    dataFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const updateNextPrevTrack = (type: "prev" | "next") => {
    if (!suggestedSongsData) return;

    const currentSongIndex = suggestedSongsData.data.findIndex(
      (item) => item.id === id
    );
    const updatorValue = type === "prev" ? -1 : 1;
    let updateSongIndex = currentSongIndex + updatorValue;
    if (currentSongIndex === -1) {
      updateSongIndex = 0;
    }
    // disable next click on last song
    if (updateSongIndex === suggestedSongsData.data.length) return;
    const nextSong = suggestedSongsData.data[updateSongIndex];

    if (!nextSong) return;

    const {
      id: nextId,
      name: nextTitle,
      artists,
      image,
      downloadUrl,
    } = nextSong;
    const nextArtist = artists.primary[0].name;
    const nextImageUrl =
      image.find((item) => item.quality === "500x500")?.url ?? "";
    const nextAudioUrl =
      downloadUrl.find((item) => item.quality === "320kbps")?.url ?? "";

    setGlobalState({
      currentSong: {
        id: nextId,
        title: nextTitle,
        artist: nextArtist,
        imageUrl: nextImageUrl,
        audioUrl: nextAudioUrl,
        isRefetchSuggestion: false,
        isMaximise: currentSong.isMaximise,
      },
    });
  };

  const handleNext = () => {
    updateNextPrevTrack("next");
  };

  const handlePrev = () => {
    updateNextPrevTrack("prev");
  };

  return (
    <div>
      {id ? (
        <>
          <div
            className={`inner-container fixed top-0 right-0 left-0 bg-primary flex gap-4 justify-evenly flex-wrap items-center h-full transition-transform duration-500 ${
              isMaximise ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {/* song poster */}
            <div>
              <Image
                src={imageUrl}
                alt={title + "okv tunes"}
                width={350}
                height={350}
                priority
                className="w-[350px] h-[350px] object-cover rounded-lg"
              />
            </div>
            {/* upcomming tracks */}
            <SuggestedSongs
              suggestedSongsData={suggestedSongsData}
              isLoading={isLoading}
            />
          </div>
          <PlayerControls handleNext={handleNext} handlePrev={handlePrev} />
        </>
      ) : null}
    </div>
  );
};

export default Plalyer;
