import { homePlaylists } from "@/utils/playlists";
import CardCollection from "@/components/CardCollection";
import { Metadata } from "next";
import GreetUser from "@/components/GreetUser";

export const metadata: Metadata = {
  title: `Okv Tunes - Listen to Trending Music for Free | Ad-Free Streaming`,
};

export const revalidate = 86400;
export const dynamic = "force-static";

export default async function Home() {
  return (
    <div className="inner-container flex flex-col gap-6">
      <GreetUser />
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
