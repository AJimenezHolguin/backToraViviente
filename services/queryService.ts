import { Request } from "express";
import { Model, FilterQuery } from "mongoose";
import { PaginatedResult, OrderDirection } from "../types/pagination";
import { buildMetadata } from "../utils/pagination.utils";

export interface MongoQueryOptions<T> {
  defaultSortField?: keyof T;
  userId?: string;
  userField?: string;
  filters?: (query: FilterQuery<T>, req: Request) => FilterQuery<T>;
  populate?: any[];
}



export class QueryService {
  static async executeQuery<T>(
    req: Request,
    model: Model<T>,
    options: MongoQueryOptions<T>
  ): Promise<PaginatedResult<T>> {
    
    const page = Number(req.query.page) || 1;
    const take = Number(req.query.take) || 10;

    const order: OrderDirection = req.query.order === "DESC" ? "DESC" : "ASC";

    const sortBy =
      (req.query.sortBy as keyof T) ||
      options.defaultSortField ||
      ("createdAt" as keyof T);

      let query: FilterQuery<T> = {};

      const shouldFilterByUser = options.userId && options.userField;

if (shouldFilterByUser) {
  (query as any)[options.userField!] = options.userId;
}
    const search = (req.query.search as string) || "";
    const skip = (page - 1) * take;

    if (options.userId) {
      const field = options.userField || "user";
      (query as any)[field] = options.userId;
    }

    if (options.filters) {
      query = options.filters(query, req);
    }

    const total = await model.countDocuments(query);

    let mongoQuery = model
      .find(query)
      .sort({ [String(sortBy)]: order === "ASC" ? 1 : -1 })
      .skip(skip)
      .limit(take);

    if (options.populate) {
      options.populate.forEach((pop) => {
        mongoQuery = mongoQuery.populate(pop);
      });
    }

    const documents = await mongoQuery;

    const data = documents.map((item: any) => item.toObject());

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
