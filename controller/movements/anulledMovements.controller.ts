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
    const { description } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const { data: original, error: errorOriginal } = await supabase
      .from("movements")
      .select("*")
      .eq("id", id)
      .single();

    if (errorOriginal || !original) {
      return res.status(404).json({
        success: false,
        message: "Movimiento no encontrado",
      });
    }

   
    if (original.state === "anulado") {
      return res.status(400).json({
        success: false,
        message: "El movimiento ya está anulado",
      });
    }

    if (original.type === "anulacion") {
      return res.status(400).json({
        success: false,
        message: "No se puede anular un asiento de anulación",
      });
    }

    // 3️⃣ Obtener último saldo
    const { data: ultimoMovimiento } = await supabase
      .from("movements")
      .select("saldo")
      .order("numReg", { ascending: false })
      .limit(1)
      .single();

    const ultimoSaldo = ultimoMovimiento
      ? Number(ultimoMovimiento.saldo)
      : 0;


    const ingresoAnulacion = original.gasto ? Number(original.gasto) : 0;
    const gastoAnulacion = original.ingreso ? Number(original.ingreso) : 0;

    const nuevoSaldo =
      ultimoSaldo + ingresoAnulacion - gastoAnulacion;

  
    const descriptionUser = description
      ? description.trim()
      : "Anulación contable";

    const descripcionFinal = `${descriptionUser} (Anulación del asiento #${original.numReg})`;

   
    const { data: anulacion, error: errorAnulacion } = await supabase
      .from("movements")
      .insert([
        {
          date: new Date(),
          description: descripcionFinal,
          type: "anulacion",
          ingreso: ingresoAnulacion,
          gasto: gastoAnulacion,
          saldo: nuevoSaldo,
          state: "activo",
          ref_id: original.id,
          user_uuid: user._id,
          user_name: user.name,
          user_email: user.email,
        },
      ])
      .select()
      .single();

    if (errorAnulacion) throw errorAnulacion;


    const { error: updateError } = await supabase
      .from("movements")
      .update({ state: "anulado" })
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