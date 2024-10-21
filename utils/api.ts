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
import { decode, getToken } from "next-auth/jwt";

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
  authToken: string;
  userId?: string;
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
const parseAuthToken = async (authToken: string) => {
  const token = process.env.AUTH_SECRET
    ? await decode({
        salt: "authjs.session-token",
        token: authToken,
        secret: process.env.AUTH_SECRET,
      })
    : null;
  return token;
};

export const getUserInfo = async ({ authToken }: TUserApiQuery) => {
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .auth(`Bearer ${authToken}`)
    .get(`/users/${user.sub}`)
    .json()) as TUser;
  return response;
};
export const getLikedSongs = async ({ authToken }: TUserApiQuery) => {
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .auth(`Bearer ${authToken}`)

    .options({
      next: { revalidate: 0 },
    })
    .get(`/users/${user.sub}/liked-songs`)
    .json()) as string[];
  return response;
};

export const likeDislikeSong = async ({ authToken, songId }: TUserApiQuery) => {
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .auth(`Bearer ${authToken}`)

    .post({ songId }, `/users/${user.sub}/like-dislike`)
    .json()) as {
    message: string;
    likedSongIds: string[];
  };

  return response;
};
export const getUserAllPlaylist = async ({ authToken }: TUserApiQuery) => {
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .options({
      next: { revalidate: 0 },
    })
    .auth(`Bearer ${authToken}`)
    .get(`/users/${user.sub}/playlist`)
    .json()) as TUserPlaylist[];
  return response;
};

export const getUserPlaylist = async ({
  authToken,
  playlistId,
}: TUserApiQuery) => {
  const querParams = {
    playlistid: playlistId,
  };
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .options({
      next: { revalidate: 0 },
    })
    .query(querParams)
    .get(`/users/${user.sub}/playlist`)
    .json()) as TUserPlaylist;
  return response;
};
export const createUserPlaylist = async ({
  authToken,
  playlistSongIds,
  playlistTitle,
  playlistVisibility,
}: TUserApiQuery) => {
  const reqBody = {
    title: playlistTitle,
    songIds: playlistSongIds,
    visibility: playlistVisibility,
  };
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .post(reqBody, `/users/${user.sub}/playlist`)
    .json()) as { message: string };
  return response;
};
export const updateUserPlaylistSongs = async ({
  authToken,
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
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .put(reqBody, `/users/${user.sub}/playlist`)
    .json()) as { message: string };
  return response;
};

export const deleteUserPlaylistSongs = async ({
  authToken,
  playlistSongIds,
  playlistId,
  isFullDeletePlaylist,
}: TUserApiQuery) => {
  const querParams = {
    playlistid: playlistId,
    songid: playlistSongIds,
    "delete-playlist": isFullDeletePlaylist ? "true" : "false",
  };
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .query(querParams)
    .delete(`/users/${user.sub}/playlist`)
    .json()) as { message: string };
  return response;
};

export const getUserPublicPlaylists = async ({ authToken }: TUserApiQuery) => {
  const user = await parseAuthToken(authToken);
  if (!user?.sub) return;
  const response = (await api
    .options({
      next: { revalidate: 0 },
    })
    .auth(`Bearer ${authToken}`)
    .get(`/users/public-playlist`)
    .json()) as TUserPlaylist[];
  return response;
};
