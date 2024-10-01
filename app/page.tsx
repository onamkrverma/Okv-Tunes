import { homePlaylists } from "@/utils/playlists";
import CardCollection from "@/components/CardCollection";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Okv Tunes - Listen to Trending Music for Free | Ad-Free Streaming",
};

export default function Home() {
  return (
    <div className="inner-container flex flex-col gap-6">
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
