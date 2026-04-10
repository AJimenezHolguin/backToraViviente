import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";
import { SupabaseQueryService } from "../../services/supabaseQueryService";
import { Movements } from "../../types/movements";

export const getAllMovements: RequestHandler = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
    });
  }

  try {
    const result = await SupabaseQueryService.executeQuery<Movements>(
      req,
      supabase,
      {
        table: "movements",
        defaultSortField: "numReg",

        filters: (query, req) => {
          const { status, month, year } = req.query;

          if (status === "activo") {
            query = query.eq("state", "activo");
          }

          if (status === "anulado") {
            query = query.eq("state", "anulado");
          }

          if (status === "ajustado") {
            query = query.eq("state", "ajustado");
          }

          if (month && year) {
            const startDate = new Date(Number(year), Number(month) - 1, 1);
            const endDate = new Date(Number(year), Number(month), 0);

            query = query
              .gte("date", startDate.toISOString())
              .lte("date", endDate.toISOString());
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
