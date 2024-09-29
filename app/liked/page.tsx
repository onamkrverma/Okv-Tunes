"use client";
import SongsCollection from "@/components/SongsCollection";
import { getPlaylists, getSongs } from "@/utils/api";
import useSWR from "swr";
import { useGlobalContext } from "@/app/GlobalContex";
import Loading from "@/components/Loading";
import HeartIcon from "@/public/icons/heart.svg";

const PlaylistSongs = () => {
  const { likedSongs } = useGlobalContext();

  const dataFetcher = () => getSongs({ id: likedSongs });
  const { data: likedSongsRes, isLoading } = useSWR(
    likedSongs.length ? "/liked-songs" : null,
    dataFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return (
    <div className="inner-container flex flex-col gap-6">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px] bg-secondary/50 shadow-md flex items-center justify-center rounded-md">
          <HeartIcon className="w-10/12 h-10/12 fill-action stroke-action" />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            Favourite Songs
          </h1>
          <small className="text-neutral-300 text-center sm:text-start">
            List of your like songs
          </small>
        </div>
      </div>
      <div className="flex flex-col gap-4 my-4">
        {likedSongs.length > 0 ? (
          !isLoading ? (
            likedSongsRes?.data.map((song) => (
              <SongsCollection key={song.id} song={song} />
            ))
          ) : (
            <Loading loadingText="Loading" />
          )
        ) : (
          <div className="text-center">
            <p className="text-lg font-bold">Liked Song Not Found</p>
            <p className="text-neutral-400 text-sm">
              Your liked songs will be displayed here. Please like any songs to
              see them appear.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistSongs;
