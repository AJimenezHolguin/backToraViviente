import { RequestHandler, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import songsModel from "../../models/songs.model";

export const createSong: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "No autorizado - Usuario no identificado" });
            return;
        }

        const { name, category, linkSong, fileScore, fileSong } = req.body;

        // Crear nueva canción
        const newSong = new songsModel({
            name,
            category,
            linkSong,
            ...(fileScore && {
                fileScore: {
                    public_id: fileScore.public_id,
                    secure_url: fileScore.secure_url
                }
            }),
            ...(fileSong && {
                fileSong: {
                    public_id: fileSong.public_id,
                    secure_url: fileSong.secure_url
                }
            }),
            user: userId,
        });

        // Guardar canción
        await newSong.save();

        // Respuesta
        res.status(201).json({
            success: true,
            message: "Canción creada exitosamente",
            song: newSong,
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
            message: "Error al crear la canción",
            error: error.message
        });
    }
};