import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";
import { AuthRequest } from "../../middleware/auth.middleware";

export const annulledMovements: RequestHandler = async (
  req: AuthRequest,
  res
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { descripcion } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // 1️⃣ Buscar movimiento original
    const { data: original, error: errorOriginal } = await supabase
      .from("movimientos")
      .select("*")
      .eq("id", id)
      .single();

    if (errorOriginal || !original) {
      return res.status(404).json({
        success: false,
        message: "Movimiento no encontrado",
      });
    }

    // 2️⃣ Validaciones de negocio
    if (original.estado === "anulado") {
      return res.status(400).json({
        success: false,
        message: "El movimiento ya está anulado",
      });
    }

    if (original.tipo === "anulacion") {
      return res.status(400).json({
        success: false,
        message: "No se puede anular un asiento de anulación",
      });
    }

    // 3️⃣ Obtener último saldo
    const { data: ultimoMovimiento } = await supabase
      .from("movimientos")
      .select("saldo")
      .order("numero_registro", { ascending: false })
      .limit(1)
      .single();

    const ultimoSaldo = ultimoMovimiento
      ? Number(ultimoMovimiento.saldo)
      : 0;

    // 4️⃣ Invertir efecto contable
    const ingresoAnulacion = original.gasto ? Number(original.gasto) : 0;
    const gastoAnulacion = original.ingreso ? Number(original.ingreso) : 0;

    const nuevoSaldo =
      ultimoSaldo + ingresoAnulacion - gastoAnulacion;

    // 5️⃣ Construir descripción
    const descripcionUsuario = descripcion
      ? descripcion.trim()
      : "Anulación contable";

    const descripcionFinal = `${descripcionUsuario} (Anulación del asiento #${original.numero_registro})`;

    // 6️⃣ Insertar asiento de anulación
    const { data: anulacion, error: errorAnulacion } = await supabase
      .from("movimientos")
      .insert([
        {
          fecha: new Date(),
          descripcion: descripcionFinal,
          tipo: "anulacion",
          ingreso: ingresoAnulacion,
          gasto: gastoAnulacion,
          saldo: nuevoSaldo,
          estado: "activo",
          referencia_id: original.id,
          usuario_uuid: user._id,
          usuario_nombre: user.name,
          usuario_correo: user.email,
        },
      ])
      .select()
      .single();

    if (errorAnulacion) throw errorAnulacion;

    // 7️⃣ Marcar original como anulado
    const { error: updateError } = await supabase
      .from("movimientos")
      .update({ estado: "anulado" })
      .eq("id", original.id);

    if (updateError) throw updateError;

    return res.status(201).json({
      success: true,
      message: "Movimiento anulado correctamente",
      data: anulacion,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error al anular movimiento",
      error: error.message,
    });
  }
};