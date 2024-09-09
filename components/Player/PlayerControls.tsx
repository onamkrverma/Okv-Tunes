"use client";
import React, {
  Dispatch,
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

const PlayerControls = () => {
  const { currentSong, setGlobalState } = useGlobalContext();
  const { artist, audioUrl, id, imageUrl, title, isMaximise } = currentSong;

  const [playerState, setPlayerState] = useState({
    url: audioUrl,
    playing: false,
    controls: false,
    // volume: parseFloat(localVolume) ?? 1.0,
    volume: 0.1,
    muted: false,
    played: 0,
    loaded: 0,
  });
  const playerRef = useRef<ReactPlayer>(null);

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
    <div className="fixed left-0 bottom-16 sm:bottom-0 w-full h-16 bg-secondary">
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
      <div className="grid grid-cols-2 sm:grid-cols-3 items-center px-4 relative">
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
          className="absolute top-0 left-0 w-full h-[2px] accent-action cursor-pointer"
        />
        <div
          className="flex items-center gap-4 p-2 cursor-pointer"
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
          <div className="flex flex-col w-full">
            <p className="truncate">{title?.replaceAll("&quot;", '"')}</p>
            <small className="truncate text-neutral-400">{artist}</small>
          </div>
        </div>
        {/* controls */}
        <div className="flex gap-6 items-center justify-end sm:justify-center">
          <button type="button" title="prev">
            <PrevIcon className="w-6 h-6" />
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
              <PlayIcon className="w-10 h-10" />
            ) : (
              <PauseIcon className="w-10 h-10" />
            )}
          </button>
          <button type="button" title="next">
            <NextIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="hidden sm:flex gap-4 items-center justify-end">
          <small className="text-neutral-200">
            {secondsToTime(currentTime)} / {secondsToTime(duration ?? 0)}
          </small>
          <div className="flex gap-2 items-center justify-center w-24">
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
              onChange={(e) =>
                setPlayerState({
                  ...playerState,
                  volume: e.currentTarget.valueAsNumber,
                })
              }
            />
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
