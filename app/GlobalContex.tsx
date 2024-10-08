"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Session } from "next-auth";
import { getLikedSongs } from "@/utils/api";

type TCurrentSong = {
  id: string;
  title: string;
  imageUrl: string;
  artist: string;
  audioUrl: string;
  isMaximise: boolean;
  isRefetchSuggestion: boolean;
  volume?: number;
};

type TGlobalState = {
  currentSong: TCurrentSong;
  likedSongsIds: string[];
  session: Session | null;
};
export const defaultState: TGlobalState = {
  currentSong: {
    id: "",
    title: "",
    imageUrl: "",
    artist: "",
    audioUrl: "",
    isMaximise: false,
    isRefetchSuggestion: false,
    volume: 1.0,
  },
  likedSongsIds: [],
  session: null,
};
type TGlobalContext = {
  currentSong: TCurrentSong;
  likedSongsIds: string[];
  session: Session | null;
  setGlobalState: React.Dispatch<React.SetStateAction<TGlobalState>>;
};

type TGlobalProviderProps = {
  children: ReactNode;
  value?: TGlobalState;
};

export const GlobalContext = createContext<TGlobalContext | null>(null);

export const GlobalContextProvider = ({
  children,
  value,
}: TGlobalProviderProps) => {
  const [globalState, setGlobalState] = useState(value || defaultState);

  const getUserSession = async () => {
    const response = await fetch(
      `/api/auth/session?timestamp=${new Date().getTime()}`
    );
    const session: Session | null = await response.json();
    if (session) {
      const likedSongsIds = await getLikedSongs({ id: session.user?.id });
      setGlobalState((prev) => ({
        ...prev,
        likedSongsIds: likedSongsIds,
      }));
    }

    setGlobalState((prev) => ({
      ...prev,
      session: session,
    }));
  };

  useEffect(() => {
    getUserSession();
  }, []);

  useEffect(() => {
    const localCurrentSongInfo = localStorage.getItem("currentSong");

    const currentSongInfo: TCurrentSong = localCurrentSongInfo
      ? JSON.parse(localCurrentSongInfo ?? "{}")
      : defaultState.currentSong;

    localCurrentSongInfo
      ? setGlobalState({
          currentSong: currentSongInfo,
          likedSongsIds: [],
          session: null,
        })
      : null;
  }, []);

  return (
    <GlobalContext.Provider value={{ ...globalState, setGlobalState }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === null) {
    throw new Error("Something went wrong!");
  }
  return context;
};
