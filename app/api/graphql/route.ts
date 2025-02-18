import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import {
  getSongsById,
  getSuggestedSongs,
  searchSongs,
} from "@/controllers/songs";
import { GqlSchema } from "./schema";
import { getPlaylist, searchPlaylist } from "@/controllers/playlist";

const resolvers = {
  Query: {
    searchSongs: searchSongs,
    songs: getSongsById,
    relatedSongs: getSuggestedSongs,
    playlist: getPlaylist,
    searchPlaylist: searchPlaylist,
  },
};

const server = new ApolloServer({
  resolvers,
  typeDefs: GqlSchema,
  formatError: (error) => {
    return { message: error.message };
  },
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
