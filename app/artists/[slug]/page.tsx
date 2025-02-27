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
  params: { slug: string };
  searchParams?: { [key: string]: string | undefined };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.slug.split("-").pop();

  const artistQuery = graphql(`
    query ExampleQuery($artistsId: String!, $songLimit: Int) {
      artists(id: $artistsId, songLimit: $songLimit) {
        id
        name
        bio {
          text
        }
        image {
          quality
          url
        }
      }
    }
  `);

  const { data } = id
    ? await query({
        query: artistQuery,
        variables: { artistsId: id },
      })
    : {};

  const name = data?.artists?.name;
  const bio = data?.artists?.bio;
  const image = data?.artists?.image;

  const description = `${bio?.[0]?.text?.slice(0, 160)} • Okv-Tunes`;

  return {
    title: `${name} songs • Okv-Tunes`,
    description: description,
    openGraph: {
      type: "profile",
      title: `${name} songs • Okv-Tunes`,
      description: description,
      images: [
        {
          url:
            image?.find(
              (item) =>
                item?.quality === "500x500" &&
                item?.url?.includes("/c.saavncdn")
            )?.url ?? "/logo-circle.svg",
        },
      ],
    },
  };
}

const ArtistInfo = async ({ params, searchParams }: Props) => {
  const id = params.slug.split("-").pop();
  const limit = parseInt(searchParams?.["limit"] as string);

  const artistQuery = graphql(`
    query ExampleQuery($artistsId: String!, $songLimit: Int) {
      artists(id: $artistsId, songLimit: $songLimit) {
        id
        name
        wiki
        dob
        bio {
          text
        }
        image {
          quality
          url
        }
        topSongs {
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
        query: artistQuery,
        variables: { artistsId: id, songLimit: limit || 20 },
      })
    : {};
  const name = data?.artists?.name;
  const dob = data?.artists?.dob;
  const wiki = data?.artists?.wiki;
  const bio = data?.artists?.bio ?? [];
  const image = data?.artists?.image;
  const topSongs = data?.artists?.topSongs as TSong[];

  return (
    <div className="inner-container flex flex-col gap-6">
      <BackButton />

      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center ">
        <div className="w-[200px] h-[200px]">
          <ImageWithFallback
            id={id}
            src={
              image?.find(
                (item) =>
                  item?.quality === "500x500" &&
                  item?.url?.includes("/c.saavncdn")
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
          {bio?.length > 0 ? (
            <small className="text-neutral-300 text-center sm:text-start">
              {bio?.at(0)?.text?.slice(0, 300) + "..."}
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

          <PlayAllSongs
            firstSong={topSongs[0]}
            suggessionSongIds={topSongs.slice(1, 16).map((item) => item.id)}
          />
        </div>
      </div>
      <p className="font-bold text-xl">Top songs</p>
      <div className="flex flex-col gap-4 my-4">
        {topSongs.length > 0 ? (
          topSongs.map((song, index) => (
            <SongsCollection key={song.id} song={song} index={index} />
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
