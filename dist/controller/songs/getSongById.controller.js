"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongById = void 0;
const songs_model_1 = __importDefault(require("../../models/songs.model"));
/**
 * @desc    Obtener una canción por ID
 * @route   GET /api/songs/:id
 * @access  Público
 */
const getSongById = async (req, res, next) => {
    try {
        const songId = req.params.id;
        if (!songId) {
            res.status(400).json({ message: "El ID de la canción es requerido" });
            return;
        }
        const song = await songs_model_1.default
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la canción",
            error: error.message,
        });
    }
};
exports.getSongById = getSongById;
