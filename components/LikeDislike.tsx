"use client";
import React, { MouseEvent, useEffect, useState } from "react";
import HeartIcon from "@/public/icons/heart.svg";
import { getLikedSongs, likeDislikeSong } from "@/utils/api";
import useSWR, { mutate } from "swr";
import { useGlobalContext } from "@/app/GlobalContex";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  songId: string;
};
const LikeDislike = ({ songId }: Props) => {
  const { session, likedSongsIds, setGlobalState } = useGlobalContext();
  const userId = session?.user?.id;
  const isLiked = likedSongsIds.some((item) => item === songId);

  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);

  const handleLiked = async (event: MouseEvent<HTMLSpanElement>) => {
    setIsLoading(true);
    event.stopPropagation();
    if (!userId) {
      return router.push(`/login?next=${pathname}`);
    }
    const res = await likeDislikeSong(userId, songId);
    setGlobalState((prev) => ({
      ...prev,
      likedSongsIds: res.likedSongIds,
    }));
    setIsLoading(false);
  };

  return (
    <span role="button" title="like/dislike" onClick={handleLiked}>
      <HeartIcon
        className={`w-6 h-6 fill-none transition-transform ${
          isLoading ? "animate-ping" : ""
        } ${isLiked ? "!fill-action stroke-action" : ""} `}
      />
    </span>
  );
};

export default LikeDislike;
