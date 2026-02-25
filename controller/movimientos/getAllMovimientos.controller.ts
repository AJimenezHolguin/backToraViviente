import { Request, Response, RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

/**
 * @desc    Obtener movimientos financieros
 * @route   GET /api/movimientos
 * @access  Privado
 */
export const getAllMovimientos: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {

  const userId = req.user?._id;
  if (!userId) {
    res.status(401).json({ success: false, message: "No autorizado" });
    return;
  }

  try {
    const { data, error } = await supabase
      .from('movimientos')
      .select('*')
      .order('fecha', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw error;

    let saldoAcumulado = 0;

    const movimientos = data.map(m => {
      saldoAcumulado += m.saldo;
      return {
        ...m,
        saldo_acumulado: saldoAcumulado
      };
    });

    res.status(200).json({
      success: true,
      message: "Movimientos obtenidos exitosamente",
      data: movimientos
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error al obtener movimientos",
      error: error.message
    });
  }
};
