import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import songsModel from "../../models/songs.model";

export const updateMySong = async (
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

        const { name, category, url } = req.body;

        // Buscar y actualizar la canción
        const updatedSong = await songsModel.findOneAndUpdate(
            { _id: songId, user: userId },
            { name, category, url },
            { new: true, runValidators: true }
        );

        if (!updatedSong) {
            res.status(404).json({
                success: false,
                message: "Canción no encontrada o no autorizado"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Canción actualizada exitosamente",
            data: updatedSong
        });
    } catch (error: any) {
        // Manejo de errores de validación de Mongoose
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(el => el.message);
            res.status(400).json({
                success: false,
                message: "Error de validación",
                errors
            });
            return;
        }

        // Otros errores
        res.status(500).json({
            success: false,
            message: "Error al actualizar la canción",
            error: error.message
        });
    }
}; 