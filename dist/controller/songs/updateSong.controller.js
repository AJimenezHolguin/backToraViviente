"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMySong = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const updateMySong = async (req, res, next) => {
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
        const { name, category, linkSong, fileSong, fileScore } = req.body;
        const updatedAt = Date.now();
        // Buscar y actualizar la canción
        const updatedSong = await songs_model_1.default.findOneAndUpdate({ _id: songId, user: userId }, { name, category, linkSong, fileSong, fileScore, updatedAt }, 
        // Opciones para devolver el documento actualizado y validar
        { new: true, runValidators: true });
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
    }
    catch (error) {
        // Manejo de errores de validación de Mongoose
        if (error instanceof mongoose_1.default.Error.ValidationError) {
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
exports.updateMySong = updateMySong;
