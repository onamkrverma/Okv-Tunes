import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { gql } from "graphql-tag";

const resolvers = {
  Query: {
    hello: () => "world",
    searchSongs: async (_: unknown, { query }: { query: string }) => {
      const response = await fetch(
        `${
          process.env.MAIN_SERVER_URL
        }/api/search/songs?query=${query}&limit=${1}`
      );
      const data = await response.json();
      return data.data.results; // Assuming the API returns an array of songs in a property called 'songs'
    },
  },
};

const typeDefs = gql`
  type Song {
    id: String
    name: String
    type: String
    year: String
    releaseDate: String
    duration: Int
    label: String
    explicitContent: Boolean
    playCount: Int
    language: String
    hasLyrics: Boolean
    lyricsId: String
    url: String
    copyright: String
  }
  type Query {
    hello: String
    searchSongs(query: String!): [Song]
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET };
