"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/app/GlobalContex";
import SuggestedSongs from "./SuggestedSongs";
import { getSuggestedSongs } from "@/utils/api";
import useSWR, { mutate } from "swr";
import MiniPlayer from "./MiniPlayer";
import ReactPlayer from "react-player";
import CaretUpIcon from "@/public/icons/caret-up.svg";
import ThreeDotsIcon from "@/public/icons/three-dots.svg";

export type TplayerState = {
  url: string;
  playing: boolean;
  controls: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
};

const Plalyer = () => {
  const { currentSong, setGlobalState } = useGlobalContext();
  const {
    id,
    imageUrl,
    title,
    isMaximise,
    artist,
    audioUrl,
    isRefetchSuggestion,
  } = currentSong;
  const [playerState, setPlayerState] = useState<TplayerState>({
    url: "",
    playing: false,
    controls: false,
    // volume: parseFloat(localVolume) ?? 1.0,
    volume: 0.1,
    muted: false,
    played: 0,
    loaded: 0,
  });
  const playerRef = useRef<ReactPlayer>(null);

  currentSong.id
    ? localStorage.setItem("currentSong", JSON.stringify(currentSong))
    : null;

  useEffect(() => {
    document.body.style.overflow = isMaximise ? "hidden" : "auto";
  }, [isMaximise]);

  const dataFetcher = () => getSuggestedSongs({ id: id });
  const { data: suggestedSongsData, isLoading } = useSWR(
    id ? "/suggested-songs" : null,
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

  useEffect(() => {
    // set url on songs changes
    setPlayerState({
      ...playerState,
      url: audioUrl,
    });
  }, [currentSong]);

  return (
    <div>
      {id ? (
        <>
          <div
            className={`inner-container !mt-0 fixed top-0 right-0 left-0 bg-primary flex gap-4 sm:justify-evenly !pt-12 sm:!pt-0  flex-col sm:flex-row items-center h-full z-[11] transition-transform duration-500 ${
              isMaximise ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="w-full flex justify-between items-center absolute top-3 px-4">
              <button
                type="button"
                title={isMaximise ? "minimise" : "maximise"}
                className={`transition-transform ${
                  isMaximise ? "rotate-180" : "rotate-0"
                }`}
                onClick={() =>
                  setGlobalState({
                    currentSong: {
                      ...currentSong,
                      isMaximise: !currentSong.isMaximise,
                    },
                  })
                }
              >
                <CaretUpIcon className={`w-6 h-6 `} />
              </button>
              <button
                type="button"
                title="more"
                className=""
                onClick={() => {}}
              >
                <ThreeDotsIcon className={`w-6 h-6 `} />
              </button>
            </div>

            <div className="absolute w-full h-full blur-[600px] -z-10 pointer-events-none">
              <Image
                src={imageUrl}
                alt={title + "okv tunes"}
                width={500}
                height={500}
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <ReactPlayer
              ref={playerRef}
              onPlay={() => setPlayerState({ ...playerState, playing: true })}
              onPause={() => setPlayerState({ ...playerState, playing: false })}
              onProgress={(state) =>
                setPlayerState({
                  ...playerState,
                  played: state.played,
                  loaded: state.loaded,
                })
              }
              {...playerState}
              className="hidden"
            />
            {/* song poster */}
            <div className="w-[250px] h-[250px]  sm:w-[350px] sm:h-[350px]">
              <Image
                src={imageUrl}
                alt={title + "okv tunes"}
                width={350}
                height={350}
                priority
                className="w-full h-full  object-cover rounded-lg"
              />
            </div>
            <div className="flex sm:hidden flex-col items-center w-full">
              <p className="truncate text-2xl">
                {title?.replaceAll("&quot;", '"')}
              </p>
              <small className="truncate text-neutral-400 ">{artist}</small>
            </div>

            {/* upcomming tracks */}
            <SuggestedSongs
              suggestedSongsData={suggestedSongsData}
              isLoading={isLoading}
            />
          </div>

          <MiniPlayer
            playerRef={playerRef}
            playerState={playerState}
            setPlayerState={setPlayerState}
            handleNext={handleNext}
            handlePrev={handlePrev}
          />
        </>
      ) : null}
    </div>
  );
};

export default Plalyer;
