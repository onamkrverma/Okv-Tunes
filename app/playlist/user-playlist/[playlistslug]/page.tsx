"use client";
import { useGlobalContext } from "@/app/GlobalContex";
import ImageWithFallback from "@/components/ImageWithFallback";
import Loading from "@/components/Loading";
import SongsCollection from "@/components/SongsCollection";
import RefreshIcon from "@/public/icons/refresh.svg";
import { getSongs, getUserPlaylist, getUserPublicPlaylist } from "@/utils/api";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

type Props = {
  params: { playlistslug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const UserPlaylistSongs = ({ params, searchParams }: Props) => {
  const id = params.playlistslug.split("-").pop() as string;
  const type = searchParams["type"];
  const title = params.playlistslug.split("-").slice(0, -1).join(" ");
  const { authToken } = useGlobalContext();

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    document.title = `User ${type} playlist • Okv-Tunes"`;
  }, []);

  const userPlaylistFetcher = () =>
    authToken
      ? type === "public"
        ? getUserPublicPlaylist({ authToken, playlistId: id })
        : getUserPlaylist({ authToken, playlistId: id })
      : null;
  const { data: userPlaylist } = useSWR(
    authToken ? `/user-playlist?id=${id}` : null,
    userPlaylistFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const playlistSongsFetcher = () =>
    userPlaylist ? getSongs({ id: userPlaylist.songIds }) : null;
  const { data: playlistSongs, isLoading } = useSWR(
    userPlaylist ? "/playlist-songs" : null,
    playlistSongsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const hanldeRefresh = async () => {
    setIsRefreshing(true);
    await mutate("/user-playlist");
    await mutate("/playlist-songs");
    setIsRefreshing(false);
  };

  return (
    <div className="inner-container flex flex-col gap-6">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={playlistSongs?.data[0].id}
            src={
              playlistSongs?.data[0].image.find(
                (item) => item.quality === "500x500"
              )?.url ?? "/logo-circle.svg"
            }
            alt={playlistSongs?.data[0].name + "-okv tunes"}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-md shadow-lg shadow-neutral-700"
          />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            {title}
          </h1>
          <div className="flex flex-col gap-1 items-center sm:items-start">
            <small className="text-neutral-300 text-center sm:text-start capitalize">
              Visibility: {userPlaylist?.visibility}
            </small>
            <small className="text-neutral-300 text-center sm:text-start capitalize">
              Playlist Created By: {userPlaylist?.createdBy}
            </small>
            <span className="uppercase bg-action text-primary rounded-full flex justify-center items-center h-8 w-8 text-center font-bold">
              {userPlaylist?.createdBy.at(0) ?? "G"}
            </span>
          </div>
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
        {!isLoading && userPlaylist ? (
          userPlaylist.songIds.length > 0 ? (
            playlistSongs?.data.map((song) => (
              <SongsCollection
                key={song.id}
                song={song}
                playlistId={userPlaylist._id}
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
