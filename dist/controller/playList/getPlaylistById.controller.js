"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlaylistById = void 0;
const playList_model_1 = __importDefault(require("../../models/playList.model"));
/**
 * @desc    Obtener una playlist por ID
 * @route   GET /api/playlists/:id
 * @access  Privado (requiere autenticación)
 */
const getPlaylistById = async (req, res) => {
    try {
        const playlistId = req.params.playlistId;
        if (!playlistId) {
            res.status(400).json({
                success: false,
                message: "El ID de la playlist es requerido"
            });
            return;
        }
        // Buscar la playlist y poblar canciones y creador
        // Buscar la playlist y poblar canciones y creador
        const playlist = await playList_model_1.default.findById(playlistId)
            .populate({ path: "createdBy", select: "name email" })
            .populate({ path: "songs", select: "name category user" }); // Asegúrate que "songs" es el nombre correcto del campo en tu esquema
        // Si el campo se llama diferente en tu esquema, por ejemplo "tracks", usa:
        // .populate({ path: "tracks", select: "name category user" });
        if (!playlist) {
            res.status(404).json({
                success: false,
                message: "Playlist no encontrada"
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: playlist
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener la playlist",
            error: error.message
        });
    }
};
exports.getPlaylistById = getPlaylistById;
