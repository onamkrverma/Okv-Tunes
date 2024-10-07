import SongsCollection from "@/components/SongsCollection";
import { getLikedSongs, getSongs, getUserInfo } from "@/utils/api";
import { auth } from "@/auth";
import LoginLogout from "@/components/LoginLogout";
import Link from "next/link";
import LogoutIcon from "@/public/icons/logout.svg";
import ImageWithFallback from "@/components/ImageWithFallback";
import RefreshIcon from "@/public/icons/refresh.svg";

const LikedSongs = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const userInfo = userId ? await getUserInfo({ id: userId }) : null;
  const likedSongsIds = userId ? await getLikedSongs({ id: userId }) : [];

  const likedSongs = (await getSongs({ id: likedSongsIds })).data;

  return (
    <div className="inner-container flex flex-col gap-6 ">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center relative">
        <div className="absolute -top-4 right-1">
          <LoginLogout session={session} />
        </div>
        <div className="w-[200px] h-[200px]">
          {userInfo?.image ? (
            <ImageWithFallback
              id={userInfo._id}
              src={userInfo.image}
              alt="user"
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-full shadow-lg shadow-neutral-700"
            />
          ) : (
            <p className="uppercase bg-action text-primary rounded-full p-1 h-full w-full flex justify-center items-center text-[150px] font-bold">
              {userInfo ? userInfo?.name?.at(0) : "G"}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <h1 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            {userInfo?.name ?? "Guest"}
          </h1>

          <p className="text-neutral-300 text-center sm:text-start">
            {userInfo?.email}
          </p>
          <small className="text-neutral-300 text-center sm:text-start">
            Total Liked Songs: {likedSongsIds.length}
          </small>
        </div>
      </div>
      <div className="flex flex-col gap-4 border-t py-2">
        <div className="flex justify-between items-center">
          <h2 className="capitalize text-xl sm:text-2xl font-bold text-center sm:text-start">
            Your Liked Songs
          </h2>
          {/* <button className="flex items-center gap-1 text-sm bg-neutral-800 p-1 px-2 rounded-md">
            <RefreshIcon className="w-4 h-4" /> Refresh
          </button> */}
        </div>
        {session ? (
          likedSongsIds.length > 0 ? (
            likedSongs.map((song) => (
              <SongsCollection key={song.id} song={song} />
            ))
          ) : (
            <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
              <p className="text-lg font-bold">Liked Song Not Found</p>
              <p className="text-neutral-400 text-sm">
                Your liked songs will be displayed here. Please like any songs
                to see them appear.
              </p>
            </div>
          )
        ) : (
          <div className="text-center flex flex-col items-center justify-center gap-2 min-h-40">
            <p className="text-neutral-400 text-sm">
              Your liked songs will be displayed here. Please Login to see them
              appear.
            </p>
            <Link
              href={"/login"}
              title="login"
              className="flex items-center gap-2 text-xs bg-neutral-800 hover:bg-secondary hover:border p-2 px-3 rounded-lg"
            >
              <LogoutIcon className="w-6 h-6 rotate-180" /> Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedSongs;
