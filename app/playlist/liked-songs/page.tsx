"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import ImageWithFallback from "@/components/ImageWithFallback";
import Loading from "@/components/Loading";
import PlayAllSongs from "@/components/PlayAllSongs";
import SongsCollection from "@/components/SongsCollection";
import RefreshIcon from "@/public/icons/refresh.svg";
import { getLikedSongs, getSongs } from "@/utils/api";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const LikedSongs = () => {
  const { session } = useGlobalContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    document.title = "Liked Songs • Okv-Tunes";
  }, []);
  const userId = session?.user?.id ?? "";
  const likedSongsIdsFetcher = () =>
    session ? getLikedSongs({ userId }) : null;
  const { data: likedSongsIds } = useSWR(
    session ? "/liked-id" : null,
    likedSongsIdsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const likedSongsFetcher = () =>
    likedSongsIds ? getSongs({ id: likedSongsIds }) : null;
  const { data: likedSongs, isLoading } = useSWR(
    likedSongsIds?.length ? "/liked-songs" : null,
    likedSongsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const hanldeRefresh = async () => {
    setIsRefreshing(true);
    await mutate("/liked-id");
    await mutate("/liked-songs");
    setIsRefreshing(false);
  };

  return (
    <div className="inner-container flex flex-col gap-6">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={likedSongs?.data?.[0].id}
            src={
              likedSongs?.data?.[0].image.find(
                (item) => item.quality === "500x500"
              )?.url ?? "/logo-circle.svg"
            }
            alt={likedSongs?.data?.[0].name + "-okv tunes"}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-md shadow-lg shadow-neutral-700"
          />
        </div>
        <div className="flex flex-col gap-2 items-center sm:items-start w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            Liked Songs
          </h1>
          <small className="text-neutral-300 text-center sm:text-start">
            List of your liked songs
          </small>
          {likedSongs ? (
            <PlayAllSongs
              firstSong={likedSongs?.data[0]}
              suggessionSongIds={likedSongs?.data
                .slice(1, 16)
                .map((item) => item.id)}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        <div className="flex justify-end items-center">
          <button
            type="button"
            onClick={hanldeRefresh}
            className="flex items-center justify-center gap-2 border bg-neutral-800 hover:bg-secondary rounded-md p-1 px-2"
          >
            <RefreshIcon
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
        {!isLoading && likedSongsIds ? (
          likedSongsIds.length > 0 ? (
            likedSongs?.data?.map((song, index) => (
              <SongsCollection key={song.id} song={song} index={index} />
            ))
          ) : (
            <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
              <p className="text-lg font-bold">Liked Song Not Found</p>
              <p className="text-neutral-400 text-sm">
                Your liked songs will be displayed here. Please like any songs
                to see them appear.
              </p>
            </div>
          )
        ) : (
          <Loading loadingText="Loading" />
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
