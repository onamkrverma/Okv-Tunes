"use client";
import secondsToTime from "@/utils/secondsToTime";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "../Loading";
import type { TSong, TSongs } from "@/utils/api.d";
import { useGlobalContext } from "@/app/GlobalContex";
import CaretUpIcon from "@/public/icons/caret-up.svg";
import PlayIcon from "@/public/icons/play.svg";
import PauseIcon from "@/public/icons/pause.svg";
import { TplayerState } from "./index";
import ImageWithFallback from "../ImageWithFallback";

type Props = {
  suggestedSongsData?: TSongs;
  isLoading: boolean;
  playerState: TplayerState;
  setPlayerState: Dispatch<SetStateAction<TplayerState>>;
};

const SuggestedSongs = ({
  suggestedSongsData,
  isLoading,
  playerState,
  setPlayerState,
}: Props) => {
  const { currentSong, setGlobalState } = useGlobalContext();
  const [isUpnextClick, setIsUpnextClick] = useState(false);
  const suggestedSongsRef = useRef<HTMLDivElement>(null);

  const handleUpdateState = (song: TSong) => {
    setGlobalState((prev) => ({
      ...prev,
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
        isRefetchSuggestion: false,
      },
    }));
  };

  useEffect(() => {
    const handleClickOutside = (e: globalThis.MouseEvent) => {
      if (
        suggestedSongsRef.current &&
        !suggestedSongsRef.current.contains(e.target as Node)
      ) {
        setIsUpnextClick(false);
      }
    };

    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`flex sm:translate-x-0 flex-col gap-2 w-full max-w-[80%] sm:max-w-sm h-[320px] sm:h-[400px] rounded-md p-2 sm:bg-secondary/70 bg-secondary absolute sm:static transition-transform duration-500 ${
        isUpnextClick ? "translate-x-0" : "translate-x-[95%]"
      }`}
      ref={suggestedSongsRef}
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
      <div className="flex items-center gap-2 w-full border-b">
        <h2 className="uppercase font-bold text-sm sm:text-lg underline underline-offset-4 py-2 ">
          Up Next
        </h2>
        <label className="w-10 h-3 relative">
          <input
            type="checkbox"
            title="autoplay"
            aria-label="autoplay"
            placeholder="autoplay"
            checked={playerState.autoPlay}
            disabled={!suggestedSongsData?.success}
            onChange={() =>
              setPlayerState({
                ...playerState,
                autoPlay: !playerState.autoPlay,
              })
            }
            className="hidden"
          />
          <span
            className="w-full h-full absolute top-0 bg-neutral-300 rounded-md"
            title="autoplay"
          >
            <span
              className={`cursor-pointer absolute -top-1 transition-transform duration-300 ${
                playerState.autoPlay ? "translate-x-full" : "translate-x-0"
              }`}
            >
              {playerState.autoPlay ? (
                <PlayIcon className="w-5 h-5 p-1 rounded-full bg-action" />
              ) : (
                <PauseIcon className="w-5 h-5 p-1 rounded-full bg-action" />
              )}
            </span>
          </span>
        </label>
      </div>
      <div className="upnext-songs overflow-y-scroll ">
        {!isLoading ? (
          suggestedSongsData?.success ? (
            suggestedSongsData?.data?.map((song, index) => (
              <div
                key={song.id}
                className="relative flex items-center gap-4 p-2 cursor-pointer rounded-md hover:bg-secondary"
                onClick={() => handleUpdateState(song)}
              >
                <ImageWithFallback
                  src={
                    song.image.find((item) => item.quality === "500x500")
                      ?.url ?? "/logo-circle.svg"
                  }
                  id={song.id}
                  alt={song.name + "okv tunes"}
                  width={50}
                  height={50}
                  className="w-[50px] h-[50px] object-cover rounded-md"
                />
                {currentSong.id === song.id ? (
                  <PlayIcon className="absolute left-6 w-5 h-5 p-1 rounded-full bg-action animate-spin" />
                ) : null}
                <p className="truncate w-80">
                  {song.name.replaceAll("&quot;", '"')}
                </p>
                <small className="text-neutral-400">
                  {secondsToTime(song.duration)}
                </small>
              </div>
            ))
          ) : (
            <p>No suggestions found for the this song</p>
          )
        ) : (
          <Loading loadingText="loading" />
        )}
      </div>
    </div>
  );
};

export default SuggestedSongs;
