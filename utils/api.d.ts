export interface PlaylistData {
  id: string;
  name: string;
  description: string;
  type: string;
  year: null;
  playCount: null;
  language: string;
  explicitContent: boolean;
  url: string;
  songCount: number;
  artists: Artist[];
  image: Image[];
  songs: TSong[];
}

export interface Artist {
  id: string;
  name: string;
  role: Role;
  image: Image[];
  type: ArtistType;
  url: string;
}
interface Bio {
  text: string;
  title: string;
  sequence: number;
}
export interface TArtist extends Artist {
  followerCount: number;
  fanCount: string;
  bio: Bio[];
  dob: string;
  wiki: string;
  topSongs: TSong[];
}

export interface Image {
  quality: "50x50" | "150x150" | "500x500";
  url: string;
}
export interface DownloadUrl {
  quality: "12kbps" | "160kbps" | "96kbps" | "48kbps" | "320kbps";
  url: string;
}

export enum Role {
  Lyricist = "lyricist",
  Music = "music",
  PrimaryArtists = "primary_artists",
  Singer = "singer",
}

export enum ArtistType {
  Artist = "artist",
}

export interface TSong {
  id: string;
  name: string;
  type: "song";
  year: string;
  releaseDate: string;
  duration: number;
  label: string;
  explicitContent: boolean;
  playCount: number;
  language: string;
  hasLyrics: boolean;
  lyricsId: null;
  url: string;
  copyright: string;
  album: Album;
  artists: Artists;
  image: Image[];
  downloadUrl: DownloadUrl[];
}

export interface Album {
  id: string;
  name: string;
  url: string;
}

export interface Artists {
  primary: Artist[];
  featured: any[];
  all: Artist[];
}

export interface SearchSongs {
  total: number;
  results: TSong[];
}
export interface SearchArtists {
  total: number;
  results: Artist[];
}

export interface Data<T> {
  success: boolean;
  data: T;
}

export interface LikedSong {
  songId: string;
  likedAt?: string;
}

export interface TUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  likedSongs: LikedSong[];
  createdAt: Date;
  updatedAt: Date;
}
export interface TUserPlaylist {
  title: string;
  songIds: string[];
  visibility: "public" | "private";
  createdAt: Date;
  _id: string;
}

export interface TPlaylists extends Data<PlaylistData> {}
export interface TSongs extends Data<TSong[]> {}
export interface TSearchSongs extends Data<SearchSongs> {}
export interface TArtistRes extends Data<TArtist> {}
export interface TSearchArtist extends Data<SearchArtists> {}
