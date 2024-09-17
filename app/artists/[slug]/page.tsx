import SongsCollection from "@/components/SongsCollection";
import { getArtist } from "@/utils/api";
import Image from "next/image";
import React from "react";
type Props = {
  params: { slug: string };
};
const ArtistInfo = async ({ params }: Props) => {
  const id = params.slug.split("-").pop() as string;
  const artist = await getArtist({ id: id, limit: 50 });

  const { image, name, topSongs, bio, wiki, dob } = artist.data;

  return (
    <div className="inner-container flex flex-col gap-6 !pb-24">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <Image
            src={
              image.find(
                (item) =>
                  item.quality === "500x500" && item.url.includes("/c.saavncdn")
              )?.url ?? "/logo-circle.svg"
            }
            alt={name + " okv tunes"}
            width={200}
            height={200}
            priority
            className="w-full h-full object-cover rounded-full shadow-lg shadow-neutral-700"
          />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-md">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            {name}
          </h1>

          {dob ? (
            <p className="text-neutral-300 text-center sm:text-start">
              Born: {dob}
            </p>
          ) : null}
          {bio.length > 0 ? (
            <small className="text-neutral-300 text-center sm:text-start">
              {bio[0].text.slice(0, 300) + "..."}
            </small>
          ) : null}
          {wiki ? (
            <a
              href={wiki}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 text-sm text-center sm:text-start"
            >
              Read more
            </a>
          ) : null}
        </div>
      </div>
      <p className="font-bold text-xl">Top songs</p>
      <div className="flex flex-col gap-4 my-4">
        {topSongs.length > 0 ? (
          topSongs.map((song) => <SongsCollection key={song.id} song={song} />)
        ) : (
          <p>No songs found</p>
        )}
      </div>
    </div>
  );
};

export default ArtistInfo;
