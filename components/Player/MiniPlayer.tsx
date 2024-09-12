"use client";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import PlayIcon from "@/public/icons/play.svg";
import PauseIcon from "@/public/icons/pause.svg";
import NextIcon from "@/public/icons/next.svg";
import PrevIcon from "@/public/icons/previous.svg";
import SpeakerIcon from "@/public/icons/speaker.svg";
import MuteSpeakerIcon from "@/public/icons/mute-speaker.svg";
import CaretUpIcon from "@/public/icons/caret-up.svg";
import Image from "next/image";
import ReactPlayer from "react-player";
import { useGlobalContext } from "@/app/GlobalContex";
import secondsToTime from "@/utils/secondsToTime";
import { TplayerState } from "./index";

type Props = {
  handlePrev: () => void;
  handleNext: () => void;
  playerRef: RefObject<ReactPlayer>;
  playerState: TplayerState;
  setPlayerState: Dispatch<SetStateAction<TplayerState>>;
};

const MiniPlayer = ({
  playerRef,
  playerState,
  setPlayerState,
  handleNext,
  handlePrev,
}: Props) => {
  const { currentSong, setGlobalState } = useGlobalContext();
  const { artist, audioUrl, id, imageUrl, title, isMaximise } = currentSong;

  const [seekTime, setSeekTime] = useState(0);
  const [bufferedAmount, setBufferedAmount] = useState(0);
  const duration = playerRef?.current?.getDuration();

  const currentTime = duration ? playerState?.played * duration : 0;

  useEffect(() => {
    playerRef.current?.seekTo(seekTime);
    // eslint-disable-next-line
  }, [seekTime]);

  // get audio buffered end amount
  useEffect(() => {
    const bufferedAmount = Math.floor(playerState.loaded * 100);
    setBufferedAmount(bufferedAmount);
  }, [playerState.loaded]);

  return (
    <div
      className={`fixed left-0 bottom-16 sm:bottom-0 w-full sm:h-16 sm:bg-secondary z-20 ${
        isMaximise ? "h-40 pb-4" : "h-16 bg-secondary "
      }`}
    >
      <div
        className={`flex justify-between sm:flex-row items-center px-4 relative ${
          isMaximise ? "flex-col gap-1" : "flex-row"
        }`}
      >
        <div
          className={`w-full sm:absolute top-0 left-0 ${
            isMaximise ? "static " : "absolute"
          }`}
        >
          <input
            type="range"
            title="seekbar"
            step="any"
            value={currentTime || 0}
            min={0}
            max={duration || 0}
            onChange={(e) => setSeekTime(e.currentTarget.valueAsNumber)}
            //  style={{
            //    "--buffered-width": `${bufferedAmount}%`,
            //  }}
            className={`sm:absolute  sm:h-0.5 w-full accent-action cursor-pointer ${
              isMaximise ? "static h-1" : "absolute h-0.5"
            }`}
          />
          <div
            className={`sm:hidden justify-between items-center ${
              isMaximise ? "flex" : "hidden"
            }`}
          >
            <small className="text-neutral-200">
              {secondsToTime(currentTime)}
            </small>
            <small className="text-neutral-200">
              {secondsToTime(duration ?? 0)}
            </small>
          </div>
        </div>
        <div
          className={`sm:flex items-center gap-4 p-2 cursor-pointer ${
            isMaximise ? "hidden" : "flex"
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
          <Image
            src={imageUrl}
            alt={title + "okv tunes"}
            width={50}
            height={50}
            priority
            className="w-[50px] h-[50px] object-cover rounded-md"
          />
          <div className="flex flex-col w-full max-w-40">
            <p className="truncate">{title?.replaceAll("&quot;", '"')}</p>
            <small className="truncate text-neutral-400">{artist}</small>
          </div>
        </div>
        {/* controls */}
        <div className="flex gap-6 items-center justify-center">
          <button
            type="button"
            title="prev"
            onClick={handlePrev}
            className={`sm:block ${isMaximise ? "block" : "hidden "}`}
          >
            <PrevIcon
              className={`sm:w-6 sm:h-6 ${isMaximise ? "w-8 h-8" : "w-6 h-6"}`}
            />
          </button>
          <button
            type="button"
            title="play/pause"
            className=""
            onClick={() =>
              setPlayerState({ ...playerState, playing: !playerState.playing })
            }
          >
            {!playerState.playing ? (
              <PlayIcon
                className={`sm:w-10 sm:h-10 ${
                  isMaximise ? "w-14 h-14" : "w-10 h-10"
                }`}
              />
            ) : (
              <PauseIcon
                className={`sm:w-10 sm:h-10 ${
                  isMaximise ? "w-14 h-14" : "w-10 h-10"
                }`}
              />
            )}
          </button>

          <button
            type="button"
            title="next"
            onClick={handleNext}
            className={`sm:block ${isMaximise ? "block " : "hidden "}`}
          >
            <NextIcon
              className={`sm:w-6 sm:h-6 ${isMaximise ? "w-8 h-8" : "w-6 h-6"}`}
            />
          </button>
        </div>

        <div
          className={`sm:flex gap-4 items-center sm:justify-end sm:w-fit ${
            isMaximise ? "flex justify-between w-full" : "hidden "
          }`}
        >
          <small className="text-neutral-200 w-24 text-center hidden sm:block">
            {secondsToTime(currentTime)} / {secondsToTime(duration ?? 0)}
          </small>
          <div className={`flex gap-2 items-center justify-center w-24 `}>
            <button type="button" title="mute" className="">
              <SpeakerIcon className="w-6 h-6" />
            </button>
            <input
              type="range"
              title="volume"
              className="w-full h-1 accent-action cursor-pointer"
              step={0.01}
              min={0.0}
              max={1.0}
              value={playerState.volume}
              onChange={(e) => {
                setPlayerState({
                  ...playerState,
                  volume: e.currentTarget.valueAsNumber,
                });
              }}
            />
          </div>
          <button
            type="button"
            title={isMaximise ? "minimise" : "maximise"}
            className={`hidden sm:block transition-transform ${
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
            <CaretUpIcon className={`w-4 h-4 sm:w-6 sm:h-6 `} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
