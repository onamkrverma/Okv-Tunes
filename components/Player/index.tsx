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
  autoPlay: boolean;
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
    volume,
  } = currentSong;
  const [playerState, setPlayerState] = useState<TplayerState>({
    url: "",
    playing: false,
    controls: false,
    volume: volume ?? 1.0,
    muted: false,
    played: 0,
    loaded: 0,
    autoPlay: false,
  });
  const playerRef = useRef<ReactPlayer>(null);

  currentSong.id
    ? localStorage.setItem(
        "currentSong",
        JSON.stringify({ ...currentSong, volume: playerState.volume })
      )
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

  useEffect(() => {
    if (!isRefetchSuggestion) return;
    // mutate("/suggested-songs");
  }, [isRefetchSuggestion]);

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
    setPlayerState((prev) => ({
      ...prev,
      url: audioUrl,
      playing: playerState.autoPlay,
    }));
    // eslint-disable-next-line
  }, [audioUrl]);

  return (
    <div>
      {id ? (
        <>
          <div
            className={`inner-container !mt-0 fixed top-0 right-0 left-0 bg-primary flex gap-4 sm:justify-evenly !pt-12 sm:!pt-0 flex-col md:flex-row items-center h-full z-[11] transition-transform duration-700 ${
              isMaximise ? "translate-y-0" : "translate-y-[150%]"
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

            <div
              className={`absolute w-full h-full blur-[600px] -z-10 pointer-events-none ${
                !isMaximise ? "hidden" : "block"
              }`}
            >
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
              onEnded={() => (playerState.autoPlay ? handleNext() : null)}
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
            <div className="w-[250px] sm:w-[350px]">
              <Image
                src={imageUrl}
                alt={title + "okv tunes"}
                width={350}
                height={350}
                priority
                className="w-full h-auto  object-cover rounded-lg"
              />
            </div>
            <div className="flex sm:hidden flex-col items-center w-full max-w-60">
              <p className="truncate text-2xl w-full text-center">
                {title?.replaceAll("&quot;", '"')}
              </p>
              <small className="truncate text-neutral-300 w-full text-center">
                {artist}
              </small>
            </div>

            {/* upcomming tracks */}
            <SuggestedSongs
              suggestedSongsData={suggestedSongsData}
              isLoading={isLoading}
              playerState={playerState}
              setPlayerState={setPlayerState}
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
