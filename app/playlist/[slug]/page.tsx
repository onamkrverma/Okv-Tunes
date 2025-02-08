import BackButton from "@/components/BackButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import InfinitScroll from "@/components/InfinitScroll";
import PlayAllSongs from "@/components/PlayAllSongs";
import SongsCollection from "@/components/SongsCollection";
import { getPlaylists } from "@/utils/api";
import { Metadata } from "next";
type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.slug.split("-").pop();
  const title = params.slug.split("-").slice(0, -1).join(" ");
  const playlist = await getPlaylists({ id: id });
  const { description } = playlist.data;

  return {
    title: `${title.replaceAll("Jio", "Okv")} • Okv-Tunes`,
    description: `${description.replaceAll("Jio", "Okv")}`,
  };
}

const PlaylistSongs = async ({ params, searchParams }: Props) => {
  const id = params.slug.split("-").pop() as string;
  const title = params.slug.split("-").slice(0, -1).join(" ");
  const limit = parseInt(searchParams?.["limit"] as string);

  const playlist = await getPlaylists({
    id: id,
    limit: limit || 20,
  });
  const { name, description, songs } = playlist.data;

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
            {title}
          </h1>
          <small className="text-neutral-300 text-center sm:text-start">
            {description.replaceAll("Jio", "Okv")}
          </small>
          <PlayAllSongs
            firstSong={songs[0]}
            suggessionSongIds={songs.slice(1, 16).map((item) => item.id)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        {songs.map((song, index) => (
          <SongsCollection key={song.id} song={song} index={index} />
        ))}
      </div>

      <InfinitScroll />
    </div>
  );
};

export default PlaylistSongs;
