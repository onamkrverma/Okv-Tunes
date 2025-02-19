import Link from "next/link";
import React from "react";
import Card from "./Card";
import { topArtist } from "@/utils/topArtists";
import { query } from "@/apolloClient";
import { graphql } from "gql.tada";

type Props = {
  id?: string;
  title: string;
  type: "song" | "artist";
};

const CardCollection = async ({ type, id, title }: Props) => {
  const playlistQuery = graphql(`
    query ExampleQuery($playlistId: String!) {
      playlist(id: $playlistId) {
        songs {
          id
          name
          artists {
            primary {
              name
            }
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

  const { data } =
    type === "song" && id
      ? await query({
          query: playlistQuery,
          variables: { playlistId: id },
        })
      : {};

  const urlSlug =
    type == "song"
      ? `/playlist/${encodeURIComponent(
          title.replaceAll(" ", "-").toLowerCase()
        )}-${id}`
      : "/artists";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-semibold truncate">{title}</h2>
        <Link
          href={`${urlSlug}`}
          className="text-sm font-medium text-neutral-200 hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="flex items-center gap-4 p-1.5 overflow-x-auto">
        {type === "song"
          ? data?.playlist?.songs?.map((song) => (
              <Card
                key={song?.id ?? "1"}
                id={song?.id ?? "1"}
                title={song?.name ?? "unknown-title"}
                imageUrl={
                  song?.image?.find((item) => item?.quality === "500x500")
                    ?.url ?? "/logo-circle.svg"
                }
                artist={song?.artists?.primary?.at(0)?.name ?? "unknown-artist"}
                audioUrl={
                  song?.downloadUrl?.find((item) => item?.quality === "320kbps")
                    ?.url ?? ""
                }
                type="song"
              />
            ))
          : topArtist
              .slice(0, 10)
              .map((artist) => (
                <Card
                  key={artist.artistid}
                  id={artist.artistid}
                  title={artist.name}
                  imageUrl={artist.image}
                  type="artist"
                />
              ))}
      </div>
    </div>
  );
};

export default CardCollection;
