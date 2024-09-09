"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import PlayerControls from "./PlayerControls";
import { useGlobalContext } from "@/app/GlobalContex";
import SuggestedSongs from "./SuggestedSongs";

const Plalyer = () => {
  const { currentSong } = useGlobalContext();
  const { id, imageUrl, title, isMaximise } = currentSong;

  currentSong.id
    ? localStorage.setItem("currentSong", JSON.stringify(currentSong))
    : null;

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
            <SuggestedSongs songId={id} />
          </div>
          <PlayerControls />
        </>
      ) : null}
    </div>
  );
};

export default Plalyer;
