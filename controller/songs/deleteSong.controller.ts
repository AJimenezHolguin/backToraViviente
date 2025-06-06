import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import songsModel from "../../models/songs.model";

export const deleteMySong = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const songId = req.params.id;
        const userId = req.user?._id;

        if (!songId) {
            res.status(400).json({ message: "El ID de la canción es requerido" });
            return;
        }

        if (!userId) {
            res.status(401).json({ message: "No autorizado - Usuario no identificado" });
            return;
        }

        // Buscar y eliminar la canción
        const deletedSong = await songsModel.findOneAndDelete({
            _id: songId,
            user: userId
        });

        if (!deletedSong) {
            res.status(404).json({
                success: false,
                message: "Canción no encontrada o no autorizado"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Canción eliminada exitosamente",
            data: deletedSong
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la canción",
            error: error.message
        });
    }
}; 