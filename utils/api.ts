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
} from "./api.d";

const serverUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_MY_SERVER_URL;

const api = Wretch(`${serverUrl}/api`, {
  next: { revalidate: 3600 * 12 },
}).addon(queryString);

type TApiquery = {
  id?: string | string[];
  query?: string | null;
  limit?: number;
};

export const getPlaylists = async ({ id, limit = 10 }: TApiquery) => {
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
export const getSongs = async ({ id }: TApiquery) => {
  const querParams = {
    id, // id=[songId]
  };
  const response = (await api.query(querParams).get(`/songs`).json()) as TSongs;
  return response;
};

export const getSuggestedSongs = async ({ id, limit = 10 }: TApiquery) => {
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
export const getSearchSongs = async ({ query, limit = 10 }: TApiquery) => {
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
export const getArtist = async ({ id, limit = 10 }: TApiquery) => {
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

export const getSearchArtists = async ({ query, limit = 10 }: TApiquery) => {
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

export const getUserInfo = async ({ id }: TApiquery) => {
  const response = (await api.get(`/users/${id}`).json()) as TUser;

  return response;
};
export const getLikedSongs = async ({ id }: TApiquery) => {
  // id = userid
  const response = (await api
    .get(`/users/${id}/liked-songs`)
    .json()) as string[];
  return response;
};

export const likeDislikeSong = async (userId: string, songId: string) => {
  const response = (await api
    .post({ songId }, `/users/${userId}/like-dislike`)
    .json()) as {
    message: string;
    likedSongs: string[];
  };

  return response;
};
