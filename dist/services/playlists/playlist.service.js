"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistService = void 0;
const queryService_1 = require("../queryService");
const playlistSearch_helper_1 = require("../../utils/helpers/playlistSearch.helper");
const playList_model_1 = __importDefault(require("../../models/playList.model"));
class PlaylistService {
    //
    static async getAll(req) {
        return await queryService_1.QueryService.executeQuery(req, playList_model_1.default, {
            defaultSortField: "createdAt",
            populate: [
                { path: "songs" },
                {
                    path: "createdBy",
                    match: { isActive: true },
                    select: "name email"
                }
            ],
            filters: (query, req) => {
                return (0, playlistSearch_helper_1.applyPlaylistSearch)(query, req.query.search);
            },
        });
    }
    static async getByUser(req, userId) {
        return await queryService_1.QueryService.executeQuery(req, playList_model_1.default, {
            defaultSortField: "createdAt",
            userId,
            userField: "createdBy",
            populate: [{ path: "songs" }, { path: "createdBy", select: "name" }],
            filters: (query, req) => {
                return (0, playlistSearch_helper_1.applyPlaylistSearch)(query, req.query.search);
            },
        });
    }
}
exports.PlaylistService = PlaylistService;
