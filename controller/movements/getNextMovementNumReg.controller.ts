import { RequestHandler, Response } from "express";

import supabase from "../../db/supabaseClient";
import { AuthRequest } from "../../middleware/types";

export const getNextMovementNumReg: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "No autorizado",
      });
    }

    const { data, error } = await supabase
      .from("movements")
      .select("numReg")
      .order("numReg", { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== "PGRST116") {
     
      return res.status(500).json({
        success: false,
        message: "Error al obtener el número de registro",
      });
    }

    const nextNumReg = data?.numReg ? data.numReg + 1 : 1;

    return res.status(200).json({
      success: true,
      message: "Siguiente número de registro obtenido",
      nextNumReg,
    });
  } catch (err) {
    console.error("Error getNextMovementNumReg:", err);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};