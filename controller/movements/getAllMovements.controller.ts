import { RequestHandler } from "express";
import { MovementService } from '../../services/movement/movement.service';

export const getAllMovements: RequestHandler = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
    });
  }

  try {
    const result = await MovementService.getAll(req);
   
    return res.status(200).json({
      success: true,
      message: "Movimientos obtenidos exitosamente",
      ...result,
    });
  } catch (error: any) {
    console.error("ERROR GET MOVIMIENTOS:", error);

    return res.status(500).json({
      success: false,
      message: "Error al obtener movimientos",
      error: error?.message || error,
    });
  }
};
