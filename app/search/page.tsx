"use client";
import Card from "@/components/Card";
import Loading from "@/components/Loading";
import SongsCollection from "@/components/SongsCollection";
import Toggle from "@/components/Toggle";
import { getArtist, getSearchArtists, getSearchSongs } from "@/utils/api";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

const Search = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search");
  const toggleList = ["songs", "artists"];
  const [activeToggle, setActiveToggle] = useState("songs");

  const songsFetcher = () => getSearchSongs({ query: searchQuery, limit: 50 });
  const artistsFetcher = () =>
    getSearchArtists({ query: searchQuery, limit: 50 });

  const { data: songResults, isLoading } = useSWR(
    searchQuery && activeToggle === "songs" ? "/search-songs" : null,
    songsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: artistsResults, isLoading: artistsLoading } = useSWR(
    searchQuery && activeToggle === "artists" ? "/search-artists" : null,
    artistsFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (searchQuery && searchQuery.length === 0) return;
    activeToggle === "songs"
      ? mutate("/search-songs")
      : mutate("/search-artists");
  }, [searchQuery]);

  return (
    <div className="inner-container flex flex-col gap-6 !pb-24">
      <div className="flex flex-col gap-4 my-2">
        <h2 className="capitalize font-bold text-sm sm:text-lg  ">
          Search results for {`"${searchQuery}"`}
        </h2>
        <Toggle
          toggleList={toggleList}
          activeToggle={activeToggle}
          setActiveToggle={setActiveToggle}
        />
        {!isLoading && !artistsLoading ? (
          activeToggle === "songs" ? (
            songResults?.data.results.map((song) => (
              <SongsCollection key={song.id} song={song} />
            ))
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-2 justify-items-center">
              {artistsResults?.data.results.map((artist) => (
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
              ))}
            </div>
          )
        ) : (
          <Loading loadingText="loading" />
        )}
      </div>
    </div>
  );
};

export default Search;
