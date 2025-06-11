import { Request, Response } from 'express';
import Playlist, { IPlaylist } from '../../models/playList.model';
import mongoose from 'mongoose';

export const updatePlaylist = async (req: Request, res: Response) => {
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
                message: 'You are not authorized to update this playlist',
                data: null
            });
        }

        // Extract updatable fields from request body
        const {
            name,
            songs,
            status
        } = req.body;

        // Validate songs if provided
        let validatedSongs: mongoose.Types.ObjectId[] | undefined;
        if (songs) {
            // Validate that all song IDs are valid
            const invalidSongs = songs.filter((songId: string) =>
                !mongoose.Types.ObjectId.isValid(songId)
            );

            if (invalidSongs.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid song IDs provided',
                    data: null
                });
            }

            validatedSongs = songs.map((songId: string) =>
                new mongoose.Types.ObjectId(songId)
            );
        }

        // Prepare update object
        const updateData: Partial<IPlaylist> = {
            ...(name !== undefined && { name }),
            ...(validatedSongs !== undefined && { songs: validatedSongs }),
            ...(status !== undefined && { status }),
            updatedAt: new Date() // Always update the timestamp
        };

        // Perform the update
        const updatedPlaylist = await Playlist.findByIdAndUpdate(
            playlistId,
            updateData,
            {
                new: true, // Return the updated document
                runValidators: true // Run model validations
            }
        ).populate('createdBy', '_id name')
            .populate('songs', '_id title fileSong fileScore linkSong category');

        // Return the updated playlist
        res.status(200).json({
            success: true,
            data: updatedPlaylist,
            message: 'Playlist updated successfully'
        });

    } catch (error) {
        console.error('Error updating playlist:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: null
        });
    }
};
