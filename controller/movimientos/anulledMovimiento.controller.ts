import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

export const anulledMovimiento: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id; // viene de Mongo (ObjectId string)

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID requerido"
    });
  }

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "No autorizado"
    });
  }

  try {
    // 1️⃣ Verificar que exista
    const { data: movimiento, error: fetchError } = await supabase
      .from("movimientos")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !movimiento) {
      return res.status(404).json({
        success: false,
        message: "Movimiento no encontrado"
      });
    }

    // 2️⃣ Evitar doble anulación
    if (movimiento.is_annulled) {
      return res.status(400).json({
        success: false,
        message: "El movimiento ya está anulado"
      });
    }

    // 3️⃣ Ejecutar anulación
    const { data, error } = await supabase
      .from("movimientos")
      .update({
        is_annulled: true,
        annulled_at: new Date(),
        annulled_by: userId
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Movimiento anulado correctamente",
      data
    });

  } catch (error: any) {
    console.error("Error anularMovimiento:", error);

    return res.status(500).json({
      success: false,
      message: "Error al anular movimiento",
      error: error.message
    });
  }
};