"use strict";
// import { NextFunction, Request, Response } from "express";
// import mongoose, { Model } from "mongoose";
// import songsModel from "../models/songs.model";
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
        const search = req.query.search || "";
        const skip = (page - 1) * take;
        const query = {};
        if (options.userId) {
            query.user = options.userId;
        }
        if (search && options.searchFields?.length) {
            query.$or = options.searchFields.map((field) => ({
                [field]: { $regex: search, $options: "i" },
            }));
        }
        const total = await model.countDocuments(query);
        const data = await model
            .find(query)
            .sort({ [String(sortBy)]: order === "ASC" ? 1 : -1 })
            .skip(skip)
            .limit(take);
        return {
            data,
            metadata: (0, pagination_utils_1.buildMetadata)(page, take, total, order, sortBy, search),
        };
    }
}
exports.QueryService = QueryService;
