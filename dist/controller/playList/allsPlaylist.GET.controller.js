"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allsPlaylist = void 0;
const playlist_service_1 = require("../../services/playlists/playlist.service");
const allsPlaylist = async (req, res) => {
    try {
        const { page, take, order } = req.query;
        if (!page || !take || !order) {
            return res.status(400).json({
                success: false,
                message: "page, take, and order are mandatory query parameters",
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
        const result = await playlist_service_1.PlaylistService.getAll(req);
        return res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("Error fetching playlists:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: [],
        });
    }
};
exports.allsPlaylist = allsPlaylist;
