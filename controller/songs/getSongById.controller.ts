import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import songsModel from "../../models/songs.model";

/**
 * @desc    Obtener una canción por ID
 * @route   GET /api/songs/:id
 * @access  Público
 */
export const getSongById = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const songId = req.params.id;
        if (!songId) {
            res.status(400).json({ message: "El ID de la canción es requerido" });
            return;
        }

        const song = await songsModel
            .findById(songId)
            .populate("user", "name email");

        if (!song) {
            res.status(404).json({
                success: false,
                message: "Canción no encontrada"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: song
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la canción",
            error: error.message,
        });
    }
}; 