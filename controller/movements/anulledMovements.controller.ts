import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";

import { validateAccountingDate } from "../../utils/validateAccountingDate";
import { AuthRequest } from "../../middleware/types";

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

    const validationResult = validateAccountingDate(original.date);

    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
      });
    }

    const inputDate = new Date(
      new Date().toLocaleString("en-US", { timeZone: "America/Bogota" })
    );

    if (original.state === "anulado") {
      return res.status(400).json({
        success: false,
        message:
          "¡El movimiento ya está anulado, no es posible anularlo nuevamente!",
      });
    } else if (original.state === "ajustado") {
      return res.status(400).json({
        success: false,
        message: "¡El registro ya esta ajustado, no es posible anularlo!",
      });
    }

    if (original.type === "anulacion") {
      return res.status(400).json({
        success: false,
        message: "¡No es posible anular un registro de tipo anulación!",
      });
    } else if (original.type === "ajuste") {
      return res.status(400).json({
        success: false,
        message: "¡No es posible anular un registro de tipo ajuste!",
      });
    }

    const { data: ultimoMovimiento } = await supabase
      .from("movements")
      .select("saldo, numReg")
      .order("numReg", { ascending: false })
      .limit(1)
      .single();

    const ultimoSaldo = ultimoMovimiento ? Number(ultimoMovimiento.saldo) : 0;

    const nuevoNumReg = ultimoMovimiento ? ultimoMovimiento.numReg + 1 : 1;

    const ingresoAnulacion = original.gasto ? Number(original.gasto) : null;

    const gastoAnulacion = original.ingreso ? Number(original.ingreso) : null;

    if (gastoAnulacion && gastoAnulacion > ultimoSaldo) {
      return res.status(400).json({
        success: false,
        message: "¡No se puede anular porque generaría saldo negativo!",
      });
    }

    const nuevoSaldo =
      ultimoSaldo + (ingresoAnulacion || 0) - (gastoAnulacion || 0);

    const descripcionFinal = `${
      description?.trim() || "Anulación contable"
    } (Anulación del asiento #${original.numReg})`;

    const { data: anulacion, error: errorAnulacion } = await supabase
      .from("movements")
      .insert([
        {
          date: inputDate,
          numReg: nuevoNumReg,
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
