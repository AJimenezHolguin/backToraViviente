"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSongsByUser = exports.getSongsByUserValidation = void 0;
const queryService_1 = require("../../services/queryService");
const songs_model_1 = __importDefault(require("../../models/songs.model"));
// Validación de parámetros
exports.getSongsByUserValidation = queryService_1.QueryService.validateQueryParams();
const getSongsByUser = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "No autorizado - Usuario no identificado"
            });
            return;
        }
        // Ejecutar consulta usando el servicio
        const result = await queryService_1.QueryService.executeQuery(req, songs_model_1.default, {
            userId: userId,
            defaultSortField: 'name',
            searchFields: ['name', 'category'],
        });
        // No es necesario filtrar por user, ya que la query ya lo hace
        res.status(200).json({
            success: true,
            ...result
        });
    }
    catch (error) {
        console.error('Error en getSongsByUser:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las canciones del usuario",
            error: error.message,
        });
    }
};
exports.getSongsByUser = getSongsByUser;
