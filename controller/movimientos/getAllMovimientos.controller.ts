import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

export const getAllMovimientos: RequestHandler = async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No autorizado",
    });
  }

  try {
    const { status, month, year, page = "1", limit = "5" } = req.query;

    // ✅ Sanitizar paginación
    const pageNumber = Math.max(parseInt(page as string, 10) || 1, 1);
    const limitNumber = Math.max(parseInt(limit as string, 10) || 5, 1);
    const offset = (pageNumber - 1) * limitNumber;

    // ------------------------------------------------
    // 1️⃣ Construimos filtros base (SIN paginado aún)
    // ------------------------------------------------
    let baseQuery = supabase
      .from("movimientos")
      .select("*", { count: "exact" });

    // 🎯 Filtro por estado
    if (status === "activo") {
      baseQuery = baseQuery.eq("estado", "activo");
    }

    if (status === "anulado") {
      baseQuery = baseQuery.eq("estado", "anulado");
    }

    // 🎯 Filtro por mes
    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0);

      baseQuery = baseQuery
        .gte("fecha", startDate.toISOString())
        .lte("fecha", endDate.toISOString());
    }

    // ------------------------------------------------
    // 2️⃣ Ejecutamos query SOLO para obtener count
    // ------------------------------------------------
    const { count, error: countError } = await baseQuery;

    if (countError) throw countError;

    const totalRecords = count || 0;
    const totalPages =
      totalRecords > 0 ? Math.ceil(totalRecords / limitNumber) : 0;

    // ✅ Si no hay registros
    if (totalRecords === 0) {
      return res.status(200).json({
        success: true,
        message: "No hay movimientos registrados",
        data: [],
        meta: {
          totalRecords: 0,
          currentPage: pageNumber,
          totalPages: 0,
          limit: limitNumber,
        },
      });
    }

    // ✅ Si la página está fuera de rango
    if (pageNumber > totalPages) {
      return res.status(200).json({
        success: true,
        message: "Página fuera de rango",
        data: [],
        meta: {
          totalRecords,
          currentPage: pageNumber,
          totalPages,
          limit: limitNumber,
        },
      });
    }

    // ------------------------------------------------
    // 3️⃣ Query real con paginado
    // ------------------------------------------------
    let dataQuery = supabase
      .from("movimientos")
      .select("*")
      .order("numero_registro", { ascending: false })
      .range(offset, offset + limitNumber - 1);

    // Aplicamos nuevamente los filtros
    if (status === "activo") {
      dataQuery = dataQuery.eq("estado", "activo");
    }

    if (status === "anulado") {
      dataQuery = dataQuery.eq("estado", "anulado");
    }

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0);

      dataQuery = dataQuery
        .gte("fecha", startDate.toISOString())
        .lte("fecha", endDate.toISOString());
    }

    const { data, error } = await dataQuery;

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Movimientos obtenidos exitosamente",
      data,
      meta: {
        totalRecords,
        currentPage: pageNumber,
        totalPages,
        limit: limitNumber,
      },
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
