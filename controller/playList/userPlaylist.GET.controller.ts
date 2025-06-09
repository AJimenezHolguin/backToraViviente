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

export const userPlaylist = async (req: Request, res: Response) => {
    try {
        // Extract user ID from authenticated request
        const userId = req.user ? (req.user as any)._id : null;

        // Destructure query parameters
        const { page, take, order, search = '', sortBy = 'createdAt' } = req.query;

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
            .populate('createdBy', 'name')
            .populate('songs', 'title');

        // Count total documents for pagination metadata
        const total = await Playlist.countDocuments(searchQuery);

        // Calculate page count
        const pageCount = Math.ceil(total / takeNum);

        res.status(200).json({
            success: true,
            data: playlists,
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