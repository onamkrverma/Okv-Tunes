"use client";
import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Loading from "../Loading";
import type { TSong } from "@/utils/api.d";
import CaretUpIcon from "@/public/icons/caret-up.svg";
import PlayIcon from "@/public/icons/play.svg";
import PauseIcon from "@/public/icons/pause.svg";
import { TplayerState } from "./index";
import SuggestedSongCard from "./SuggestedSongCard";
import { useGlobalContext } from "@/app/GlobalContex";
import { getSongs } from "@/utils/api";
import useSWR from "swr";

type Props = {
  suggestedSongs: TSong[];
  setSuggestedSongs: Dispatch<SetStateAction<TSong[]>>;
  isLoading: boolean;
  playerState: TplayerState;
  setPlayerState: Dispatch<SetStateAction<TplayerState>>;
  error?: { message: string };
};

const SuggestedSongs = ({
  suggestedSongs,
  setSuggestedSongs,
  isLoading,
  playerState,
  setPlayerState,
  error,
}: Props) => {
  const { currentSong } = useGlobalContext();
  const { playNextSongId, addToQueueSongId, id } = currentSong;

  const [isUpnextClick, setIsUpnextClick] = useState(false);
  const suggestedSongsRef = useRef<HTMLDivElement>(null);

  const playNextDataFetcher = () =>
    playNextSongId ? getSongs({ id: playNextSongId }) : null;
  const addToQueueDataFetcher = () =>
    addToQueueSongId ? getSongs({ id: addToQueueSongId }) : null;

  const { data: fetchedPlayNextData } = useSWR(
    playNextSongId ? `/play-next-songs?id=${playNextSongId}` : null,
    playNextDataFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: fetchedQueueData } = useSWR(
    addToQueueSongId ? `/add-to-queue?id=${addToQueueSongId}` : null,
    addToQueueDataFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  useEffect(() => {
    if (fetchedPlayNextData?.data || fetchedQueueData?.data) {
      const fetchedData = [
        ...(fetchedPlayNextData?.data ?? []),
        ...(fetchedQueueData?.data ?? []),
      ];
      const fetchedSongIds = new Set(fetchedData.map((song) => song.id));

      const nonDuplicateSongs = suggestedSongs.filter(
        (item) => !fetchedSongIds.has(item.id)
      );
      const currentSongIndex = suggestedSongs.findIndex(
        (item) => item.id === id
      );

      const allSuggestionSongs = playNextSongId
        ? [
            ...nonDuplicateSongs.slice(0, currentSongIndex + 1),
            ...fetchedData,
            ...nonDuplicateSongs.slice(currentSongIndex + 1),
          ]
        : [...nonDuplicateSongs, ...fetchedData];
      setSuggestedSongs(allSuggestionSongs);
    }
  }, [fetchedPlayNextData, fetchedQueueData, playNextSongId, addToQueueSongId]);

  const handleSongRemoval = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    const updatedList = suggestedSongs.filter((item) => item.id !== id);
    setSuggestedSongs(updatedList);
  };

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    setSuggestedSongs((prev) => {
      const updatedList = [...prev];
      const [movedSong] = updatedList.splice(dragIndex, 1);
      updatedList.splice(hoverIndex, 0, movedSong);
      return updatedList;
    });
  }, []);

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
      className={`flex sm:translate-x-0 flex-col gap-2 w-full max-w-[90%] sm:max-w-sm h-1/2 sm:h-[400px] rounded-md p-2 sm:bg-secondary/70 bg-secondary absolute sm:static transition-transform duration-500 ${
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
            disabled={suggestedSongs.length === 0}
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
          error && !suggestedSongs.length ? (
            <div className="flex items-center justify-center">
              <p>{JSON.parse(error.message).error}</p>
            </div>
          ) : (
            suggestedSongs.map((song, index) => (
              <SuggestedSongCard
                key={song.id}
                index={index}
                song={song}
                moveRow={moveRow}
                handleSongRemoval={handleSongRemoval}
              />
            ))
          )
        ) : (
          <Loading loadingText="loading" />
        )}
      </div>
    </div>
  );
};

export default SuggestedSongs;
