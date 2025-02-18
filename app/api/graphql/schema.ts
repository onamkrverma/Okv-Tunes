import gql from "graphql-tag";

export const GqlSchema = gql`
  type Image {
    quality: String
    url: String
  }

  type DownloadUrl {
    quality: String
    url: String
  }

  type Artist {
    id: String
    name: String
    role: String
    image: [Image]
    type: String
    url: String
  }

  type Artists {
    primary: [Artist]
    featured: [Artist]
    all: [Artist]
  }

  type Album {
    id: String
    name: String
    url: String
  }

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
    album: Album
    artists: Artists
    image: [Image]
    downloadUrl: [DownloadUrl]
  }

  type PlaylistData {
    id: String
    name: String
    description: String
    type: String
    language: String
    explicitContent: Boolean
    url: String
    songCount: Int
    artists: [Artist]
    image: [Image]
    songs: [Song]
  }

  type SearchResults {
    id: String
    name: String
    role: String
    image: [Image]
    type: String
    url: String
  }

  type Query {
    searchSongs(query: String!, limit: Int): [Song]
    songs(id: [String!]!): [Song]
    relatedSongs(id: String!, limit: Int): [Song]
    playlist(id: String!, limit: Int): PlaylistData
    searchPlaylist(query: String!, limit: Int): [SearchResults]
  }
`;
