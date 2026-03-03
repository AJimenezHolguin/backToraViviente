import { Response, RequestHandler } from "express";
import supabase from "../../db/supabaseClient";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createMovements: RequestHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    const {
      fecha,
      descripcion,
      tipo,
      monto,
      referencia_id = null,
    } = req.body;

    // 🔎 Validaciones básicas
    if (!fecha || !descripcion || !tipo || !monto) {
      return res.status(400).json({
        success: false,
        message: "Fecha, descripción, tipo y monto son obligatorios",
      });
    }

    if(new Date(fecha)> new Date()){
      return res.status(400).json({
        success: false,
        message: "La fecha no puede ser futura",
      });
    }

    if (!["ingreso", "gasto"].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: "Tipo inválido",
      });
    }

    if (Number(monto) <= 0) {
      return res.status(400).json({
        success: false,
        message: "El monto debe ser mayor a 0",
      });
    }

    // 🔎 Obtener último saldo
    const { data: lastSaldo, error: saldoError } = await supabase
      .from("movimientos")
      .select("saldo")
      .order("numero_registro", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (saldoError) throw saldoError;

    const saldoAnterior = lastSaldo ? Number(lastSaldo.saldo) : 0;

    const montoNumerico = Number(monto);

    const ingreso = tipo === "ingreso" ? montoNumerico : 0;
    const gasto = tipo === "gasto" ? montoNumerico : 0;

    const nuevoSaldo = saldoAnterior + ingreso - gasto;

    // 🧾 Insertar
    const { data, error } = await supabase
      .from("movimientos")
      .insert([
        {
          fecha,
          descripcion,
          tipo,
          ingreso,
          gasto,
          saldo: nuevoSaldo,
          estado: "activo",
          referencia_id,
          usuario_uuid: user._id,
          usuario_nombre: user.name,
          usuario_correo: user.email,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      message: "Movimiento creado exitosamente",
      data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Error al crear movimiento",
      error: error.message,
    });
  }
};