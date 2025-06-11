"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlaylist = void 0;
const playList_model_1 = __importDefault(require("../../models/playList.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const updatePlaylist = async (req, res) => {
    try {
        // Extract playlist ID from request parameters
        const { playlistId } = req.params;
        // Extract user ID from authenticated request
        const userId = req.user ? req.user._id : null;
        // Validate user authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
                data: null
            });
        }
        // Validate playlist ID
        if (!mongoose_1.default.Types.ObjectId.isValid(playlistId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid playlist ID',
                data: null
            });
        }
        // Find the existing playlist
        const existingPlaylist = await playList_model_1.default.findById(playlistId);
        // Check if playlist exists
        if (!existingPlaylist) {
            return res.status(404).json({
                success: false,
                message: 'Playlist not found',
                data: null
            });
        }
        // Check if the user is the creator of the playlist
        if (!existingPlaylist.createdBy.equals(userId)) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this playlist',
                data: null
            });
        }
        // Extract updatable fields from request body
        const { name, songs, status } = req.body;
        // Validate songs if provided
        let validatedSongs;
        if (songs) {
            // Validate that all song IDs are valid
            const invalidSongs = songs.filter((songId) => !mongoose_1.default.Types.ObjectId.isValid(songId));
            if (invalidSongs.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid song IDs provided',
                    data: null
                });
            }
            validatedSongs = songs.map((songId) => new mongoose_1.default.Types.ObjectId(songId));
        }
        // Prepare update object
        const updateData = {
            ...(name !== undefined && { name }),
            ...(validatedSongs !== undefined && { songs: validatedSongs }),
            ...(status !== undefined && { status }),
            updatedAt: new Date() // Always update the timestamp
        };
        // Perform the update
        const updatedPlaylist = await playList_model_1.default.findByIdAndUpdate(playlistId, updateData, {
            new: true, // Return the updated document
            runValidators: true // Run model validations
        }).populate('createdBy', '_id name')
            .populate('songs', '_id title fileSong fileScore linkSong category');
        // Return the updated playlist
        res.status(200).json({
            success: true,
            data: updatedPlaylist,
            message: 'Playlist updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        });
    }
};
exports.updatePlaylist = updatePlaylist;
