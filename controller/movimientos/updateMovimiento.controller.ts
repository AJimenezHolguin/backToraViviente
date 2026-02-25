import { Request, Response, NextFunction, RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

/**
 * @desc    Actualizar movimiento financiero
 * @route   PUT /api/movimientos/:id
 * @access  Privado (Admin)
 */
export const updateMovimiento: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {

  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({
      success: false,
      message: "No autorizado"
    });
    return;
  }

  try {
    const { id } = req.params;
    const {
      item,
      fecha,
      descripcion,
      ingreso = 0,
      gasto = 0
    } = req.body;

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
      .update({
        item,
        fecha,
        descripcion,
        ingreso,
        gasto,
        saldo
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Movimiento no encontrado"
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Movimiento actualizado exitosamente",
      data
    });

  } catch (error: any) {
    console.error("Error updateMovimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar movimiento",
      error: error.message
    });
  }
};
