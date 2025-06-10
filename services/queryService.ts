import { NextFunction, Request, Response } from "express";
import mongoose, { Model } from "mongoose";
import songsModel from "../models/songs.model";

export interface QueryOptions {
    searchFields?: string[];
    defaultSortField?: string;
    userId?: string; // Ahora es opcional
}

export class QueryService {
    /**
     * Middleware de validación de parámetros de consulta
     */
    static validateQueryParams() {
        return [
            // Validación de page
            require("express-validator").query("page")
                .notEmpty().withMessage("El parámetro page es obligatorio")
                .isInt({ min: 1 }).withMessage("El page debe ser un número entero mayor a 0")
                .toInt(),

            // Validación de take (máximo 20)
            require("express-validator").query("take")
                .notEmpty().withMessage("El parámetro take es obligatorio")
                .isInt({ min: 1, max: 20 }).withMessage("El take debe ser un número entre 1 y 20")
                .toInt(),

            // Validación de order (solo ASC o DESC en mayúsculas)
            require("express-validator").query("order")
                .notEmpty().withMessage("El parámetro order es obligatorio")
                .custom((value: string) => {
                    const validOrders = ["ASC", "DESC"];
                    if (!validOrders.includes(value)) {
                        throw new Error("El order debe ser exactamente ASC o DESC (en mayúsculas)");
                    }
                    return true;
                }),

            // Validaciones opcionales
            require("express-validator").query("search").optional().isString().trim(),
            require("express-validator").query("sortBy").optional().isString().trim(),
        ];
    }

    /**
     * Middleware para manejar errores de validación
     */
    static handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
        const { validationResult } = require("express-validator");
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                message: "Parámetros de consulta inválidos",
                errors: errors.array(),
            });
            return;
        }

        req.query.page = req.query.page || "1";
        req.query.take = req.query.take || "20";
        req.query.order = req.query.order || "ASC";
        req.query.sortBy = req.query.sortBy || "createdAt";
        req.query.search = req.query.search || "";

        next();
    }

    /**
     * Construye una consulta de mongoose con paginación, filtrado y búsqueda
     */
    static async executeQuery<T>(
        req: Request,
        model: Model<T>,
        options: QueryOptions
    ) {
        const page = Number(req.query.page);
        const take = Number(req.query.take);
        const skip = (page - 1) * take;

        const order = req.query.order === "DESC" ? -1 : 1;
        const sortBy = req.query.sortBy?.toString() || options.defaultSortField || "createdAt";
        const search = req.query.search?.toString() || "";

        // Query base (condición opcional de userId)
        const query: any = {};
        if (options.userId) {
            query.user = options.userId;
        }

        // Búsqueda por campos
        if (search && options.searchFields?.length) {
            query.$or = options.searchFields.map((field) => ({
                [field]: { $regex: search, $options: "i" },
            }));
        }

        // Filtros adicionales dinámicos
        const excludedParams = ["page", "take", "order", "search", "sortBy"];
        for (const [key, value] of Object.entries(req.query)) {
            if (!excludedParams.includes(key) && value) {
                query[key] = value;
            }
        }

        const total = await model.countDocuments(query);
        const pageCount = Math.ceil(total / take);
        const hasPreviousPage = page > 1;
        const hasNextPage = page < pageCount;

        const data = await model.find(query)
            .populate({
                path: 'user',
                select: 'name' // Only select the name field from the user
            })
            .sort({ [sortBy]: order })
            .skip(skip)
            .limit(take);

        return {
            data: data.map(item => ({
                ...item.toObject(), // Convert to plain object
                userName: (item as any).user?.name // Add userName from populated user
            })),
            metadata: {
                page,
                take,
                total,
                pageCount,
                hasPreviousPage,
                hasNextPage,
                order: order === 1 ? "ASC" : "DESC",
                sortBy,
                search,
            },
        };
    }

    /**
     * Crear nueva canción
     */
    static async createSong(req: Request, userId: string) {
        const { name, category, fileSong, fileScore, linkSong } = req.body;
        const newSong = new songsModel({
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
