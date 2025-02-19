const mainServerUrl = process.env.MAIN_SERVER_URL;

export const searchSongs = async (
  _: unknown,
  arg: { query: string; limit?: number }
) => {
  try {
    const response = await fetch(
      `${mainServerUrl}/api/search/songs?query=${arg.query}&limit=${
        arg.limit ?? 10
      }`
    );
    const data = await response.json();
    if (!data.success) {
      throw new Error("No songs found for this query");
    }
    return data.data.results;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Internal server error");
    }
  }
};

export const getSongsById = async (_: unknown, arg: { id: string[] }) => {
  try {
    const response = await fetch(
      `${mainServerUrl}/api/songs/${arg.id.join(",")}`
    );
    const data = await response.json();
    if (!data.success) {
      throw new Error("No songs found for the given ID(s)");
    }
    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Internal server error");
    }
  }
};

export const getSuggestedSongs = async (
  _: unknown,
  arg: { id: string; limit?: number }
) => {
  try {
    const res = await fetch(
      `${mainServerUrl}/api/songs/${arg.id}/suggestions?limit=${
        arg.limit ?? 10
      }`
    );
    const data = await res.json();
    if (!data.success) {
      throw new Error("No suggestions found for the given song");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Internal server error");
    }
  }
};
