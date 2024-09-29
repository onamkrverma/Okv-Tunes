"use client";
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
};

type TGlobalState = {
  currentSong: TCurrentSong;
  likedSongs: string[];
};
const defaultState: TGlobalState = {
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
  likedSongs: [],
};
type TGlobalContext = {
  currentSong: TCurrentSong;
  likedSongs: string[];
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

  useEffect(() => {
    const localCurrentSongInfo = localStorage.getItem("currentSong");
    const localLikedSongs = localStorage.getItem("likedSongs");

    const currentSongInfo: TCurrentSong = localCurrentSongInfo
      ? JSON.parse(localCurrentSongInfo ?? "{}")
      : defaultState.currentSong;

    const likedSongs: string[] = localLikedSongs
      ? JSON.parse(localLikedSongs)
      : defaultState.likedSongs;

    localCurrentSongInfo || localLikedSongs
      ? setGlobalState({
          currentSong: currentSongInfo,
          likedSongs: likedSongs,
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
