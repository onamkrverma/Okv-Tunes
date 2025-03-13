"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import BackButton from "@/components/BackButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import Loading from "@/components/Loading";
import PlayAllSongs from "@/components/PlayAllSongs";
import SongsCollection from "@/components/SongsCollection";
import RefreshIcon from "@/public/icons/refresh.svg";
import ReorderIcon from "@/public/icons/reorder.svg";
import { TSong } from "@/utils/api.d";
import { getLikedSongs, getSongs, updateLikedSongs } from "@/utils/api";
import { useCallback, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const LikedSongs = () => {
  const { session, authToken } = useGlobalContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [likedSongData, setlikedSongData] = useState<TSong[]>([]);
  const [isReordering, setIsRerodering] = useState(false);

  useEffect(() => {
    document.title = "Liked Songs • Okv-Tunes";
  }, []);
  const userId = session?.user?.id ?? "";

  const likedSongsIdsFetcher = () =>
    authToken ? getLikedSongs({ userId, authToken }) : null;
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
    if (!isReordering) {
      await mutate("/liked-songs");
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (likedSongs?.success) {
      setlikedSongData(likedSongs.data);
    }
  }, [likedSongs]);

  const handleUpdateList = async () => {
    if (!authToken) return;
    const songIds = likedSongData.map((item) => item.id);
    await updateLikedSongs({
      userId,
      authToken,
      songId: songIds,
    });
    await hanldeRefresh();
  };

  const moveRow = useCallback((dragIndex: number, hoverIndex: number) => {
    setlikedSongData((prev) => {
      const updatedList = [...prev];
      const [movedSong] = updatedList.splice(dragIndex, 1);
      updatedList.splice(hoverIndex, 0, movedSong);
      return updatedList;
    });
  }, []);

  return (
    <div className="inner-container flex flex-col gap-6">
      <BackButton />
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
            className="w-full h-full object-cover rounded-md "
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
              suggestionSongIds={likedSongs?.data
                .slice(1, 16)
                .map((item) => item.id)}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        <div className="flex justify-end items-center gap-2">
          <button
            type="button"
            onClick={() => setIsRerodering(!isReordering)}
            className="flex items-center justify-center gap-2 text-xs border bg-neutral-800 hover:bg-secondary rounded-md p-1 px-2"
          >
            <ReorderIcon
              className={`w-4 h-4 transition-colors ${
                isReordering ? "text-[#00ff0a]" : ""
              }`}
            />
            Reorder
          </button>
          <button
            type="button"
            onClick={!isReordering ? hanldeRefresh : handleUpdateList}
            className="flex items-center justify-center gap-2 text-xs border bg-neutral-800 hover:bg-secondary rounded-md p-1 px-2"
          >
            <RefreshIcon
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {!isReordering ? "Refresh" : "Update"}
          </button>
        </div>
        <DndProvider backend={HTML5Backend}>
          {!isLoading && likedSongsIds ? (
            likedSongsIds.length > 0 ? (
              likedSongData?.map((song, index) => (
                <SongsCollection
                  key={song.id}
                  song={song}
                  index={index}
                  moveRow={moveRow}
                  isReordering={isReordering}
                />
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
        </DndProvider>
      </div>
    </div>
  );
};

export default LikedSongs;
