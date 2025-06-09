"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPlaylist = void 0;
const playList_model_1 = __importDefault(require("../../models/playList.model"));
const userPlaylist = async (req, res) => {
    try {
        // Extract user ID from authenticated request
        const userId = req.user ? req.user._id : null;
        // Destructure query parameters
        const { page, take, order, search = '', sortBy = 'createdAt' } = req.query;
        // Validate that page, take, and order are present and valid
        if (page === undefined ||
            take === undefined ||
            order === undefined) {
            return res.status(400).json({
                success: false,
                message: 'page, take, and order are mandatory query parameters',
                data: []
            });
        }
        // Validate user authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
                data: []
            });
        }
        // Convert to numbers and validate
        const pageNum = Number(page);
        const takeNum = Number(take);
        const orderStr = String(order).toUpperCase();
        // Additional validation
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
        // Prepare search query
        const searchQuery = {
            createdBy: userId // Filter playlists created by the authenticated user
        };
        // Add optional name search
        if (search) {
            searchQuery.name = { $regex: String(search), $options: 'i' };
        }
        // Calculate pagination
        const skip = (pageNum - 1) * takeNum;
        // Determine sort direction
        const sortDirection = orderStr === 'ASC' ? 1 : -1;
        // Fetch playlists with pagination and optional search
        const playlists = await playList_model_1.default.find(searchQuery)
            .sort({ [String(sortBy)]: sortDirection })
            .skip(skip)
            .limit(takeNum)
            .populate({
            path: 'createdBy',
            select: '_id name', // Only select _id and name
            match: { _id: { $exists: true } } // Ensure only populated if createdBy exists
        })
            .populate({
            path: 'songs',
            select: '_id title fileSong fileScore linkSong category' // Select specific song fields
        });
        // Transform playlists to handle null createdBy and populate song details
        const transformedPlaylists = playlists.map(playlist => {
            const playlistObject = playlist.toObject();
            // If createdBy is populated, extract _id and name
            const createdBy = playlistObject.createdBy && playlistObject.createdBy._id
                ? {
                    _id: String(playlistObject.createdBy._id),
                    name: String(playlistObject.createdBy.name || '')
                }
                : null;
            // Transform songs to ensure proper formatting
            const songs = playlistObject.songs.map((song) => ({
                _id: String(song._id),
                title: song.title,
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
        // Count total documents for pagination metadata
        const total = await playList_model_1.default.countDocuments(searchQuery);
        // Calculate page count
        const pageCount = Math.ceil(total / takeNum);
        res.status(200).json({
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
        console.error('Error fetching user playlists:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: []
        });
    }
};
exports.userPlaylist = userPlaylist;
