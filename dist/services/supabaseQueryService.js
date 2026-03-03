"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseQueryService = void 0;
const pagination_utils_1 = require("../utils/pagination.utils");
class SupabaseQueryService {
    static async executeQuery(req, supabase, options) {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const order = req.query.order === "ASC" ? "ASC" : "DESC";
        const sortBy = req.query.sortBy || options.defaultSortField || "created_at";
        const search = req.query.search || "";
        const skip = (page - 1) * take;
        const ascending = order === "DESC";
        let baseQuery = supabase
            .from(options.table)
            .select("*", { count: "exact", head: true });
        const { count, error: countError } = await baseQuery;
        if (countError)
            throw countError;
        const total = count || 0;
        let dataQuery = supabase
            .from(options.table)
            .select("*")
            .order(sortBy, { ascending })
            .range(skip, skip + take - 1);
        const { data, error } = await dataQuery;
        if (error)
            throw error;
        return {
            data: (data || []),
            metadata: (0, pagination_utils_1.buildMetadata)(page, take, total, order, sortBy, search),
        };
    }
}
exports.SupabaseQueryService = SupabaseQueryService;
