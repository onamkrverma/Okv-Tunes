import React from "react";
type Props = {
  params: { slug: string };
};

const PlaylistSongs = async ({ params }: Props) => {
  const id = params.slug.split("-").pop() as string;

  return (
    <div className="page-container flex flex-col gap-6">
      PlaylistSongs {id}{" "}
    </div>
  );
};

export default PlaylistSongs;
