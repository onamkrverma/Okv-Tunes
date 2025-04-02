"use client";
import { getArtist, getPlaylists, getSearchSongs } from "@/utils/api";
import { TSong } from "@/utils/api.d";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import useSWR from "swr";
import Loading from "./Loading";
import SongsCollection from "./SongsCollection";

type Props = {
  id?: string;
  query?: string;
  count: number;
  type: "playlist" | "artist" | "search";
};

const PageContent = ({ id, type, count, query }: Props) => {
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") ?? "1");
  const [songsData, setSongsData] = useState<TSong[]>([]);

  const playlistFetcher = () => getPlaylists({ id: id, page: page, limit: 20 });

  const artistFetcher = () => getArtist({ id: id, page: page, limit: 20 });

  const searchSongsFetcher = () =>
    getSearchSongs({ query: query, limit: 20, page: page });

  const { data: playlistData, isLoading: playlistLoading } = useSWR(
    id && page > 1 && type === "playlist"
      ? `/playlist?id=${id}&page=${page}`
      : null,
    playlistFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const { data: artistData, isLoading: artistLoading } = useSWR(
    id && page > 1 && type === "artist"
      ? `/artist?id=${id}&page=${page}`
      : null,
    artistFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: searchSongsData, isLoading: songsLoading } = useSWR(
    query && page > 1 && type === "search"
      ? `/next-page-songs?query=${query}&page=${page}`
      : null,
    searchSongsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  useEffect(() => {
    if (playlistData?.data) {
      return setSongsData((prev) => [...prev, ...playlistData.data.songs]);
    }
    if (artistData?.data) {
      return setSongsData((prev) => [...prev, ...artistData.data.topSongs]);
    }
    if (searchSongsData?.data) {
      return setSongsData((prev) => [...prev, ...searchSongsData.data.results]);
    }
  }, [playlistData, artistData, searchSongsData]);

  useEffect(() => {
    setSongsData([]);
  }, [query]);

  const isLoading = playlistLoading || artistLoading || songsLoading;
  return (
    <div className="flex flex-col gap-4 mb-4">
      {songsData.length > 0
        ? songsData.map((song, index) => (
            <SongsCollection
              key={song.id}
              song={song}
              index={index + count}
              isReordering={false}
            />
          ))
        : null}

      {isLoading ? <Loading /> : null}
    </div>
  );
};

const NextPageContent = ({ id, type, count, query }: Props) => {
  return (
    <Suspense fallback={<Loading loadingText="Loading" />}>
      <PageContent id={id} type={type} count={count} query={query} />
    </Suspense>
  );
};

export default NextPageContent;
