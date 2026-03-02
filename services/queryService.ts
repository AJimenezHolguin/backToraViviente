// import { NextFunction, Request, Response } from "express";
// import mongoose, { Model } from "mongoose";
// import songsModel from "../models/songs.model";

// export interface QueryOptions {
//     searchFields?: string[];
//     defaultSortField?: string;
//     userId?: string; // Ahora es opcional
// }

// export class QueryService {
//     /**
//      * Middleware de validación de parámetros de consulta
//      */
//     static validateQueryParams() {
//         return [
//             // Validación de page
//             require("express-validator").query("page")
//                 .notEmpty().withMessage("El parámetro page es obligatorio")
//                 .isInt({ min: 1 }).withMessage("El page debe ser un número entero mayor a 0")
//                 .toInt(),

//             // Validación de take (máximo 20)
//             require("express-validator").query("take")
//                 .notEmpty().withMessage("El parámetro take es obligatorio")
//                 .isInt({ min: 1, max: 20 }).withMessage("El take debe ser un número entre 1 y 20")
//                 .toInt(),

//             // Validación de order (solo ASC o DESC en mayúsculas)
//             require("express-validator").query("order")
//                 .notEmpty().withMessage("El parámetro order es obligatorio")
//                 .custom((value: string) => {
//                     const validOrders = ["ASC", "DESC"];
//                     if (!validOrders.includes(value)) {
//                         throw new Error("El order debe ser exactamente ASC o DESC (en mayúsculas)");
//                     }
//                     return true;
//                 }),

//             // Validaciones opcionales
//             require("express-validator").query("search").optional().isString().trim(),
//             require("express-validator").query("sortBy").optional().isString().trim(),
//         ];
//     }

//     /**
//      * Middleware para manejar errores de validación
//      */
//     static handleValidationErrors(req: Request, res: Response, next: NextFunction): void {
//         const { validationResult } = require("express-validator");
//         const errors = validationResult(req);

//         if (!errors.isEmpty()) {
//             res.status(400).json({
//                 success: false,
//                 message: "Parámetros de consulta inválidos",
//                 errors: errors.array(),
//             });
//             return;
//         }

//         req.query.page = req.query.page || "1";
//         req.query.take = req.query.take || "20";
//         req.query.order = req.query.order || "ASC";
//         if (!req.query.sortBy || req.query.sortBy.toString().trim() === "") {
//             delete req.query.sortBy;
//         }
//         req.query.search = req.query.search || "";
      

//         next();
//     }

//     /**
//      * Construye una consulta de mongoose con paginación, filtrado y búsqueda
//      */
//     static async executeQuery<T>(
//         req: Request,
//         model: Model<T>,
//         options: QueryOptions
//     ) {
//         const sortBy = req.query.sortBy?.toString() || options.defaultSortField || "createdAt";
//         const page = Number(req.query.page);
//         const take = Number(req.query.take);
//         const skip = (page - 1) * take;

    
//         const order = req.query.order === "DESC" ? -1 : 1;

//         const search = req.query.search?.toString() || "";

//         // Query base (condición opcional de userId)
//         const query: any = {};
//         if (options.userId) {
//             query.user = options.userId;
//         }

//         // Búsqueda por campos
//         if (search && options.searchFields?.length) {
//             query.$or = options.searchFields.map((field) => ({
//                 [field]: { $regex: search, $options: "i" },
//             }));
//         }

//         // Filtros adicionales dinámicos
//         const excludedParams = ["page", "take", "order", "search", "sortBy"];
//         for (const [key, value] of Object.entries(req.query)) {
//             if (!excludedParams.includes(key) && value) {
//                 query[key] = value;
//             }
//         }

//         const total = await model.countDocuments(query);
//         const pageCount = Math.ceil(total / take);
//         const hasPreviousPage = page > 1;
//         const hasNextPage = page < pageCount;

//         const data = await model.find(query)
//         .collation({ locale: "es", strength: 1 })
//         .sort({ [sortBy]: order })
//         .skip(skip)
//         .limit(take)
//         .populate({
//             path: 'user',
//             select: 'name' // Solo el nombre del usuario
//         });
        

//         return {
//             data: data.map(item => {
//                 const obj = item.toObject();
//                 return {
//                     ...obj,
//                     userName: (item as any).user?.name,
//                     // Elimina el campo user (id o ref)
//                     user: undefined
//                 };
//             }),
//             metadata: {
//                 page,
//                 take,
//                 total,
//                 pageCount,
//                 hasPreviousPage,
//                 hasNextPage,
//                 order: order === 1 ? "ASC" : "DESC",
//                 sortBy,
//                 search,
//             },
//         };
//     }

//     /**
//      * Crear nueva canción
//      */
//     static async createSong(req: Request, userId: string) {
//         const { name, category, fileSong, fileScore, linkSong } = req.body;
//         const newSong = new songsModel({
//             name,
//             category,
//             fileSong,
//             fileScore,
//             linkSong,
//             user: userId,
//         });

//         return await newSong.save();
//     }
// }

import { Request } from "express";
import { Model, FilterQuery } from "mongoose";
import {
  PaginatedResult,
  OrderDirection,
} from "../types/pagination";
import { buildMetadata } from "../utils/pagination.utils";

export interface MongoQueryOptions<T> {
  searchFields?: (keyof T)[];
  defaultSortField?: keyof T;
  userId?: string;
}

export class QueryService {
  static async executeQuery<T>(
    req: Request,
    model: Model<T>,
    options: MongoQueryOptions<T>
  ): Promise<PaginatedResult<T>> {

    const page = Number(req.query.page) || 1;
    const take = Number(req.query.take) || 10;

    const order: OrderDirection =
      req.query.order === "DESC" ? "DESC" : "ASC";

    const sortBy =
      (req.query.sortBy as keyof T) ||
      options.defaultSortField ||
      ("createdAt" as keyof T);

    const search = (req.query.search as string) || "";
    const skip = (page - 1) * take;

    const query: FilterQuery<T> = {};

    if (options.userId) {
      (query as any).user = options.userId;
    }

    if (search && options.searchFields?.length) {
      query.$or = options.searchFields.map((field) => ({
        [field]: { $regex: search, $options: "i" },
      })) as any;
    }

    const total = await model.countDocuments(query);

    const data = await model
      .find(query)
      .sort({ [String(sortBy)]: order === "ASC" ? 1 : -1 })
      .skip(skip)
      .limit(take);

    return {
      data,
      metadata: buildMetadata(
        page,
        take,
        total,
        order,
        sortBy as string,
        search
      ),
    };
  }
}