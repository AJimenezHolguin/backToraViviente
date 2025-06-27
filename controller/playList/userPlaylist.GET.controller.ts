import { Request, Response } from 'express';
import Playlist, { IPlaylist } from '../../models/playList.model';
import mongoose from 'mongoose';

interface UserPlaylistQueryParams {
    page: number;
    take: number;
    order: 'ASC' | 'DESC';
    search?: string;
    sortBy?: string;
}

interface CreatedByInfo {
    _id: string;
    name: string;
}

interface SongInfo {
    _id: string;
    title: string;
    fileSong?: {
        public_id: string;
        secure_url: string;
    };
    fileScore?: {
        public_id: string;
        secure_url: string;
    };
    linkSong?: string;
    category?: string;
}

interface TransformedPlaylist {
    _id: string;
    name: string;
    createdBy: CreatedByInfo | null;
    songs: SongInfo[];
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    __v?: number;
}

export const userPlaylist = async (req: Request, res: Response) => {

    try {
        // Extract user ID from authenticated request
        const userId = req.user ? (req.user as any)._id : null;

        // Destructure query parameters
        const { page, take, order, search = '', sortBy = 'createdAt' } = req.query as unknown as UserPlaylistQueryParams;

        // Validate that page, take, and order are present and valid
        if (
            page === undefined ||
            take === undefined ||
            order === undefined
        ) {
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
        if (
            isNaN(pageNum) ||
            isNaN(takeNum) ||
            pageNum < 1 ||
            takeNum < 1 ||
            (orderStr !== 'ASC' && orderStr !== 'DESC')
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid page, take, or order parameters',
                data: []
            });
        }

        // Prepare search query
        const searchQuery: mongoose.FilterQuery<IPlaylist> = {
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
        const playlists = await Playlist.find(searchQuery)
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
                select: '_id name fileSong fileScore linkSong category' // Select specific song fields
            });

        // Transform playlists to handle null createdBy and populate song details
        const transformedPlaylists: TransformedPlaylist[] = playlists.map(playlist => {
            const playlistObject = playlist.toObject();

            // If createdBy is populated, extract _id and name
            const createdBy = playlistObject.createdBy && (playlistObject.createdBy as any)._id
                ? {
                    _id: String((playlistObject.createdBy as any)._id),
                    name: String((playlistObject.createdBy as any).name || '')
                }
                : null;

            // Transform songs to ensure proper formatting
            const songs: SongInfo[] = playlistObject.songs.map((song: any) => ({
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

        // Count total documents for pagination metadata
        const total = await Playlist.countDocuments(searchQuery);

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
    } catch (error) {
        console.error('Error fetching user playlists:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: []
        });
    }
}; 