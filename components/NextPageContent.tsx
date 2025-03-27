"use client";
import { getArtist, getPlaylists } from "@/utils/api";
import { TSong } from "@/utils/api.d";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Loading from "./Loading";
import SongsCollection from "./SongsCollection";

type Props = {
  id?: string;
  type: "playlist" | "artist" | "search";
};

const NextPageContent = ({ id, type }: Props) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [SongsData, setSongsData] = useState<TSong[]>([]);

  const playlistFetcher = () => getPlaylists({ id: id, page: page, limit: 20 });

  const artistFetcher = () => getArtist({ id: id, page: page, limit: 20 });

  const { data: playlistData, isLoading } = useSWR(
    id && page > 1 && type == "playlist"
      ? `/playlist?id=${id}&page=${page}`
      : null,
    playlistFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: artistData, isLoading: artistLoading } = useSWR(
    id && page > 1 && type == "artist" ? `/artist?id=${id}&page=${page}` : null,
    artistFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  useEffect(() => {
    if (playlistData?.data) {
      setSongsData([...SongsData, ...playlistData.data.songs]);
    }
    if (artistData?.data) {
      setSongsData([...SongsData, ...artistData.data.topSongs]);
    }
  }, [playlistData, artistData]);

  return (
    <div className="flex flex-col gap-4 mb-4">
      {!isLoading || !artistLoading ? (
        SongsData.length > 0 ? (
          SongsData.map((song, index) => (
            <SongsCollection
              key={song.id}
              song={song}
              index={index + 20}
              isReordering={false}
            />
          ))
        ) : null
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default NextPageContent;
