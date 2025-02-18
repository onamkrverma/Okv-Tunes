const mainServerUrl = process.env.MAIN_SERVER_URL;

export const getPlaylist = async (
  _: unknown,
  arg: { id: string; limit?: number }
) => {
  try {
    const res = await fetch(
      `${mainServerUrl}/api/playlists?id=${arg.id}&limit=${arg.limit ?? 10}`
    );
    const data = await res.json();
    if (!data.success) {
      throw new Error("No playlist found for the given id");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Internal server error");
    }
  }
};

export const searchPlaylist = async (
  _: unknown,
  arg: { query: string; limit?: number }
) => {
  try {
    const response = await fetch(
      `${mainServerUrl}/api/search/playlists?query=${arg.query}&limit=${
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
