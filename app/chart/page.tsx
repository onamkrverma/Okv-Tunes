import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import { topChartPlaylists } from "@/utils/playlists";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Top Trending Songs • Okv-Tunes",
};

export const dynamic = "force-static";
export const revalidate = 31104000;

const Chart = () => {
  return (
    <div className="inner-container flex flex-col gap-6">
      <BackButton />

      <h2 className="text-lg sm:text-2xl font-semibold truncate">
        Featured Charts
      </h2>
      <div className="max-[426px]:grid grid-cols-2 gap-4 flex flex-wrap items-center">
        {topChartPlaylists.map((item) => (
          <Card key={item.id} id={item.id} title={item.title} type="playlist" />
        ))}
      </div>
    </div>
  );
};

export default Chart;
