import { Request } from "express";
import { Model, FilterQuery } from "mongoose";
import {
  PaginatedResult,
  OrderDirection,
} from "../types/pagination";
import { buildMetadata } from "../utils/pagination.utils";

export interface MongoQueryOptions<T> {
  searchFields?: (keyof T)[];
  defaultSortField?: keyof T;
  userId?: string;
}

export class QueryService {
  static async executeQuery<T>(
    req: Request,
    model: Model<T>,
    options: MongoQueryOptions<T>
  ): Promise<PaginatedResult<T>> {

    const page = Number(req.query.page) || 1;
    const take = Number(req.query.take) || 10;

    const order: OrderDirection =
      req.query.order === "DESC" ? "DESC" : "ASC";

    const sortBy =
      (req.query.sortBy as keyof T) ||
      options.defaultSortField ||
      ("createdAt" as keyof T);

    const search = (req.query.search as string) || "";
    const skip = (page - 1) * take;

    const query: FilterQuery<T> = {};

    if (options.userId) {
      (query as any).user = options.userId;
    }

    if (search && options.searchFields?.length) {
      query.$or = options.searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })) as any;
    }

    const total = await model.countDocuments(query);

    const documents = await model
  .find(query)
  .sort({ [String(sortBy)]: order === "ASC" ? 1 : -1 })
  .skip(skip)
  .limit(take)
  .populate({
    path: "user",
    select: "name",
  });

const data = documents.map((item: any) => {
  const obj = item.toObject();

  return {
    ...obj,
    userName: item.user?.name,
    user: undefined,
  };
});
   
    return {
      data,
      metadata: buildMetadata(
        page,
        take,
        total,
        order,
        sortBy as string,
        search
      ),
    };
  }
}