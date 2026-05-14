import { RequestHandler, Response } from "express";
import { Movements } from "../../types/movements";
import supabase from "../../db/supabaseClient";
import { AuthRequest } from "../../middleware/types";
import userModel from "../../models/user.model";

export const getMovementById: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;

    if (!req.user) {
      return res.status(400).json({
        success: false,
        message: "No autorizado",
      });
    }

    if (!id) {
      return res.status(401).json({
        success: false,
        message: "El id es requerido",
      });
    }

    const { data, error } = await supabase
      .from("movements")
      .select(
        `
        id,
        date,
        numReg,
        description,
        type,
        ingreso,
        gasto,
        saldo,
        state,
        ref_id,
        user_uuid,
        user_name,
        user_email,
        created_at
      `
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({
        success: false,
        message: "Asiento no encontrado",
      });
    }

    let user_active = false;

    if (data.user_uuid) {
      const user = await userModel.findById(data.user_uuid).select("isActive");

      user_active = user?.isActive ?? false;
    }

    const movement: Movements = {
      ...data,
      user_active,
    };

    return res.status(200).json({
      success: true,
      message: "Movimiento obtenido exitosamente",
      data: movement,
    });
  } catch (err) {
    console.error("Error getMovementById:", err);

    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};
