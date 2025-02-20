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
  type Bio {
    text: String
    title: String
    sequence: Int
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

  extend type Artist {
    followerCount: Int
    fanCount: Int
    bio: [Bio]
    dob: String
    wiki: String
    topSongs: [Song]
  }

  type Query {
    searchSongs(query: String!, limit: Int): [Song]
    songs(id: [String!]!): [Song]
    relatedSongs(id: String!, limit: Int): [Song]
    playlist(id: String!, limit: Int): PlaylistData
    searchPlaylist(query: String!, limit: Int): [SearchResults]
    artists(id: String!, songLimit: Int): Artist
    searchArtists(query: String!, limit: Int): [SearchResults]
    album(id: String!): PlaylistData
    searchAlbums(query: String!, limit: Int): [SearchResults]
  }
`;
