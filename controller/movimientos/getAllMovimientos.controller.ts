import { Request, Response, RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

export const getAllMovimientos: RequestHandler = async (req, res) => {

  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No autorizado"
    });
  }

  try {

    const { status, month, year } = req.query;

    let query = supabase
      .from("movimientos")
      .select("*")
      .order("fecha", { ascending: true })
      .order("id", { ascending: true });

    // 🎯 FILTRO POR ESTADO
    if (!status || status === "active") {
      query = query.eq("is_annulled", false);
    }

    if (status === "annulled") {
      query = query.eq("is_annulled", true);
    }

    // 🎯 FILTRO POR MES
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0);

      query = query
        .gte("fecha", startDate.toISOString())
        .lte("fecha", endDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    // 🎯 Calcular saldo solo si NO son anulados exclusivamente
    let saldoAcumulado = 0;

    const movimientos = data.map(m => {

      if (!m.is_annulled) {
        saldoAcumulado += (m.ingreso || 0) - (m.gasto || 0);
      }

      return {
        ...m,
        saldo_acumulado: saldoAcumulado
      };
    });

    return res.status(200).json({
      success: true,
      message: "Movimientos obtenidos exitosamente",
      data: movimientos
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error al obtener movimientos",
      error: error.message
    });
  }
};