import Card from "@/components/Card";
import { topArtist } from "@/utils/topArtists";
import React from "react";

const TopArtists = () => {
  return (
    <div className="inner-container flex flex-col gap-6 !pb-28">
      <h2 className="text-lg sm:text-2xl font-semibold truncate">
        Popular Artists
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-2 justify-items-center">
        {topArtist.map((artist) => (
          <Card
            key={artist.artistid}
            id={artist.artistid}
            title={artist.name}
            imageUrl={artist.image}
            type="artist"
          />
        ))}
      </div>

      <p className="text-neutral-300 text-center">
        {`“ If you cannot find your favorite artists, try using the search bar. ”`}
      </p>
    </div>
  );
};

export default TopArtists;
