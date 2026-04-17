"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryService = void 0;
const pagination_utils_1 = require("../utils/pagination.utils");
class QueryService {
    static async executeQuery(req, model, options) {
        const page = Number(req.query.page) || 1;
        const take = Number(req.query.take) || 10;
        const order = req.query.order === "DESC" ? "DESC" : "ASC";
        const sortBy = req.query.sortBy ||
            options.defaultSortField ||
            "createdAt";
        let query = {};
        const shouldFilterByUser = options.userId && options.userField;
        if (shouldFilterByUser) {
            query[options.userField] = options.userId;
        }
        const search = req.query.search || "";
        const skip = (page - 1) * take;
        if (options.userId) {
            const field = options.userField || "user";
            query[field] = options.userId;
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
        const data = documents.map((item) => item.toObject());
        return {
            data,
            metadata: (0, pagination_utils_1.buildMetadata)(page, take, total, order, sortBy, search),
        };
    }
}
exports.QueryService = QueryService;
