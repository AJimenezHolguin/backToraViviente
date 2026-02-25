import { Request, Response, NextFunction, RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

/**
 * @desc    Crear movimiento financiero
 * @route   POST /api/movimientos
 * @access  Privado
 */
export const createMovimiento: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ success: false, message: "No autorizado" });
    return;
  }

  try {
    const {
      item,
      fecha,
      descripcion,
      ingreso = 0,
      gasto = 0
    } = req.body;

    if (!item || !fecha || !descripcion) {
      res.status(400).json({
        success: false,
        message: "Campos obligatorios faltantes"
      });
      return;
    }

    if (ingreso > 0 && gasto > 0) {
      res.status(400).json({
        success: false,
        message: "No puede existir ingreso y gasto al mismo tiempo"
      });
      return;
    }

    const saldo = ingreso - gasto;

    const { data, error } = await supabase
      .from('movimientos')
      .insert([{
        item,
        fecha,
        descripcion,
        ingreso,
        gasto,
        // saldo,
        // user_id: userId // recomendado si luego filtras por usuario
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Movimiento creado exitosamente",
      data
    });

  } catch (error: any) {
    console.error("Error createMovimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear movimiento",
      error: error.message
    });
  }
};
