import Wretch from "wretch";
import queryString from "wretch/addons/queryString";
import {
  LikedSong,
  TArtistRes,
  TPlaylists,
  TSearchArtist,
  TSearchSongs,
  TSongs,
  TUser,
  TUserPlaylist,
} from "./api.d";

const serverUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_MY_SERVER_URL;

const api = Wretch(`${serverUrl}/api`, {
  next: { revalidate: 3600 * 12 },
}).addon(queryString);

type TApiQuery = {
  id?: string | string[];
  query?: string | null;
  limit?: number;
};
type TUserApiQuery = {
  userId: string;
  songId?: string;
  playlistTitle?: string;
  playlistSongIds?: string[];
  playlistVisibility?: string;
  isFullDeletePlaylist?: boolean;
  playlistId?: string;
};

export const getPlaylists = async ({ id, limit = 10 }: TApiQuery) => {
  const querParams = {
    id,
    limit,
  };
  const response = (await api
    .query(querParams)
    .get(`/playlists`)
    .json()) as TPlaylists;

  return response;
};
export const getSongs = async ({ id }: TApiQuery) => {
  const querParams = {
    id, // id=[songId]
  };
  const response = (await api.query(querParams).get(`/songs`).json()) as TSongs;
  return response;
};

export const getSuggestedSongs = async ({ id, limit = 10 }: TApiQuery) => {
  const querParams = {
    id, // id=songId
    limit,
  };
  const response = (await api
    .query(querParams)
    .get(`/songs/suggestions`)
    .json()) as TSongs;

  return response;
};
export const getSearchSongs = async ({ query, limit = 10 }: TApiQuery) => {
  const querParams = {
    query,
    limit,
  };
  const response = (await api
    .query(querParams)
    .get(`/songs/search`)
    .json()) as TSearchSongs;

  return response;
};
export const getArtist = async ({ id, limit = 10 }: TApiQuery) => {
  const querParams = {
    id, // id= artist id
    limit,
  };
  const response = (await api
    .query(querParams)
    .get(`/artists`)
    .json()) as TArtistRes;

  return response;
};

export const getSearchArtists = async ({ query, limit = 10 }: TApiQuery) => {
  const querParams = {
    query,
    limit,
  };
  const response = (await api
    .query(querParams)
    .get(`/artists/search`)
    .json()) as TSearchArtist;

  return response;
};

// Users API
export const getUserInfo = async ({ userId }: TUserApiQuery) => {
  const response = (await api.get(`/users/${userId}`).json()) as TUser;

  return response;
};
export const getLikedSongs = async ({ userId }: TUserApiQuery) => {
  const response = (await api
    .get(`/users/${userId}/liked-songs`)
    .json()) as string[];
  return response;
};

export const likeDislikeSong = async ({ userId, songId }: TUserApiQuery) => {
  const response = (await api
    .post({ songId }, `/users/${userId}/like-dislike`)
    .json()) as {
    message: string;
    likedSongIds: string[];
  };

  return response;
};
export const getUserPlaylist = async ({ userId }: TUserApiQuery) => {
  const response = (await api
    .get(`/users/${userId}/playlist`)
    .json()) as TUserPlaylist[];
  return response;
};
export const createUserPlaylist = async ({
  userId,
  playlistSongIds,
  playlistTitle,
  playlistVisibility,
}: TUserApiQuery) => {
  const reqBody = {
    title: playlistTitle,
    songIds: playlistSongIds,
    visibility: playlistVisibility,
  };

  const response = (await api
    .post(reqBody, `/users/${userId}/playlist`)
    .json()) as { message: string };
  return response;
};
export const updateUserPlaylistSongs = async ({
  userId,
  playlistSongIds,
  playlistTitle,
  playlistId,
  playlistVisibility,
}: TUserApiQuery) => {
  const reqBody = {
    playlistId,
    title: playlistTitle,
    songIds: playlistSongIds,
    visibility: playlistVisibility,
  };

  const response = (await api
    .put(reqBody, `/users/${userId}/playlist`)
    .json()) as { message: string };
  return response;
};

export const deleteUserPlaylistSongs = async ({
  userId,
  playlistSongIds,
  playlistId,
  isFullDeletePlaylist,
}: TUserApiQuery) => {
  const querParams = {
    playlistid: playlistId,
    songid: playlistSongIds,
    "delete-playlist": isFullDeletePlaylist ? "true" : "false",
  };

  const response = (await api
    .query(querParams)
    .delete(`/users/${userId}/playlist`)
    .json()) as { message: string };
  return response;
};
