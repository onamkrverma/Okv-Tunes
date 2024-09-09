import Wretch from "wretch";
import queryString from "wretch/addons/queryString";
import { TPlaylists, TSongs } from "./api.d";

const serverUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : process.env.MY_SERVER_URL;

const api = Wretch(`${serverUrl}/api`, { next: { revalidate: 0 } }).addon(
  queryString
);

type TApiquery = {
  id: string;
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
export const getSong = async ({ id }: TApiquery) => {
  const querParams = {
    id, // id=songId
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
