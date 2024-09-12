import SongsCollection from "@/components/SongsCollection";
import { getPlaylists } from "@/utils/api";
import secondsToTime from "@/utils/secondsToTime";
import Image from "next/image";
import React from "react";
type Props = {
  params: { slug: string };
};

const PlaylistSongs = async ({ params }: Props) => {
  const id = params.slug.split("-").pop() as string;
  const title = params.slug.split("-").slice(0, -1).join(" ");

  const playlist = await getPlaylists({
    id: id,
  });

  const { name, description, songs } = playlist.data;

  return (
    <div className="inner-container flex flex-col gap-6">
      <div className="flex gap-4 flex-col sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <Image
            src={
              songs[0].image.find((item) => item.quality === "500x500")?.url ??
              ""
            }
            alt={name + "okv tunes"}
            width={200}
            height={200}
            priority
            className="w-full h-full object-cover rounded-md shadow-lg shadow-neutral-700"
          />
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            {title}
          </h1>
          <small className="text-neutral-300 text-center sm:text-start">
            {description}
          </small>
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        {songs.map((song) => (
          <SongsCollection key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default PlaylistSongs;
