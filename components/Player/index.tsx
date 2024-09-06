"use client";
import secondsToTime from "@/utils/secondsToTime";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PlayerControls from "./PlayerControls";
import { useGlobalContext } from "@/app/GlobalContex";

const Plalyer = () => {
  const { currentSong } = useGlobalContext();
  // const [isMaximise, setIsMaximise] = useState(true);
  const { id, imageUrl, title, isMaximise } = currentSong;

  useEffect(() => {
    document.body.style.overflow = isMaximise ? "hidden" : "auto";
  }, [isMaximise]);

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
                className="w-[350px] h-[350px] object-cover rounded-lg"
              />
            </div>
            {/* upcomming tracks */}
            <div className="flex flex-col gap-2 w-full max-w-sm h-[400px] rounded-md p-2">
              <h2 className="font-bold text-xl border-b underline decoration-wavy underline-offset-4 py-2 ">
                Up Next
              </h2>
              <div className="upnext-songs overflow-y-scroll ">
                {Array(20)
                  .fill(0)
                  .map((song, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-2 cursor-pointer hover:bg-secondary"
                    >
                      <Image
                        src={
                          "https://c.saavncdn.com/373/Stree-2-Hindi-2024-20240828083834-500x500.jpg"
                        }
                        alt={"name" + "okv tunes"}
                        width={50}
                        height={50}
                        priority
                        className="w-[50px] h-[50px] object-cover rounded-md"
                      />
                      <p className="truncate w-80">
                        {/* {song.name.replaceAll("&quot;", '"')} */}
                        songs Name{" "}
                      </p>
                      <small className="text-neutral-400">
                        {/* {'secondsToTime(song.duration)'} */}
                        02:00
                      </small>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <PlayerControls />
        </>
      ) : null}
    </div>
  );
};

export default Plalyer;
