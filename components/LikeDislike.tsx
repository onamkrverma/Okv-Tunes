"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import HeartIcon from "@/public/icons/heart.svg";
import { likeDislikeSong } from "@/utils/api";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";

type Props = {
  songId: string;
};
const LikeDislike = ({ songId }: Props) => {
  const { likedSongsIds, setGlobalState, authToken } = useGlobalContext();
  const isLiked = likedSongsIds.some((item) => item === songId);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLiked = async (event: MouseEvent<HTMLSpanElement>) => {
    setIsLoading(true);
    event.stopPropagation();
    if (!authToken) {
      return router.push("/login");
    }
    const res = await likeDislikeSong({ authToken, songId });
    if (!res) return;
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
