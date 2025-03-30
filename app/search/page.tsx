"use client";
import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import InfinitScroll from "@/components/InfinitScroll";
import Loading from "@/components/Loading";
import NextPageContent from "@/components/NextPageContent";
import SongsCollection from "@/components/SongsCollection";
import Toggle from "@/components/Toggle";
import {
  getSearchAlbums,
  getSearchArtists,
  getSearchPlaylists,
  getSearchSongs,
} from "@/utils/api";
import { Suspense, use, useEffect, useState } from "react";
import useSWR from "swr";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

const SearchComponent = ({ searchParams }: Props) => {
  const searchParamsRes = use(searchParams);
  const searchQuery = searchParamsRes["query"];
  const typeQuery = searchParamsRes["type"];
  const limit = 20;

  const toggleList = ["songs", "playlist", "albums", "artists"];
  const [activeToggle, setActiveToggle] = useState(typeQuery ?? toggleList[0]);

  const songsFetcher = () =>
    getSearchSongs({ query: searchQuery, limit: limit });
  const artistsFetcher = () =>
    getSearchArtists({ query: searchQuery, limit: limit });

  const albumFetcher = () =>
    getSearchAlbums({ query: searchQuery, limit: limit });
  const playlistFetcher = () =>
    getSearchPlaylists({ query: searchQuery, limit: limit });

  const {
    data: songResults,
    isLoading,
    error: songError,
  } = useSWR(
    searchQuery && activeToggle === "songs"
      ? `/search-songs?q=${searchQuery}`
      : null,
    songsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const {
    data: artistsResults,
    isLoading: artistsLoading,
    error: artistError,
  } = useSWR(
    searchQuery && activeToggle === "artists"
      ? `/search-artists?q=${searchQuery}`
      : null,
    artistsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const {
    data: albumsResults,
    isLoading: albumsLoading,
    error: albumError,
  } = useSWR(
    searchQuery && activeToggle === "albums"
      ? `/search-albums?q=${searchQuery}`
      : null,
    albumFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const {
    data: playlistResults,
    isLoading: playlistLoading,
    error: playlistError,
  } = useSWR(
    searchQuery && activeToggle === "playlist"
      ? `/search-playlist?q=${searchQuery}`
      : null,
    playlistFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    document.title = `${searchQuery}-Search • Okv-Tunes`;
    // eslint-disable-next-line
  }, [searchQuery]);

  const fetchError = songError || albumError || artistError || playlistError;

  return (
    <div className="inner-container flex flex-col gap-4">
      <BackButton />

      <div className="flex flex-col gap-4 mt-2">
        <h2 className="capitalize font-bold text-sm sm:text-lg  ">
          Search results for {`"${searchQuery}"`}
        </h2>
        <Toggle
          toggleList={toggleList}
          activeToggle={activeToggle}
          setActiveToggle={setActiveToggle}
        />

        {!isLoading && !artistsLoading && !albumsLoading && !playlistLoading ? (
          fetchError ? (
            <div className="max-[426px]:grid grid-cols-2 gap-4 flex flex-wrap items-center justify-center bg-white text-action">
              <p>{fetchError.message}</p>
            </div>
          ) : activeToggle === "songs" && songResults ? (
            songResults?.data?.total > 0 ? (
              songResults?.data.results.map((song, index) => (
                <SongsCollection
                  key={song.id}
                  song={song}
                  index={index}
                  isReordering={false}
                />
              ))
            ) : (
              <p>No songs found for this query</p>
            )
          ) : activeToggle === "albums" && albumsResults ? (
            <div className="max-[426px]:grid grid-cols-2 gap-4 flex flex-wrap items-center">
              {albumsResults && albumsResults?.data.total > 0 ? (
                albumsResults?.data.results.map((album) => (
                  <Card
                    key={album.id}
                    id={album.id}
                    title={album.name}
                    imageUrl={
                      album.image.find(
                        (item) =>
                          item.quality === "500x500" &&
                          item.url.includes("/c.saavncdn")
                      )?.url ?? "/logo-circle.svg"
                    }
                    type="album"
                  />
                ))
              ) : (
                <p>No Album found for this query</p>
              )}
            </div>
          ) : activeToggle === "playlist" && playlistResults ? (
            <div className="max-[426px]:grid grid-cols-2 gap-4 flex flex-wrap items-center">
              {playlistResults && playlistResults?.data.total > 0 ? (
                playlistResults?.data.results.map((playlist) => (
                  <Card
                    key={playlist.id}
                    id={playlist.id}
                    title={playlist.name}
                    imageUrl={
                      playlist.image.find(
                        (item) =>
                          item.quality === "500x500" &&
                          item.url.includes("/c.saavncdn")
                      )?.url ?? "/logo-circle.svg"
                    }
                    type="playlist"
                  />
                ))
              ) : (
                <p>No playlist found for this query</p>
              )}
            </div>
          ) : (
            <div className="max-[426px]:grid grid-cols-2 gap-4 flex flex-wrap items-center">
              {artistsResults && artistsResults?.data.total > 0 ? (
                artistsResults?.data.results.map((artist) => (
                  <Card
                    key={artist.id}
                    id={artist.id}
                    title={artist.name}
                    imageUrl={
                      artist.image.find(
                        (item) =>
                          item.quality === "500x500" &&
                          item.url.includes("/c.saavncdn")
                      )?.url ?? "/logo-circle.svg"
                    }
                    type="artist"
                  />
                ))
              ) : (
                <p>No artists found for this query</p>
              )}
            </div>
          )
        ) : (
          <Loading loadingText="Loading" />
        )}
      </div>
      {activeToggle === "songs" ? (
        <>
          <NextPageContent type="search" count={20} query={searchQuery} />
          <InfinitScroll />
        </>
      ) : null}
    </div>
  );
};

const Search = ({ searchParams }: Props) => (
  <Suspense fallback={<Loading loadingText="Loading" />}>
    <SearchComponent searchParams={searchParams} />
  </Suspense>
);

export default Search;
