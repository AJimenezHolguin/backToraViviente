import { Request, Response, NextFunction, RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

/**
 * @desc    Eliminar movimiento financiero
 * @route   DELETE /api/movimientos/:id
 * @access  Privado (Admin)
 */
export const deleteMovimiento: RequestHandler = async (
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

    const { data, error } = await supabase
      .from('movimientos')
      .delete()
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
      message: "Movimiento eliminado correctamente",
      data
    });

  } catch (error: any) {
    console.error("Error deleteMovimiento:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar movimiento",
      error: error.message
    });
  }
};
