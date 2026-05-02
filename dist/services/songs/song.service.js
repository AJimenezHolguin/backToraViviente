"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongService = void 0;
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const songSearch_helper_1 = require("../../utils/helpers/songSearch.helper");
const queryService_1 = require("../queryService");
class SongService {
    static async getAll(req) {
        const result = await queryService_1.QueryService.executeQuery(req, songs_model_1.default, {
            defaultSortField: "name",
            populate: [
                {
                    path: "user",
                    match: { isActive: true },
                    select: "name"
                }
            ],
            filters: (query, req) => {
                return (0, songSearch_helper_1.applySongSearch)(query, req.query.search);
            },
        });
        return {
            ...result,
            data: result.data.map((song) => ({
                ...song,
                userName: song.user?.name || "N/A",
                user: undefined,
            })),
        };
    }
    static async getByUser(req, userId) {
        const result = await queryService_1.QueryService.executeQuery(req, songs_model_1.default, {
            defaultSortField: "name",
            userId,
            userField: "user",
            populate: [{ path: "user", select: "name" }],
            filters: (query, req) => {
                return (0, songSearch_helper_1.applySongSearch)(query, req.query.search);
            },
        });
        return {
            ...result,
            data: result.data.map((song) => ({
                ...song,
                userName: song.user?.name || "N/A",
                user: undefined,
            })),
        };
    }
}
exports.SongService = SongService;
