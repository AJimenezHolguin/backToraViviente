import { Request, Response } from 'express';
import Playlist, { IPlaylist } from '../../models/playList.model';
import mongoose from 'mongoose';

export const deletePlaylist = async (req: Request, res: Response) => {
    try {
        // Extract playlist ID from request parameters
        const { playlistId } = req.params;

        // Extract user ID from authenticated request
        const userId = req.user ? (req.user as any)._id : null;

        // Validate user authentication
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
                data: null
            });
        }

        // Validate playlist ID
        if (!mongoose.Types.ObjectId.isValid(playlistId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid playlist ID',
                data: null
            });
        }

        // Find the existing playlist
        const existingPlaylist = await Playlist.findById(playlistId);

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
        const deletedPlaylist = await Playlist.findByIdAndDelete(playlistId);

        // Return success response
        res.status(200).json({
            success: true,
            data: deletedPlaylist,
            message: 'Playlist deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        });
    }
};
