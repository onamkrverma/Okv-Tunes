"use client";
import { getSongs } from "@/utils/api";
import React, { useState } from "react";
import useSWR from "swr";
import CrossIcon from "@/public/icons/cross.svg";
import Link from "next/link";
import Loading from "../Loading";
import Input from "../Input";

type Props = {
  isPopup: boolean;
  setIsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  songId: string;
  variant: "song-info" | "add-playlist";
};

const Popup = ({ isPopup, setIsPopup, songId, variant }: Props) => {
  const [isAddNewPlaylist, setIsAddNewPlaylist] = useState(false);

  const playlists = [
    { id: 1, title: "Fav Songs", songIds: ["mksnka", "nksnkaj"] },
    { id: 2, title: "Bollywood Songs", songIds: ["mksnka", "nksnkaj"] },
  ];

  const dataFetcher = () => getSongs({ id: songId });
  const { data: songData, isLoading } = useSWR(
    isPopup && variant === "song-info" ? "/song-info" : null,
    dataFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const urlSlug = (title: string, id: string) =>
    `/artists/${encodeURIComponent(
      title.replaceAll(" ", "-").toLowerCase()
    )}-${id}`;

  return (
    <div className="fixed top-0 left-0 w-full h-full z-20 backdrop-blur-sm flex items-center justify-center">
      {/* close popup */}
      <div
        className="h-full w-full absolute top-0"
        onClick={() => setIsPopup(false)}
      ></div>

      <div className="flex flex-col gap-2 p-4 bg-primary rounded-md w-10/12 max-w-md min-h-40 max-h-[500px] z-[2] overflow-scroll">
        <div className="border-b pb-2 flex justify-between items-center">
          <p className="text-lg font-semibold">
            {variant === "song-info" ? "Song Info" : "Add to Playlist"}
          </p>
          <button
            type="button"
            title="close"
            className="bg-action p-1 rounded-lg"
            onClick={() => setIsPopup(false)}
          >
            <CrossIcon className="w-4 h-4" />
          </button>
        </div>
        {!isLoading ? (
          variant === "song-info" ? (
            <div>
              {songData?.data.map((song) => (
                <div key={song.id} className="flex flex-col gap-2">
                  <p>Song Title: {song.name}</p>
                  <p>ReleaseAt: {song.releaseDate} </p>
                  <p>Language: {song.language} </p>
                  <p>Lable: {song.label}</p>
                  <p>Copyright: {song.copyright}</p>
                  <div className="border-t pt-2 flex flex-col gap-2">
                    <p>Artists info:</p>
                    {song.artists.all.map((artist, index) => (
                      <div key={index}>
                        <Link
                          href={urlSlug(artist.name, artist.id)}
                          className="underline underline-offset-4"
                        >
                          {artist.name}
                        </Link>
                        <small className="text-neutral-400 pl-1">
                          {artist.role}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : // add to playlist
          !isAddNewPlaylist ? (
            <div className="flex flex-col gap-2">
              <div className="flex justify-end items-center">
                <button
                  type="button"
                  title="create new"
                  onClick={() => setIsAddNewPlaylist(true)}
                  className="bg-neutral-800 w-fit text-primary rounded-lg p-1.5 px-2"
                >
                  {`+ Create New`}
                </button>
              </div>

              <p className="text-lg">Select Playlist</p>
              <div className="flex flex-col gap-1">
                {playlists.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name={item.title}
                      className="w-4 h-4 accent-action cursor-pointer"
                    />
                    {item.title}
                  </label>
                ))}
              </div>

              <button
                type="button"
                title="save"
                className="bg-neutral-800 w-full mt-2 text-primary rounded-lg p-1.5 border hover:bg-action"
              >
                Save
              </button>
            </div>
          ) : null
        ) : (
          <Loading loadingText="Loading" />
        )}

        {isAddNewPlaylist ? (
          <form className="flex flex-col gap-2">
            <Input
              type="text"
              name="title"
              label="Playlist Title"
              minLength={3}
              required
            />
            <label className="flex flex-col gap-2">
              Visibility
              <select
                name="visibility"
                className="bg-secondary p-2 px-3 rounded-lg cursor-pointer focus:ring-1 focus:ring-inset focus-visible:outline-none"
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </label>

            <button
              type="submit"
              title="create"
              className="bg-neutral-800 w-full mt-2 text-primary rounded-lg p-1.5 border hover:bg-action"
            >
              Create
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default Popup;
