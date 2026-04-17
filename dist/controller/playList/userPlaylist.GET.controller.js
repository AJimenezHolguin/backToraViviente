"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPlaylist = void 0;
const playlist_service_1 = require("../../services/playlists/playlist.service");
const userPlaylist = async (req, res) => {
    try {
        const userId = req.user ? req.user._id : null;
        const { page, take, order } = req.query;
        if (page === undefined || take === undefined || order === undefined) {
            return res.status(400).json({
                success: false,
                message: "page, take, and order are mandatory query parameters",
                data: [],
            });
        }
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication required",
                data: [],
            });
        }
        const pageNum = Number(page);
        const takeNum = Number(take);
        const orderStr = String(order).toUpperCase();
        if (isNaN(pageNum) ||
            isNaN(takeNum) ||
            pageNum < 1 ||
            takeNum < 1 ||
            (orderStr !== "ASC" && orderStr !== "DESC")) {
            return res.status(400).json({
                success: false,
                message: "Invalid page, take, or order parameters",
                data: [],
            });
        }
        const result = await playlist_service_1.PlaylistService.getByUser(req, userId);
        return res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("Error fetching user playlists:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
            data: [],
        });
    }
};
exports.userPlaylist = userPlaylist;
