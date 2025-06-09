import { Request, Response } from "express";
import PlaylistModel from "../../models/playList.model";
import { IUser } from "../../models/user.model";

export const createPlaylist = async (req: Request, res: Response) => {
    try {
        const { name, songs, status } = req.body;
        const userId = req.user?._id;

        const playlist = new PlaylistModel({ name: name, songs: songs, status: status, createdBy: userId });

        const savedPlaylist = await playlist.save();

        if (!savedPlaylist) {
            res.status(400).json({ message: "Error al crear la playlist" });
            return;
        }

        // Populate the createdBy field with user details
        const populatedPlaylist = await PlaylistModel.findById(savedPlaylist._id)
            .populate<{ createdBy: IUser }>({
                path: 'createdBy',
                select: '_id name email'
            });

        res.status(201).json({
            message: "Playlist creada exitosamente",
            playlist: {
                ...populatedPlaylist?.toObject(),
                createdBy: populatedPlaylist?.createdBy ? {
                    id: populatedPlaylist.createdBy._id,
                    name: populatedPlaylist.createdBy.name,
                    email: populatedPlaylist.createdBy.email
                } : null
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error al crear la playlist", error });
    }
};