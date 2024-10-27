import { auth } from "@/auth";
import Card from "@/components/Card";
import ImageWithFallback from "@/components/ImageWithFallback";
import LoginLogout from "@/components/LoginLogout";
import {
  getUserAllPlaylist,
  getUserInfo,
  getUserPublicPlaylists,
} from "@/utils/api";
import Link from "next/link";
import LoginIcon from "@/public/icons/login.svg";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Profile • Okv-Tunes",
};

const Profile = async () => {
  const session = await auth();
  const userId = session?.user?.id ?? "";
  const authCookiesName =
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token";
  const authToken = cookies().get(authCookiesName)?.value;
  const userInfo = authToken ? await getUserInfo({ userId, authToken }) : null;
  const userPlaylists = authToken
    ? await getUserAllPlaylist({ userId, authToken })
    : [];
  const publicPlaylists = authToken
    ? await getUserPublicPlaylists({ authToken })
    : [];

  const userImg = session?.user?.image || userInfo?.image;

  const urlSlug = (title: string, id: string, type: "public" | "private") =>
    `/playlist/user-playlist/${encodeURIComponent(
      title.replaceAll(" ", "-").toLowerCase()
    )}-${id}?type=${type}`;

  return (
    <div className="inner-container flex flex-col gap-6 ">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center relative">
        <div className="absolute -top-4 right-0">
          <LoginLogout session={session} />
        </div>
        <div className=" w-24 h-24 sm:w-[150px] sm:h-[150px]">
          {userImg ? (
            <ImageWithFallback
              src={userImg}
              alt="user"
              width={150}
              height={150}
              className="w-full h-full object-cover rounded-full shadow-lg shadow-neutral-700"
            />
          ) : (
            <p className="uppercase bg-action text-primary rounded-full h-full w-full flex justify-center items-center text-[50px] sm:text-[80px] font-bold">
              {userInfo ? userInfo?.name?.at(0) : "G"}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="capitalize text-xl font-bold text-center sm:text-start">
            {userInfo?.name ?? "Guest"}
          </h1>

          <p className="text-neutral-300 text-center sm:text-start">
            {userInfo?.email}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t py-2">
        <h2 className="capitalize text-xl font-bold  sm:text-start">
          Your Save Playlist
        </h2>
        {session ? (
          <>
            <div className="flex items-center gap-4 overflow-x-auto">
              <Card
                id={"1"}
                title={"Liked Songs"}
                type="user"
                link="/playlist/liked-songs"
              />

              {userPlaylists?.map((playlist) => (
                <Card
                  key={playlist._id}
                  id={playlist._id}
                  title={playlist.title}
                  type="user"
                  link={urlSlug(playlist.title, playlist._id, "private")}
                />
              ))}
            </div>
            {publicPlaylists && publicPlaylists.length > 0 ? (
              <div className="flex flex-col gap-4 border-t py-2">
                <h2 className="capitalize text-xl font-bold  sm:text-start">
                  Public Playlists
                </h2>
                <div className="flex items-center gap-4 overflow-x-auto">
                  {publicPlaylists.map((playlist) => (
                    <Card
                      key={playlist._id}
                      id={playlist._id}
                      title={playlist.title}
                      type="user"
                      link={urlSlug(playlist.title, playlist._id, "public")}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
            <p className="text-neutral-400 text-sm">
              Your liked and playlist songs will be displayed here. Please Login
              to see them appear.
            </p>
            <Link
              href={"/login"}
              title="login"
              className="flex items-center gap-2 text-xs bg-neutral-800 h-10 hover:bg-secondary hover:border p-2 px-3 rounded-lg"
            >
              <LoginIcon className="w-6 h-6" /> Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
