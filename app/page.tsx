import { homePlaylists } from "@/utils/playlists";
import CardCollection from "@/components/CardCollection";
import { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Okv Tunes - Listen to Trending Music for Free | Ad-Free Streaming",
};

export default async function Home() {
  const session = await auth();

  return (
    <div className="inner-container flex flex-col gap-6">
      <div className="flex items-center gap-2">
        {session?.user?.image ? (
          <img
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
      </div>
      {homePlaylists.map((item) => (
        <CardCollection
          key={item.id}
          id={item.id}
          title={item.title}
          type="song"
        />
      ))}

      <CardCollection title="Popular Artists" type="artist" />
    </div>
  );
}
