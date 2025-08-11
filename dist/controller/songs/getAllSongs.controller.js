"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSongs = exports.getSongsValidation = void 0;
const queryService_1 = require("../../services/queryService");
const songs_model_1 = __importDefault(require("../../models/songs.model"));
// Validación de parámetros
exports.getSongsValidation = queryService_1.QueryService.validateQueryParams();
const getAllSongs = async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: "No autorizado - Usuario no identificado"
        });
        return;
    }
    try {
        // Ejecutar consulta usando el servicio
        const result = await queryService_1.QueryService.executeQuery(req, songs_model_1.default, {
            defaultSortField: 'name',
            searchFields: ['name', 'category'],
        });
        // Respuesta
        res.status(200).json({
            success: true,
            ...result
        });
    }
    catch (error) {
        console.error('Error en getSongs:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las canciones",
            error: error.message,
        });
    }
};
exports.getAllSongs = getAllSongs;
