"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePlaylist = void 0;
const playList_model_1 = __importDefault(require("../../models/playList.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const deletePlaylist = async (req, res) => {
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
                message: 'You are not authorized to delete this playlist',
                data: null
            });
        }
        // Perform the deletion
        const deletedPlaylist = await playList_model_1.default.findByIdAndDelete(playlistId);
        // Return success response
        res.status(200).json({
            success: true,
            data: deletedPlaylist,
            message: 'Playlist deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        });
    }
};
exports.deletePlaylist = deletePlaylist;
