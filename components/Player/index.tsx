"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/app/GlobalContex";
import SuggestedSongs from "./SuggestedSongs";
import { getSuggestedSongs } from "@/utils/api";
import useSWR, { mutate } from "swr";
import MiniPlayer from "./MiniPlayer";
import ReactPlayer from "react-player";
import CaretUpIcon from "@/public/icons/caret-up.svg";
import ThreeDotsIcon from "@/public/icons/three-dots.svg";
import ImageWithFallback from "@/components/ImageWithFallback";
import InfoIcon from "@/public/icons/info.svg";
import Popup from "./Popup";
import { usePathname } from "next/navigation";
import ls from "localstorage-slim";

export type TplayerState = {
  url: string;
  playing: boolean;
  controls: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded?: number;
  autoPlay: boolean;
};

const Plalyer = () => {
  const { currentSong, setGlobalState, session } = useGlobalContext();
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
    played: 0, // in seconds
    loaded: 0,
    autoPlay: false,
  });
  const playerRef = useRef<ReactPlayer>(null);
  const [isMoreBtnClick, setIsMoreBtnClick] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const pathName = usePathname();

  currentSong.id
    ? ls.set(
        "currentSong",
        { ...currentSong, volume: playerState.volume },
        { encrypt: true }
      )
    : null;

  useEffect(() => {
    document.body.style.overflow = isMaximise ? "hidden" : "auto";
  }, [isMaximise]);

  const dataFetcher = () => getSuggestedSongs({ id: id, limit: 20 });
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
    mutate("/suggested-songs");
  }, [isRefetchSuggestion]);

  const updateNextPrevTrack = (type: "prev" | "next") => {
    if (!suggestedSongsData || !suggestedSongsData?.success) return;

    const currentSongIndex = suggestedSongsData.data?.findIndex(
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

    setGlobalState((prev) => ({
      ...prev,
      currentSong: {
        id: nextId,
        title: nextTitle,
        artist: nextArtist,
        imageUrl: nextImageUrl,
        audioUrl: nextAudioUrl,
        isRefetchSuggestion: false,
        isMaximise: currentSong.isMaximise,
      },
    }));
  };

  const handleNext = () => {
    if (!suggestedSongsData || !suggestedSongsData?.success) return;
    updateNextPrevTrack("next");
    setPlayerState({ ...playerState, autoPlay: true, playing: true });
  };

  const handlePrev = () => {
    updateNextPrevTrack("prev");
  };

  useEffect(() => {
    setGlobalState((prev) => ({
      ...prev,
      currentSong: { ...currentSong, isRefetchSuggestion: false },
    }));
    // set url on songs changes
    setPlayerState((prev) => ({
      ...prev,
      url: audioUrl,
    }));
    // eslint-disable-next-line
  }, [audioUrl]);

  // media session
  useEffect(() => {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        album: artist,
        artwork: [
          {
            src: imageUrl,
            sizes: "96x96",
            type: "image/jpg",
          },
          {
            src: imageUrl,
            sizes: "128x128",
            type: "image/jpg",
          },
          {
            src: imageUrl,
            sizes: "192x192",
            type: "image/jpg",
          },
          {
            src: imageUrl,
            sizes: "256x256",
            type: "image/jpg",
          },
          {
            src: imageUrl,
            sizes: "384x384",
            type: "image/jpg",
          },
          {
            src: imageUrl,
            sizes: "512x512",
            type: "image/jpg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        setPlayerState({ ...playerState, playing: true });
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        setPlayerState({ ...playerState, playing: false });
      });

      navigator.mediaSession.setActionHandler("seekbackward", () => {
        playerRef.current?.seekTo(playerState.played - 10);
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        playerRef.current?.seekTo(playerState.played + 10);
      });

      if (!suggestedSongsData || !suggestedSongsData?.success) return;
      const currentSongIndex = suggestedSongsData.data?.findIndex(
        (item) => item.id === id
      );
      if (currentSongIndex > 0) {
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          handlePrev();
        });
      } else {
        // Unset the "previoustrack" action handler at the end of a list.
        navigator.mediaSession.setActionHandler("previoustrack", null);
      }

      if (currentSongIndex !== suggestedSongsData.data.length - 1) {
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          handleNext();
        });
      } else {
        // Unset the "nexttrack" action handler at the end of a playlist.
        navigator.mediaSession.setActionHandler("nexttrack", null);
      }
    }

    // eslint-disable-next-line
  }, [currentSong, playerState]);

  // minimise player on router change
  useEffect(() => {
    setGlobalState((prev) => ({
      ...prev,
      currentSong: { ...currentSong, isMaximise: false },
    }));
    setIsPopup(false);
    // eslint-disable-next-line
  }, [pathName]);

  return (
    <div>
      {session && id ? (
        <>
          <div
            className={`!mt-0 fixed top-0 right-0 left-0 bg-primary flex gap-4 sm:justify-evenly !pt-20 sm:!pt-0 flex-col md:flex-row items-center h-full z-[11] transition-transform duration-700 ${
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
                  setGlobalState((prev) => ({
                    ...prev,
                    currentSong: {
                      ...currentSong,
                      isMaximise: !currentSong.isMaximise,
                    },
                  }))
                }
              >
                <CaretUpIcon className={`w-6 h-6 `} />
              </button>
              <button
                type="button"
                title="more"
                className=""
                onClick={() => setIsMoreBtnClick(!isMoreBtnClick)}
              >
                <ThreeDotsIcon className={`w-6 h-6 `} />
              </button>
            </div>

            <div
              className={` absolute top-0 right-10 bg-secondary flex flex-col gap-2 p-2 rounded-md transition-transform duration-500 ${
                isMoreBtnClick ? "translate-y-8" : "-translate-y-full"
              } `}
            >
              <button
                type="button"
                className="flex items-center gap-1"
                onClick={() => setIsPopup(true)}
              >
                <InfoIcon className="w-4 h-4" />
                Info
              </button>
            </div>

            <div
              className={`absolute w-full h-full blur-[600px] -z-10 pointer-events-none ${
                !isMaximise ? "hidden" : "block"
              }`}
            >
              <ImageWithFallback
                id={currentSong.id}
                src={imageUrl}
                fallbackSrc={"/logo-circle.svg"}
                alt={title + " okv tunes"}
                width={500}
                height={500}
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
                  played: state.playedSeconds,
                })
              }
              {...playerState}
              className="hidden"
            />
            <div className="flex flex-col gap-4">
              {/* song poster */}
              <div className="w-[250px] sm:w-[150px] md:w-[250px] lg:w-[350px]">
                <ImageWithFallback
                  id={currentSong.id}
                  src={imageUrl}
                  fallbackSrc={"/logo-circle.svg"}
                  alt={title + " okv tunes"}
                  width={350}
                  height={350}
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
          {isPopup ? (
            <Popup
              isPopup={isPopup}
              setIsPopup={setIsPopup}
              songId={id}
              variant="song-info"
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default Plalyer;
