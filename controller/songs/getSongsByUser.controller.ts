import { NextFunction, RequestHandler, Request, Response } from "express";
import {
  handlePaginationValidation,
  validatePaginationParams,
} from "../../utils/pagination.validation";
import { SongService } from "../../services/songs/song.service";

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

export const getSongsByUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  
  const userId = req.user?._id;
  
  try {
    if (!userId) {
      res.status(401).json({
        success: false,
        message: "No autorizado - Usuario no identificado",
      });
      return;
    }
  
    const result = await SongService.getByUser(req, userId);
   
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("Error en getSongsByUser:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener las canciones del usuario",
      error: error.message,
    });
  }
};
