import { NextFunction, RequestHandler, Request, Response } from "express";
import {
  handlePaginationValidation,
  validatePaginationParams,
} from "../../utils/pagination.validation";
import { SongService } from "../../services/songs/song.service";

/**
 * @desc    Obtener todas las canciones
 * @route   GET /api/songs
 * @access  Público
 */
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

export const getSongsValidation = [
  ...validatePaginationParams,
  handlePaginationValidation,
];

export const getAllSongs: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: "No autorizado - Usuario no identificado",
    });
    return;
  }

  try {
    const result = await SongService.getAll(req);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error en getSongs:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las canciones",
      error: error.message,
    });
  }
};
