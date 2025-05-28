import { Request, Response } from "express";
import PlaylistModel from "../../models/playList.model";

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

        res.status(201).json({ message: "Playlist creada exitosamente", playlist: savedPlaylist });

    } catch (error) {
        res.status(500).json({ message: "Error al crear la playlist", error });
    }
};