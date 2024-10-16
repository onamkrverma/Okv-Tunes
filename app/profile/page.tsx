import SongsCollection from "@/components/SongsCollection";
import { getLikedSongs, getSongs, getUserInfo } from "@/utils/api";
import { auth } from "@/auth";
import LoginLogout from "@/components/LoginLogout";
import Link from "next/link";
import LoginIcon from "@/public/icons/login.svg";
import ImageWithFallback from "@/components/ImageWithFallback";

const Profile = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const userInfo = userId ? await getUserInfo({ userId }) : null;
  const likedSongsIds = userId ? await getLikedSongs({ userId }) : [];

  const likedSongs = (await getSongs({ id: likedSongsIds })).data;

  const userImg = session?.user?.image || userInfo?.image;

  return (
    <div className="inner-container flex flex-col gap-6 ">
      <div className="flex gap-4 flex-col flex-wrap sm:flex-row items-center relative">
        <div className="absolute -top-4 right-0">
          <LoginLogout session={session} />
        </div>
        <div className=" w-24 h-24 sm:w-[150px] sm:h-[150px]">
          {userImg ? (
            <ImageWithFallback
              id={userId ? userId : undefined}
              src={userImg}
              alt="user"
              width={150}
              height={150}
              className="w-full h-full object-cover rounded-full shadow-lg shadow-neutral-700"
            />
          ) : (
            <p className="uppercase bg-action text-primary rounded-full h-full w-full flex justify-center items-center text-[80px] sm:text-[120px] font-bold">
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
