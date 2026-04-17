import { FilterQuery } from "mongoose";

export const applySongSearch = <T>(
  query: FilterQuery<T>,
  search?: string
): FilterQuery<T> => {
  if (!search) return query;

  return {
    ...query,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ],
  };
};
