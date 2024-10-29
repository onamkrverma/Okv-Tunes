"use client";
import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import Loading from "@/components/Loading";
import SongsCollection from "@/components/SongsCollection";
import Toggle from "@/components/Toggle";
import {
  getArtist,
  getSearchAlbums,
  getSearchArtists,
  getSearchSongs,
} from "@/utils/api";
import { Suspense, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

const SearchComponent = ({ searchParams }: Props) => {
  const searchQuery = searchParams["query"];
  const typeQuery = searchParams["type"];
  const toggleList = ["songs", "albums", "artists"];
  const [activeToggle, setActiveToggle] = useState(typeQuery ?? toggleList[0]);

  const songsFetcher = () => getSearchSongs({ query: searchQuery, limit: 50 });
  const artistsFetcher = () =>
    getSearchArtists({ query: searchQuery, limit: 50 });

  const albumFetcher = () => getSearchAlbums({ query: searchQuery, limit: 50 });

  const { data: songResults, isLoading } = useSWR(
    searchQuery && activeToggle === "songs"
      ? `/search-songs?q=${searchQuery}`
      : null,
    songsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: artistsResults, isLoading: artistsLoading } = useSWR(
    searchQuery && activeToggle === "artists"
      ? `/search-artists?q=${searchQuery}`
      : null,
    artistsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: albumsResults, isLoading: albumsLoading } = useSWR(
    searchQuery && activeToggle === "albums"
      ? `/search-albums?q=${searchQuery}`
      : null,
    albumFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    document.title = `${searchQuery}-Search • Okv-Tunes`;
    // eslint-disable-next-line
  }, [searchQuery]);

  return (
    <div className="inner-container flex flex-col gap-6">
      <BackButton />

      <div className="flex flex-col gap-4 my-2">
        <h2 className="capitalize font-bold text-sm sm:text-lg  ">
          Search results for {`"${searchQuery}"`}
        </h2>
        <Toggle
          toggleList={toggleList}
          activeToggle={activeToggle}
          setActiveToggle={setActiveToggle}
        />
        {!isLoading && !artistsLoading && !albumsLoading ? (
          activeToggle === "songs" && songResults ? (
            songResults?.data?.total > 0 ? (
              songResults?.data.results.map((song, index) => (
                <SongsCollection key={song.id} song={song} index={index} />
              ))
            ) : (
              <p>No songs found for this query</p>
            )
          ) : activeToggle === "albums" && albumsResults ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-2 justify-items-center">
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
                <p>No artists found for this query</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-2 justify-items-center">
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
    </div>
  );
};

const Search = ({ searchParams }: Props) => (
  <Suspense fallback={<Loading loadingText="Loading" />}>
    <SearchComponent searchParams={searchParams} />
  </Suspense>
);

export default Search;
