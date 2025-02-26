import { query } from "@/apolloClient";
import BackButton from "@/components/BackButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import PlayAllSongs from "@/components/PlayAllSongs";
import SongsCollection from "@/components/SongsCollection";
import type { TSong } from "@/utils/api.d";
import { graphql } from "gql.tada";
import { Metadata } from "next";
import React from "react";
type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.slug.split("-").pop();

  const albumQuery = graphql(`
    query ExampleQuery($albumId: String!) {
      album(id: $albumId) {
        name
        description
      }
    }
  `);
  const { data } = id
    ? await query({ query: albumQuery, variables: { albumId: id } })
    : {};
  const { name, description } = data?.album ?? {};

  return {
    title: `${name?.replaceAll("Jio", "Okv")} • Okv-Tunes`,
    description: `${description?.replaceAll("Jio", "Okv")}`,
  };
}

const AlbumSongs = async ({ params }: Props) => {
  const id = params.slug.split("-").pop() as string;

  // const album = await getAlbum({
  //   id: id,
  // });

  const albumQuery = graphql(`
    query ExampleQuery($albumId: String!) {
      album(id: $albumId) {
        id
        name
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
    ? await query({ query: albumQuery, variables: { albumId: id } })
    : {};
  const name = data?.album?.name;
  const description = data?.album?.description;
  const songs = data?.album?.songs as TSong[];

  return (
    <div className="inner-container flex flex-col gap-6">
      <BackButton />
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={id}
            src={
              songs[0].image.find((item) => item?.quality === "500x500")?.url ??
              "/logo-circle.svg"
            }
            alt={name + "-okv tunes"}
            width={200}
            height={200}
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex flex-col items-center sm:items-start gap-2 w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            {name}
          </h1>
          <small className="text-neutral-300 text-center sm:text-start">
            {description}
          </small>
          <PlayAllSongs
            firstSong={songs[0]}
            suggessionSongIds={songs?.slice(1, 16).map((item) => item.id)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 my-4">
        {songs.map((song, index) => (
          <SongsCollection key={song.id} song={song} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AlbumSongs;
