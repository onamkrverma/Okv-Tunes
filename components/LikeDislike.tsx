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
  const { session } = useGlobalContext();
  const userId = session?.user?.id;
  const [isLiked, setIsLiked] = useState(false);

  const dataFetcher = async () => {
    const res = await getLikedSongs({ id: userId });
    const isLikedSongId = res.some((item) => item === songId);
    setIsLiked(isLikedSongId);
  };

  useEffect(() => {
    if (!userId) return;
    dataFetcher();
  }, [songId, userId]);

  const handleLiked = async (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (!userId) return;
    await likeDislikeSong(userId, songId);
    dataFetcher();
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
