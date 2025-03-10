import BackButton from "@/components/BackButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import InfinitScroll from "@/components/InfinitScroll";
import PlayAllSongs from "@/components/PlayAllSongs";
import SongsCollection from "@/components/SongsCollection";
import { getArtist } from "@/utils/api";
import { Metadata } from "next";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paramRes = await params;
  const id = paramRes.slug.split("-").pop();
  const artist = await getArtist({ id: id });
  const { name, bio } = artist.data;

  return {
    title: `${name} songs • Okv-Tunes`,
    description: `${bio[0]?.text.slice(0, 160)}`,
  };
}

const ArtistInfo = async ({ params, searchParams }: Props) => {
  const paramRes = await params;
  const searchParmsRes = await searchParams;

  const id = paramRes.slug.split("-").pop();
  const limit = parseInt(searchParmsRes?.["limit"] as string);

  const artist = await getArtist({ id: id, limit: limit || 20 });

  const { image, name, topSongs, bio, wiki, dob } = artist.data;

  return (
    <div className="inner-container flex flex-col gap-6">
      <BackButton />

      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={id}
            src={
              image.find(
                (item) =>
                  item.quality === "500x500" && item.url.includes("/c.saavncdn")
              )?.url ?? "/logo-circle.svg"
            }
            alt={name + "-okv tunes"}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-full "
          />
        </div>
        <div className="flex flex-col items-center sm:items-start gap-2 w-full max-w-md">
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

          {topSongs.length > 0 ? (
            <PlayAllSongs
              firstSong={topSongs[0]}
              suggessionSongIds={topSongs.slice(1, 16).map((item) => item.id)}
            />
          ) : null}
        </div>
      </div>
      <p className="font-bold text-xl">Top songs</p>
      <div className="flex flex-col gap-4 my-4">
        {topSongs.length > 0 ? (
          topSongs.map((song, index) => (
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
      <InfinitScroll />
    </div>
  );
};

export default ArtistInfo;
