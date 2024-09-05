import { homePlaylists } from "@/utils/playlists";
import CardCollection from "@/components/CardCollection";

export default function Home() {
  return (
    <div className="page-container flex flex-col gap-6">
      {homePlaylists.map((item) => (
        <CardCollection key={item.id} playlistId={item.id} title={item.title} />
      ))}
    </div>
  );
}
