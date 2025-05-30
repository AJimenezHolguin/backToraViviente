import { NextFunction, RequestHandler, Request, Response } from "express";
import { QueryService } from "../../services/queryService";
import songsModel from "../../models/songs.model";

declare global {
    namespace Express {
        interface Request {
            user?: {
                role: any;
                _id: string;
            };
        }
    }
}

// Validación de parámetros
export const getSongsByUserValidation = QueryService.validateQueryParams();

export const getSongsByUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        console.log('Parámetros recibidos:', {
            query: req.query,
            params: req.params,
            body: req.body,
            user: req.user
        });

        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: "No autorizado - Usuario no identificado"
            });
            return;
        }

        // Ejecutar consulta usando el servicio
        const result = await QueryService.executeQuery(req, songsModel, {
            searchFields: ['name', 'category'],
            defaultSortField: 'createdAt'
        });

        // Modificar la consulta para filtrar por usuario
        const filteredResult = {
            ...result,
            data: result.data.filter(song => song.user.toString() === userId)
        };

        // Respuesta
        res.status(200).json({
            success: true,
            ...filteredResult
        });

    } catch (error: any) {
        console.error('Error en getSongsByUser:', error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las canciones del usuario",
            error: error.message,
        });
    }
}; 