import { NextFunction, RequestHandler, Request, Response } from "express";
import { QueryService } from "../../services/queryService";
import songsModel from "../../models/songs.model";
import { handlePaginationValidation, validatePaginationParams } from "../../utils/pagination.validation";

/**
 * @desc    Obtener todas las canciones
 * @route   GET /api/songs
 * @access  Público
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                role: any; _id: string
            }; // Adjust the type of user as per your application
        }
    }
}


export const getSongsValidation = [
    ...validatePaginationParams,
    handlePaginationValidation,
  ];

export const getSongs: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
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
        const result = await QueryService.executeQuery(req, songsModel, {
            defaultSortField: 'name',
            searchFields: ['name', 'category'],
            userId: userId
        });

        // Respuesta
        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error: any) {
        console.error('Error en getSongs:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las canciones",
            error: error.message,
        });
    }
}; 