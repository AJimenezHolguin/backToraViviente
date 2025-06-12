import { Request, Response } from 'express';
import Playlist, { IPlaylist } from '../../models/playList.model';
import mongoose from 'mongoose';

interface PlaylistQueryParams {
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

export const allsPlaylist = async (req: Request, res: Response) => {
    try {
        const { page, take, order, search = '', sortBy = 'createdAt' } = req.query as unknown as PlaylistQueryParams;

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

        const searchQuery: mongoose.FilterQuery<IPlaylist> = {};
        if (search) {
            searchQuery.name = { $regex: search, $options: 'i' };
        }

        const skip = (pageNum - 1) * takeNum;
        const sortDirection = orderStr === 'ASC' ? 1 : -1;

        const playlists = await Playlist.find(searchQuery)
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

        const transformedPlaylists: TransformedPlaylist[] = playlists.map(playlist => {
            const playlistObject = playlist.toObject();

            const createdBy = playlistObject.createdBy && (playlistObject.createdBy as any)._id
                ? {
                    _id: String((playlistObject.createdBy as any)._id),
                    name: String((playlistObject.createdBy as any).name ?? '')
                }
                : null;

            const songs: SongInfo[] = (playlistObject.songs || [])
                .filter((song: any) => song && song._id)
                .map((song: any) => ({
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

        const total = await Playlist.countDocuments(searchQuery);
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
    } catch (error) {
        console.error('Error fetching playlists:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            data: []
        });
    }
};
