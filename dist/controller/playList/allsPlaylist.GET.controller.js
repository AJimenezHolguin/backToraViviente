"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allsPlaylist = void 0;
const playList_model_1 = __importDefault(require("../../models/playList.model"));
const allsPlaylist = async (req, res) => {
    try {
        const { page, take, order, search = '', sortBy = 'createdAt' } = req.query;
        if (!page || !take || !order) {
            return res.status(400).json({
                success: false,
                message: 'page, take, and order are mandatory query parameters',
                data: []
            });
        }
        const pageNum = Number(page);
        const takeNum = Number(take);
        const orderStr = String(order).toUpperCase();
        if (isNaN(pageNum) ||
            isNaN(takeNum) ||
            pageNum < 1 ||
            takeNum < 1 ||
            (orderStr !== 'ASC' && orderStr !== 'DESC')) {
            return res.status(400).json({
                success: false,
                message: 'Invalid page, take, or order parameters',
                data: []
            });
        }
        const searchQuery = {};
        if (search) {
            searchQuery.name = { $regex: search, $options: 'i' };
        }
        const skip = (pageNum - 1) * takeNum;
        const sortDirection = orderStr === 'ASC' ? 1 : -1;
        const playlists = await playList_model_1.default.find(searchQuery)
            .sort({ [sortBy || 'createdAt']: sortDirection })
            .skip(skip)
            .limit(takeNum)
            .populate({
            path: 'songs',
            select: '_id name fileSong fileScore linkSong category'
        })
            .populate({
            path: 'createdBy',
            select: '_id name'
        });
        const transformedPlaylists = playlists.map(playlist => {
            const playlistObject = playlist.toObject();
            const createdBy = playlistObject.createdBy && playlistObject.createdBy._id
                ? {
                    _id: String(playlistObject.createdBy._id),
                    name: String(playlistObject.createdBy.name ?? '')
                }
                : null;
            const songs = (playlistObject.songs || [])
                .filter((song) => song && song._id)
                .map((song) => ({
                _id: String(song._id),
                title: song.name,
                fileSong: song.fileSong,
                fileScore: song.fileScore,
                linkSong: song.linkSong,
                category: song.category
            }));
            return {
                _id: String(playlistObject._id),
                name: playlistObject.name,
                createdBy,
                songs,
                status: playlistObject.status,
                createdAt: playlistObject.createdAt,
                updatedAt: playlistObject.updatedAt,
                __v: playlistObject.__v
            };
        });
        const total = await playList_model_1.default.countDocuments(searchQuery);
        const pageCount = Math.ceil(total / takeNum);
        return res.status(200).json({
            success: true,
            data: transformedPlaylists,
            metadata: {
                page: pageNum,
                take: takeNum,
                total,
                pageCount,
                hasPreviousPage: pageNum > 1,
                hasNextPage: pageNum < pageCount,
                order: orderStr,
                sortBy,
                search
            }
        });
    }
    catch (error) {
        console.error('Error fetching playlists:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: []
        });
    }
};
exports.allsPlaylist = allsPlaylist;
