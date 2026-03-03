import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";
import { SupabaseQueryService } from "../../services/supabaseQueryService";
import { Movimiento } from "../../types/movimiento";

export const getAllMovements: RequestHandler = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
    });
  }

  try {
    const result = await SupabaseQueryService.executeQuery<Movimiento>(
      req,
      supabase,
      {
        table: "movimientos",
        defaultSortField: "numero_registro",

        filters: (query, req) => {
          const { status, month, year } = req.query;

          if (status === "activo") {
            query = query.eq("estado", "activo");
          }

          if (status === "anulado") {
            query = query.eq("estado", "anulado");
          }

          if (month && year) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0);

            query = query
              .gte("fecha", startDate.toISOString())
              .lte("fecha", endDate.toISOString());
          }

          return query;
        },
      }
    );

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
