"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import HeartIcon from "@/public/icons/heart.svg";
import { getLikedSongs, likeDislikeSong } from "@/utils/api";
import useSWR, { mutate } from "swr";
import { useGlobalContext } from "@/app/GlobalContex";

type Props = {
  songId: string;
};
const LikeDislike = ({ songId }: Props) => {
  const { session, likedSongsIds, setGlobalState } = useGlobalContext();
  const userId = session?.user?.id;
  const isLiked = likedSongsIds.some((item) => item === songId);

  const handleLiked = async (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (!userId) return;
    const res = await likeDislikeSong(userId, songId);
    setGlobalState((prev) => ({
      ...prev,
      likedSongsIds: res.likedSongs,
    }));
  };

  return (
    <span role="button" title="like/dislike" onClick={handleLiked}>
      <HeartIcon
        className={`w-6 h-6 fill-none ${
          isLiked ? "!fill-action stroke-action" : ""
        }`}
      />
    </span>
  );
};

export default LikeDislike;
