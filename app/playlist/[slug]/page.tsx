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
          <h1 className="capitalize text-xl sm:text-2xl font-bold">{title}</h1>
          <small className="text-neutral-300">{description}</small>
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        {songs.map((song) => (
          <div
            key={song.id}
            className="flex items-center gap-4 p-2 cursor-pointer hover:bg-secondary"
          >
            <Image
              src={
                song.image.find((item) => item.quality === "500x500")?.url ?? ""
              }
              alt={name + "okv tunes"}
              width={50}
              height={50}
              priority
              className="w-[50px] h-[50px] object-cover rounded-md"
            />
            <p className="truncate w-80">
              {song.name.replaceAll("&quot;", '"')}
            </p>
            <small className="truncate w-60 text-neutral-400">
              {song.artists.primary[0].name}
            </small>
            <small className="truncate w-60 text-neutral-400">
              {song.album.name.replaceAll("&quot;", '"')}
            </small>
            <small className="text-neutral-400">
              {secondsToTime(song.duration)}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistSongs;
