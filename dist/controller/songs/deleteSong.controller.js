"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMySong = void 0;
const songs_model_1 = __importDefault(require("../../models/songs.model"));
const deleteMySong = async (req, res, next) => {
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
        const deletedSong = await songs_model_1.default.findOneAndDelete({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar la canción",
            error: error.message
        });
    }
};
exports.deleteMySong = deleteMySong;
