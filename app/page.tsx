import { homePlaylists } from "@/utils/playlists";
import CardCollection from "@/components/CardCollection";
import { Metadata } from "next";
import { auth } from "@/auth";
import ImageWithFallback from "@/components/ImageWithFallback";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const session = await auth();
  const username = session?.user?.name;
  return {
    title: `Okv Tunes - Listen to Trending Music for Free | Ad-Free Streaming | ${
      username ?? ""
    }`,
  };
}

export default async function Home() {
  const session = await auth();

  return (
    <div className="inner-container flex flex-col gap-6">
      <Link href={"/profile"} className="flex items-center gap-2 w-fit">
        {session?.user?.image ? (
          <ImageWithFallback
            id={session.user.id}
            src={session?.user?.image ?? "/logo-circle.svg"}
            alt="user"
            className=" w-10 h-10 rounded-full"
          />
        ) : (
          <p className="uppercase bg-action text-primary rounded-full p-1 h-10 w-10 text-center text-2xl font-bold">
            {session ? session.user?.name?.at(0) : "G"}
          </p>
        )}

        <h1 className="text-2xl font-bold capitalize truncate max-w-60">
          Hi, {session ? session.user?.name : "guest"}
        </h1>
      </Link>
      {homePlaylists.slice(0, 4).map((item) => (
        <CardCollection
          key={item.id}
          id={item.id}
          title={item.title}
          type="song"
        />
      ))}

      <CardCollection title="Popular Artists" type="artist" />
      {homePlaylists.slice(4).map((item) => (
        <CardCollection
          key={item.id}
          id={item.id}
          title={item.title}
          type="song"
        />
      ))}
    </div>
  );
}
