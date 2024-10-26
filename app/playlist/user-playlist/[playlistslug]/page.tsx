"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import ImageWithFallback from "@/components/ImageWithFallback";
import Loading from "@/components/Loading";
import PlayAllSongs from "@/components/PlayAllSongs";
import SongsCollection from "@/components/SongsCollection";
import RefreshIcon from "@/public/icons/refresh.svg";
import {
  deleteUserPlaylistSongs,
  getSongs,
  getUserPlaylist,
  getUserPublicPlaylist,
} from "@/utils/api";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import ThreeDotsIcon from "@/public/icons/three-dots.svg";
import DeleteIcon from "@/public/icons/delete.svg";
import { useRouter } from "next/navigation";

type Props = {
  params: { playlistslug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const UserPlaylistSongs = ({ params, searchParams }: Props) => {
  const id = params.playlistslug.split("-").pop() as string;
  const type = searchParams["type"];
  const title = params.playlistslug.split("-").slice(0, -1).join(" ");
  const { session, alertMessage, setGlobalState } = useGlobalContext();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMoreBtnClick, setIsMoreBtnClick] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.title = `User ${type} playlist • Okv-Tunes"`;
  }, []);

  const userId = session?.user?.id ?? "";

  const userPlaylistFetcher = () =>
    session
      ? type === "public"
        ? getUserPublicPlaylist({ userId, playlistId: id })
        : getUserPlaylist({ userId, playlistId: id })
      : null;
  const { data: userPlaylist } = useSWR(
    session ? `/user-playlist?id=${id}` : null,
    userPlaylistFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const playlistSongsFetcher = () =>
    userPlaylist && userPlaylist?.songIds.length > 0
      ? getSongs({ id: userPlaylist.songIds })
      : null;
  const { data: playlistSongs, isLoading } = useSWR(
    userPlaylist ? `/playlist-songs?id=${id}` : null,
    playlistSongsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const hanldeRefresh = async () => {
    setIsRefreshing(true);
    await mutate(`/user-playlist?id=${id}`);
    await mutate(`/playlist-songs?id=${id}`);
    setIsRefreshing(false);
  };

  const handleDeletePlaylist = async () => {
    try {
      if (!session || !id) return;
      const userId = session?.user?.id ?? "";

      const res = await deleteUserPlaylistSongs({
        userId,
        playlistId: id,
        isFullDeletePlaylist: true,
      });
      setGlobalState((prev) => ({
        ...prev,
        alertMessage: {
          isAlertVisible: true,
          message: res?.message ?? "Success",
        },
      }));
      setIsMoreBtnClick(false);
      router.replace("/profile");
    } catch (error) {
      if (error instanceof Error)
        setGlobalState((prev) => ({
          ...prev,
          alertMessage: { isAlertVisible: true, message: error.message },
        }));
    }
  };

  return (
    <div className="inner-container flex flex-col gap-6 relative">
      <div className="flex justify-end items-center absolute right-4">
        <button
          type="button"
          title="more"
          className=""
          onClick={(e) => {
            e.stopPropagation();
            setIsMoreBtnClick(!isMoreBtnClick);
          }}
        >
          <ThreeDotsIcon className="w-6 h-6" />
        </button>

        <div
          className={`absolute top-4 right-6 bg-neutral-800 border flex-col gap-2 p-2 rounded-md z-[5] hover:bg-secondary ${
            isMoreBtnClick ? "flex" : "hidden"
          } `}
        >
          <button
            type="button"
            className="flex items-center gap-1 text-xs w-28"
            onClick={handleDeletePlaylist}
          >
            <DeleteIcon className="w-4 h-4" />
            Delete playlist
          </button>
        </div>
      </div>
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={
              playlistSongs?.data && playlistSongs?.data.length > 0
                ? playlistSongs.data[0].id
                : id
            }
            src={
              playlistSongs?.data && playlistSongs?.data.length > 0
                ? playlistSongs?.data[0].image.find(
                    (item) => item.quality === "500x500"
                  )?.url
                : "/logo-circle.svg"
            }
            alt={
              playlistSongs?.data && playlistSongs?.data.length > 0
                ? playlistSongs?.data[0].name
                : "poster" + "-okv tunes"
            }
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-md shadow-lg shadow-neutral-700"
          />
        </div>
        <div className="flex flex-col gap-2 items-center sm:items-start w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            {title}
          </h1>
          <div className="flex flex-col gap-1 items-center sm:items-start">
            <small className="text-neutral-300 text-center sm:text-start capitalize">
              Visibility: {userPlaylist?.visibility}
            </small>
            <small className="text-neutral-300 text-center sm:text-start capitalize flex items-center gap-2">
              <span className="uppercase bg-neutral-800 border text-primary rounded-full flex justify-center items-center h-8 w-8 text-center font-bold">
                {userPlaylist?.createdBy?.at(0) ?? "G"}
              </span>
              Playlist Created By: {userPlaylist?.createdBy}
            </small>
          </div>
          {playlistSongs?.data && playlistSongs?.data.length > 0 ? (
            <PlayAllSongs
              firstSong={playlistSongs?.data[0]}
              suggessionSongIds={playlistSongs?.data
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
            className="flex items-center justify-center gap-2 text-xs border bg-neutral-800 hover:bg-secondary rounded-md p-1 px-2"
          >
            <RefreshIcon
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>
        {!isLoading && userPlaylist ? (
          playlistSongs && playlistSongs?.data?.length > 0 ? (
            playlistSongs?.data.map((song, index) => (
              <SongsCollection
                key={song.id}
                song={song}
                playlistId={userPlaylist._id}
                index={index}
              />
            ))
          ) : (
            <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
              <p className="text-lg font-bold">
                No song found in this playlist
              </p>
              <small className="text-neutral-400">
                User saved playlist songs will be displayed here. If this is
                your playlist, please add songs to see them appear.
              </small>
            </div>
          )
        ) : (
          <Loading loadingText="Loading" />
        )}
      </div>
    </div>
  );
};

export default UserPlaylistSongs;
