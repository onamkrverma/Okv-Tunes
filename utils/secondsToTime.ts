const secondsToTime = (time: number) => {
  var h = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0"),
    m = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0"),
    s = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

  return h === "00" ? `${m}:${s}` : `${h}:${m}:${s}`;
};

export default secondsToTime;
