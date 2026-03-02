import { Request } from "express";
import { SupabaseClient } from "@supabase/supabase-js";
import { PaginatedResult, OrderDirection } from "../types/pagination";
import { buildMetadata } from "../utils/pagination.utils";
import { SupabaseQueryOptions } from "../types/supabaseQueryServiceOptions";

export class SupabaseQueryService {
  static async executeQuery<T>(
    req: Request,
    supabase: SupabaseClient,
    options: SupabaseQueryOptions
  ): Promise<PaginatedResult<T>> {
    const page = Number(req.query.page) || 1;
    const take = Number(req.query.take) || 10;

    const order: OrderDirection = req.query.order === "ASC" ? "ASC" : "DESC";

    const sortBy =
      (req.query.sortBy as string) || options.defaultSortField || "created_at";

    const search = (req.query.search as string) || "";
    const skip = (page - 1) * take;
    const ascending = order === "DESC";

    let baseQuery = supabase
      .from(options.table)
      .select("*", { count: "exact", head: true });

    const { count, error: countError } = await baseQuery;
    if (countError) throw countError;

    const total = count || 0;

    let dataQuery = supabase
      .from(options.table)
      .select("*")
      .order(sortBy, { ascending })
      .range(skip, skip + take - 1);

    const { data, error } = await dataQuery;
    if (error) throw error;

    return {
      data: (data || []) as T[],
      metadata: buildMetadata(page, take, total, order, sortBy, search),
    };
  }
}
