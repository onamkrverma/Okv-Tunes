import SongsCollection from "@/components/SongsCollection";
import { getSearchSongs } from "@/utils/api";

const Search = async ({
  searchParams,
}: {
  searchParams?: { [key: string]: string };
}) => {
  const searchQuery = searchParams?.search;

  const searchResult = await getSearchSongs({ query: searchQuery, limit: 50 });

  return (
    <div className="inner-container flex flex-col gap-6 !pb-24">
      <div className="flex flex-col gap-4 my-4">
        <h2 className="capitalize font-bold text-sm sm:text-lg  ">
          Search results for {`"${searchQuery}"`}
        </h2>
        {searchResult.data.results.map((song) => (
          <SongsCollection key={song.id} song={song} />
        ))}
      </div>
    </div>
  );
};

export default Search;
