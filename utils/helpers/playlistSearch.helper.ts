import { FilterQuery } from "mongoose";
import { IPlaylist } from "../../models/playList.model";

export const applyPlaylistSearch = (
  query: FilterQuery<IPlaylist>,
  search?: string
): FilterQuery<IPlaylist> => {
  if (!search) return query;

  return {
    ...query,
    $or: [
      { name: { $regex: search, $options: "i" } },
    ],
  };
};