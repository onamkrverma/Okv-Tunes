import { query } from "@/apolloClient";
import BackButton from "@/components/BackButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import InfinitScroll from "@/components/InfinitScroll";
import PlayAllSongs from "@/components/PlayAllSongs";
import SongsCollection from "@/components/SongsCollection";
import type { TSong } from "@/utils/api.d";
import { graphql } from "gql.tada";
import { Metadata } from "next";
type Props = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paramString = await params;
  const id = paramString.slug.split("-").pop();
  const title = paramString.slug.split("-").slice(0, -1).join(" ");

  const playlistQuery = graphql(`
    query ExampleQuery($playlistId: String!) {
      playlist(id: $playlistId) {
        id
        description
      }
    }
  `);

  const { data } = id
    ? await query({
        query: playlistQuery,
        variables: { playlistId: id },
      })
    : {};

  const description = data?.playlist?.description ?? "";

  return {
    title: `${title.replaceAll("Jio", "Okv")} • Okv-Tunes`,
    description: `${description.replaceAll("Jio", "Okv")}`,
  };
}

const PlaylistSongs = async ({ params, searchParams }: Props) => {
  const paramString = await params;
  const searchParamsString = await searchParams;
  const id = paramString.slug.split("-").pop() as string;
  const title = paramString.slug.split("-").slice(0, -1).join(" ");
  const limit = parseInt(searchParamsString?.["limit"] as string);

  const playlistQuery = graphql(`
    query ExampleQuery($playlistId: String!, $limit: Int) {
      playlist(id: $playlistId, limit: $limit) {
        id
        description
        songs {
          id
          name
          duration
          artists {
            all {
              name
            }
          }
          album {
            id
            name
          }
          image {
            quality
            url
          }
          downloadUrl {
            quality
            url
          }
        }
      }
    }
  `);

  const { data } = id
    ? await query({
        query: playlistQuery,
        variables: { playlistId: id, limit: limit },
      })
    : {};

  const description = data?.playlist?.description;
  const songs = data?.playlist?.songs as TSong[];

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
            alt={songs[0].name + "-okv tunes"}
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
            {description?.replaceAll("Jio", "Okv")}
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
