import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

export const updateMovimiento: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const { fecha, descripcion, ingreso, gasto } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID requerido"
    });
  }

  try {
    // 1️⃣ Obtener movimiento actual
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

    const now = new Date();
    const fechaMovimiento = new Date(movimiento.fecha);

    const mismoMes =
      fechaMovimiento.getMonth() === now.getMonth() &&
      fechaMovimiento.getFullYear() === now.getFullYear();

    // 2️⃣ Validaciones de monto
    if (ingreso && gasto) {
      return res.status(400).json({
        success: false,
        message: "No puede existir ingreso y gasto al mismo tiempo"
      });
    }

    if ((ingreso && ingreso < 0) || (gasto && gasto < 0)) {
      return res.status(400).json({
        success: false,
        message: "Los montos no pueden ser negativos"
      });
    }

    // 3️⃣ Si intenta modificar monto y no es del mes actual
    if (!mismoMes && (ingreso !== undefined || gasto !== undefined)) {
      return res.status(403).json({
        success: false,
        message: "No se pueden modificar montos de meses anteriores"
      });
    }

    // 4️⃣ Construir objeto de actualización
    const updateData: any = {};

    if (fecha) updateData.fecha = fecha;
    if (descripcion) updateData.descripcion = descripcion;
    if (ingreso !== undefined) updateData.ingreso = ingreso;
    if (gasto !== undefined) updateData.gasto = gasto;

    const { data, error } = await supabase
      .from("movimientos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Movimiento actualizado correctamente",
      data
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar movimiento",
      error: error.message
    });
  }
};