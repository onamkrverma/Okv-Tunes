import Wretch from "wretch";
import queryString from "wretch/addons/queryString";
import { Playlists } from "./api.d";

const serverUrl = process.env.SERVER_URL;

const api = Wretch(serverUrl).addon(queryString);

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
    .get("/playlists")
    .json()) as Playlists;

  return response;
};
