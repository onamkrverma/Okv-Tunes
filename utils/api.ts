import Wretch from "wretch";
import queryString from "wretch/addons/queryString";
import {
  TArtistRes,
  TPlaylists,
  TSearchResults,
  TSearchSongs,
  TSongs,
  TUser,
  TUserPlaylist,
} from "./api.d";

const downloadServer = process.env.NEXT_PUBLIC_MY_DOWNLOAD_URL;

const serverUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_MY_SERVER_URL;

const api = Wretch(`${serverUrl}/api`, {
  next: { revalidate: 3600 * 6 },
}).addon(queryString);

type TApiQuery = {
  id?: string | string[];
  query?: string | null;
  limit?: number;
};
type TUserApiQuery = {
  userId: string;
  authToken: string;
  songId?: string | string[];
  playlistTitle?: string;
  playlistSongIds?: string[];
  playlistVisibility?: string;
  isFullDeletePlaylist?: boolean;
  playlistId?: string;
  isReorder?: boolean;
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
    .json()) as TSearchResults;

  return response;
};
export const getSearchAlbums = async ({ query, limit = 10 }: TApiQuery) => {
  const querParams = {
    query,
    limit,
  };
  const response = (await api
    .query(querParams)
    .get(`/album/search`)
    .json()) as TSearchResults;

  return response;
};
export const getSearchPlaylists = async ({ query, limit = 10 }: TApiQuery) => {
  const querParams = {
    query,
    limit,
  };
  const response = (await api
    .query(querParams)
    .get(`/playlists/search`)
    .json()) as TSearchResults;

  return response;
};

export const getAlbum = async ({ id }: TApiQuery) => {
  const querParams = {
    id,
  };
  const response = (await api
    .query(querParams)
    .get(`/album`)
    .json()) as TPlaylists;

  return response;
};

// User apis
export const getUserInfo = async ({ userId, authToken }: TUserApiQuery) => {
  const response = (await api
    .auth(`Bearer ${authToken}`)
    .get(`/users/${userId}`)
    .json()) as TUser;
  return response;
};

export const getLikedSongs = async ({ userId, authToken }: TUserApiQuery) => {
  const response = (await api
    .auth(`Bearer ${authToken}`)
    .options({
      next: { revalidate: 0 },
    })
    .get(`/users/${userId}/liked-songs`)
    .json()) as string[];
  return response;
};

export const updateLikedSongs = async ({ userId, songId }: TUserApiQuery) => {
  const songIds = songId as string[];
  const response = (await api
    .put({ songIds }, `/users/${userId}/liked-songs`)
    .json()) as {
    message: string;
  };

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
export const getUserAllPlaylist = async ({
  userId,
  authToken,
}: TUserApiQuery) => {
  const response = (await api
    .auth(`Bearer ${authToken}`)
    .options({
      next: { revalidate: 0 },
    })
    .get(`/users/${userId}/playlist`)
    .json()) as TUserPlaylist[];
  return response;
};

export const getUserPlaylist = async ({
  userId,
  playlistId,
}: TUserApiQuery) => {
  const querParams = {
    playlistid: playlistId,
  };

  const response = (await api
    .options({
      next: { revalidate: 0 },
    })
    .query(querParams)
    .get(`/users/${userId}/playlist`)
    .json()) as TUserPlaylist;
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
  isReorder,
}: TUserApiQuery) => {
  const reqBody = {
    playlistId,
    title: playlistTitle,
    songIds: playlistSongIds,
    visibility: playlistVisibility,
    isReorder,
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

export const getUserPublicPlaylists = async ({
  authToken,
}: {
  authToken: string;
}) => {
  const response = (await api
    .auth(`Bearer ${authToken}`)
    .options({
      next: { revalidate: 0 },
    })
    .get(`/users/public-playlist`)
    .json()) as TUserPlaylist[];
  return response;
};

export const getUserPublicPlaylist = async ({
  playlistId,
  authToken,
}: TUserApiQuery) => {
  const querParams = {
    playlistid: playlistId,
  };
  const response = (await api
    .auth(`Bearer ${authToken}`)
    .options({
      next: { revalidate: 0 },
    })
    .query(querParams)
    .get(`/users/public-playlist`)
    .json()) as TUserPlaylist;
  return response;
};

export const getDownloadAudio = ({
  audioId,
  title,
  album,
  artists,
}: {
  audioId: string;
  title: string;
  album: string;
  artists: string;
}) => {
  const a = document.createElement("a");
  a.href = `${downloadServer}/download-okv-tunes?title=${title}&album=${album}&artists=${artists}&id=${audioId}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
