"use client";
import { getLikedSongs } from "@/utils/api";
import ls from "localstorage-slim";
import { Session } from "next-auth";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type TCurrentSong = {
  id: string;
  title: string;
  imageUrl: string;
  artist: string;
  audioUrl: string;
  isMaximise: boolean;
  isRefetchSuggestion: boolean;
  volume?: number;
  suggessionSongIds?: string[];
};

type TAlertMessage = {
  isAlertVisible: boolean;
  message: string;
};

type TGlobalState = {
  currentSong: TCurrentSong;
  likedSongsIds: string[];
  alertMessage?: TAlertMessage;
  authToken?: string;
  session?: Session | null;
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
  alertMessage: {
    isAlertVisible: false,
    message: "",
  },
  authToken: "",
  session: null,
};
type TGlobalContext = {
  currentSong: TCurrentSong;
  likedSongsIds: string[];
  alertMessage?: TAlertMessage;
  authToken?: string;
  session?: Session | null;
  setGlobalState: React.Dispatch<React.SetStateAction<TGlobalState>>;
};

type TGlobalProviderProps = {
  children: ReactNode;
  value?: TGlobalState;
  authToken?: string;
};

export const GlobalContext = createContext<TGlobalContext | null>(null);

export const GlobalContextProvider = ({
  children,
  value,
  authToken,
}: TGlobalProviderProps) => {
  const [globalState, setGlobalState] = useState(value || defaultState);

  const getUserSession = async () => {
    const res = await fetch(
      `/api/auth/session?timestamp=${new Date().getTime()}`
    );

    const session: Session | null = await res.json();
    setGlobalState((prev) => ({
      ...prev,
      session: session,
    }));
    if (!authToken) return;
    const likedSongsIds = await getLikedSongs({
      authToken: authToken,
    });

    if (!likedSongsIds) return;
    setGlobalState((prev) => ({
      ...prev,
      likedSongsIds: likedSongsIds,
      authToken: authToken,
    }));
  };

  useEffect(() => {
    getUserSession();
  }, []);

  useEffect(() => {
    const localCurrentSongInfo: TCurrentSong | null = ls.get("currentSong", {
      decrypt: true,
    });
    const currentSongInfo: TCurrentSong = localCurrentSongInfo
      ? localCurrentSongInfo
      : defaultState.currentSong;

    localCurrentSongInfo
      ? setGlobalState({
          currentSong: currentSongInfo,
          likedSongsIds: [],
          alertMessage: defaultState.alertMessage,
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
