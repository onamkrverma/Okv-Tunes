"use client";
import { getSongs } from "@/utils/api";
import React from "react";
import useSWR from "swr";
import CrossIcon from "@/public/icons/cross.svg";
import Link from "next/link";
import Loading from "../Loading";

type Props = {
  isPopup: boolean;
  setIsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  songId: string;
};
const Popup = ({ isPopup, setIsPopup, songId }: Props) => {
  const dataFetcher = () => getSongs({ id: songId });
  const { data: songData, isLoading } = useSWR(
    isPopup ? "/song-info" : null,
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
          <p className="text-lg font-semibold">Song Info</p>
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
          songData?.data.map((song) => (
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
          ))
        ) : (
          <Loading loadingText="Loading" />
        )}
      </div>
    </div>
  );
};

export default Popup;
