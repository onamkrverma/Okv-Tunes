import { HttpLink } from "@apollo/client";
import {
  registerApolloClient,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";

const devMode = process.env.NODE_ENV === "development";
const serverUrl = devMode
  ? "http://localhost:3000"
  : process.env.NEXT_PUBLIC_MY_SERVER_URL;

const cache = new InMemoryCache({
  typePolicies: {
    PlaylistData: {
      keyFields: ["id"],
    },
    Query: {
      fields: {
        album: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
        artist: {
          merge(existing, incoming) {
            return { ...existing, ...incoming };
          },
        },
      },
    },
  },
});

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
  return new ApolloClient({
    cache: cache,
    link: new HttpLink({
      uri: `${serverUrl}/api/graphql`,
    }),
  });
});

if (devMode) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}
