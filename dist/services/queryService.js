"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryService = void 0;
const songs_model_1 = __importDefault(require("../models/songs.model"));
class QueryService {
    /**
     * Middleware de validación de parámetros de consulta
     */
    static validateQueryParams() {
        return [
            // Validación de page
            require('express-validator').query('page')
                .notEmpty().withMessage('El parámetro page es obligatorio')
                .isInt({ min: 1 }).withMessage('El page debe ser un número entero mayor a 0')
                .toInt(),
            // Validación de take (máximo 20)
            require('express-validator').query('take')
                .notEmpty().withMessage('El parámetro take es obligatorio')
                .isInt({ min: 1, max: 20 }).withMessage('El take debe ser un número entre 1 y 20')
                .toInt(),
            // Validación de order (solo ASC o DESC en mayúsculas)
            require('express-validator').query('order')
                .notEmpty().withMessage('El parámetro order es obligatorio')
                .custom((value) => {
                const validOrders = ['ASC', 'DESC'];
                if (!validOrders.includes(value)) {
                    throw new Error('El order debe ser exactamente ASC o DESC (en mayúsculas)');
                }
                return true;
            }),
            // Validaciones opcionales
            require('express-validator').query('search').optional().isString().trim(),
            require('express-validator').query('sortBy').optional().isString().trim()
        ];
    }
    /**
     * Middleware para manejar errores de validación
     */
    static handleValidationErrors(req, res, next) {
        const { validationResult } = require('express-validator');
        const errors = validationResult(req);
        // Si hay errores de validación, devolver respuesta de error
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: 'Parámetros de consulta inválidos',
                errors: errors.array()
            });
            return;
        }
        // Establecer valores por defecto si no se proporcionan
        req.query.page = req.query.page || '1';
        req.query.take = req.query.take || '20';
        req.query.order = req.query.order || 'ASC';
        req.query.sortBy = req.query.sortBy || 'createdAt';
        req.query.search = req.query.search || '';
        next();
    }
    /**
     * Construye una consulta de mongoose con paginación y filtrado
     */
    static async executeQuery(req, model, options) {
        // Convertir parámetros a números
        const page = Number(req.query.page);
        const take = Number(req.query.take);
        const skip = (page - 1) * take;
        // Parámetros de ordenamiento
        const order = (req.query.order === 'DESC') ? -1 : 1;
        const sortBy = req.query.sortBy?.toString() || options.defaultSortField || 'createdAt';
        // Parámetros de búsqueda
        const search = req.query.search?.toString() || '';
        // Consulta base
        const query = {
            user: options.userId
        };
        // Filtro de búsqueda (si se proporcionan campos de búsqueda)
        if (search && options.searchFields?.length) {
            query.$or = options.searchFields.map(field => ({
                [field]: { $regex: search, $options: 'i' }
            }));
        }
        // Filtros dinámicos
        const excludedParams = ['page', 'take', 'order', 'search', 'sortBy'];
        for (const [key, value] of Object.entries(req.query)) {
            if (!excludedParams.includes(key) && value) {
                query[key] = value;
            }
        }
        // Obtener total de documentos
        const total = await model.countDocuments(query);
        // Cálculos de paginación
        const pageCount = Math.ceil(total / take);
        const hasPreviousPage = page > 1;
        const hasNextPage = page < pageCount;
        // Consulta principal
        const data = await model.find(query)
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(take);
        return {
            data,
            metadata: {
                page,
                take,
                total,
                pageCount,
                hasPreviousPage,
                hasNextPage,
                order: order === 1 ? 'ASC' : 'DESC',
                sortBy,
                search
            }
        };
    }
    /**
     * Crea una nueva canción
     */
    static async createSong(req, userId) {
        const { name, category, fileSong, fileScore, linkSong } = req.body;
        const newSong = new songs_model_1.default({
            name,
            category,
            fileSong,
            fileScore,
            linkSong,
            user: userId,
        });
        return await newSong.save();
    }
}
exports.QueryService = QueryService;
