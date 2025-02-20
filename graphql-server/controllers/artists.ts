const mainServerUrl = process.env.MAIN_SERVER_URL;

export const getArtist = async (
  _: unknown,
  arg: { id: string; limit?: number }
) => {
  try {
    const res = await fetch(
      `${mainServerUrl}/api/artists/${arg.id}?songCount=${
        arg.limit ?? 10
      }&albumCount=1`
    );
    const data = await res.json();
    if (!data.success) {
      throw new Error("No Artist found for the given id");
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Internal server error");
    }
  }
};

export const searchArtists = async (
  _: unknown,
  arg: { query: string; limit?: number }
) => {
  try {
    const response = await fetch(
      `${mainServerUrl}/api/search/artists?query=${arg.query}&limit=${
        arg.limit ?? 10
      }`
    );
    const data = await response.json();
    if (!data.success) {
      throw new Error("No artists found for this query");
    }
    return data.data.results;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || "Internal server error");
    }
  }
};
