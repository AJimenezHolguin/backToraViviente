import { Response, RequestHandler } from "express";
import supabase from "../../db/supabaseClient";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createMovimiento: RequestHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = req.user;
    console.log(user)

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
      ingreso = 0,
      gasto = 0,
      referencia_id = null,
    } = req.body;

    if (!fecha || !descripcion || !tipo) {
      return res.status(400).json({
        success: false,
        message: "Fecha, descripción y tipo son obligatorios",
      });
    }

    if (!["ingreso", "gasto"].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: "Tipo inválido",
      });
    }

    if (tipo === "ingreso" && Number(ingreso) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Ingreso debe ser mayor a 0",
      });
    }

    if (tipo === "gasto" && Number(gasto) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Gasto debe ser mayor a 0",
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

    const nuevoSaldo =
      saldoAnterior + Number(ingreso || 0) - Number(gasto || 0);

    // 🧾 Insertar (sin numero_registro)
    const { data, error } = await supabase
      .from("movimientos")
      .insert([
        {
          fecha,
          descripcion,
          tipo,
          ingreso: tipo === "ingreso" ? Number(ingreso) : 0,
          gasto: tipo === "gasto" ? Number(gasto) : 0,
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