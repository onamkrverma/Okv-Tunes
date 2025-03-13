import BackButton from "@/components/BackButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import PlayAllSongs from "@/components/PlayAllSongs";
import SongsCollection from "@/components/SongsCollection";
import { getAlbum } from "@/utils/api";
import { Metadata } from "next";
type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paramRes = await params;
  const id = paramRes.slug.split("-").pop();
  const album = await getAlbum({ id: id });
  const { name, description } = album.data;

  return {
    title: `${name.replaceAll("Jio", "Okv")} • Okv-Tunes`,
    description: `${description.replaceAll("Jio", "Okv")}`,
  };
}

const AlbumSongs = async ({ params }: Props) => {
  const paramRes = await params;
  const id = paramRes.slug.split("-").pop() as string;

  const album = await getAlbum({
    id: id,
  });

  const { name, description, songs } = album.data;

  return (
    <div className="inner-container flex flex-col gap-6">
      <BackButton />
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={id}
            src={
              songs[0].image.find((item) => item.quality === "500x500")?.url ??
              "/logo-circle.svg"
            }
            alt={name + "-okv tunes"}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-md "
          />
        </div>
        <div className="flex flex-col items-center sm:items-start gap-2 w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            {name}
          </h1>
          <small className="text-neutral-300 text-center sm:text-start">
            {description}
          </small>
          {songs.length > 0 ? (
            <PlayAllSongs
              firstSong={songs[0]}
              suggestionSongIds={songs.slice(1, 16).map((item) => item.id)}
            />
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        {songs.length > 0 ? (
          songs.map((song, index) => (
            <SongsCollection
              key={song.id}
              song={song}
              index={index}
              isReordering={false}
            />
          ))
        ) : (
          <p>No songs found</p>
        )}
      </div>
    </div>
  );
};

export default AlbumSongs;
