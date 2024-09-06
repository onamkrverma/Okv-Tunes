import { getPlaylists } from "@/utils/api";
import Link from "next/link";
import React from "react";
import Card from "./Card";

type Props = {
  playlistId: string;
  title: string;
};

const CardCollection = async ({ playlistId, title }: Props) => {
  const playlist = await getPlaylists({
    id: playlistId,
  });

  const urlSlug = `/playlist/${encodeURIComponent(
    title.replaceAll(" ", "-").toLowerCase()
  )}-${playlistId}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link href={`${urlSlug}`} className="text-sm hover:underline">
          View all
        </Link>
      </div>
      <div className="flex items-center gap-4 p-1.5 overflow-x-auto">
        {playlist.data.songs.map((song) => (
          <Card
            key={song.id}
            id={song.id}
            title={song.name}
            imageUrl={
              song.image.find((item) => item.quality === "500x500")?.url ?? ""
            }
            artist={song.artists.primary[0].name}
            audioUrl={
              song.downloadUrl.find((item) => item.quality === "320kbps")
                ?.url ?? ""
            }
          />
        ))}
      </div>
    </div>
  );
};

export default CardCollection;
