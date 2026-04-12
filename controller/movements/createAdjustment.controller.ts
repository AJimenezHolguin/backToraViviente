import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";
import { AuthRequest } from "../../middleware/auth.middleware";
import { validateAccountingDate } from "../../utils/validateAccountingDate";

export const createAdjustment: RequestHandler = async (
  req: AuthRequest,
  res
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { type, monto, description } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    if (!type || !["ingreso", "gasto"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Tipo debe ser 'ingreso' o 'gasto'",
      });
    }

    const montoNumerico = Number(monto);

    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({
        success: false,
        message: "Monto inválido",
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
        message: "Movimiento original no encontrado",
      });
    }

    const validationResult = validateAccountingDate(original.date);

    if (!validationResult.valid) {
      return res.status(400).json({
        success: false,
        message: validationResult.message,
      });
    }

    const inputDate = new Date();

    if (original.state === "anulado") {
      return res.status(400).json({
        success: false,
        message: "¡No es posible ajustar un registro anulado!",
      });
    } else if (original.state === "ajustado") {
      return res.status(400).json({
        success: false,
        message: "¡No es posible ajustar un registro ya ajustado!",
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

    if (type === "gasto" && montoNumerico > ultimoSaldo) {
      return res.status(400).json({
        success: false,
        message: "Saldo insuficiente",
      });
    }

    const nuevoSaldo =
      type === "ingreso"
        ? ultimoSaldo + montoNumerico
        : ultimoSaldo - montoNumerico;

    const descripcionFinal = `${
      description?.trim() || "Ajuste contable"
    } (Ajuste del asiento #${original.numReg})`;

    const { data: ajuste, error: errorAjuste } = await supabase
      .from("movements")
      .insert([
        {
          date: inputDate,
          numReg: nuevoNumReg,
          description: descripcionFinal,
          type: "ajuste",
          ingreso: type === "ingreso" ? montoNumerico : null,
          gasto: type === "gasto" ? montoNumerico : null,
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

    if (errorAjuste) throw errorAjuste;

    const { error: updateError } = await supabase
      .from("movements")
      .update({ state: "ajustado" })
      .eq("id", original.id);

    if (updateError) throw updateError;

    return res.status(201).json({
      success: true,
      message: "Ajuste generado correctamente",
      data: ajuste,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error al generar ajuste",
      error: error.message,
    });
  }
};
