"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongsByUser = exports.getSongsValidation = void 0;
const pagination_validation_1 = require("../../utils/pagination.validation");
const song_service_1 = require("../../services/songs/song.service");
exports.getSongsValidation = [
    ...pagination_validation_1.validatePaginationParams,
    pagination_validation_1.handlePaginationValidation,
];
const getSongsByUser = async (req, res, next) => {
    const userId = req.user?._id;
    try {
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "No autorizado - Usuario no identificado",
            });
            return;
        }
        const result = await song_service_1.SongService.getByUser(req, userId);
        res.status(200).json({
            success: true,
            ...result,
        });
    }
    catch (error) {
        console.error("Error en getSongsByUser:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las canciones del usuario",
            error: error.message,
        });
    }
};
exports.getSongsByUser = getSongsByUser;
