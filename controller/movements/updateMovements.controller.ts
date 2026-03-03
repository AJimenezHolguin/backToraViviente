import { RequestHandler } from "express";
import supabase from "../../db/supabaseClient";
import { AuthRequest } from "../../middleware/auth.middleware";

export const updateMovements: RequestHandler = async (
  req: AuthRequest,
  res
) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const { tipo, monto, descripcion } = req.body;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "No autorizado",
      });
    }

    // 🔎 Validaciones básicas
    if (!tipo || !["ingreso", "gasto"].includes(tipo)) {
      return res.status(400).json({
        success: false,
        message: "Tipo debe ser 'ingreso' o 'gasto'",
      });
    }

    if (!monto || Number(monto) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Monto inválido",
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
        message: "Movimiento original no encontrado",
      });
    }

    if (original.estado === "anulado") {
      return res.status(400).json({
        success: false,
        message: "No se puede ajustar un movimiento anulado",
      });
    }

    // 2️⃣ Obtener último saldo
    const { data: ultimoMovimiento } = await supabase
      .from("movimientos")
      .select("saldo, numero_registro")
      .order("numero_registro", { ascending: false })
      .limit(1)
      .single();

    const ultimoSaldo = ultimoMovimiento
      ? Number(ultimoMovimiento.saldo)
      : 0;

    const montoNumerico = Number(monto);

    // 3️⃣ Calcular nuevo saldo
    const nuevoSaldo =
      tipo === "ingreso"
        ? ultimoSaldo + montoNumerico
        : ultimoSaldo - montoNumerico;


    // 5️⃣ Construir descripción automática
    const descripcionUsuario = descripcion
      ? descripcion.trim()
      : "Ajuste contable";

    const descripcionFinal = `${descripcionUsuario} (Ajuste del asiento #${original.numero_registro})`;

    // 6️⃣ Insertar nuevo asiento de ajuste
    const { data: ajuste, error: errorAjuste } = await supabase
      .from("movimientos")
      .insert([
        {
          
          fecha: new Date(),
          descripcion: descripcionFinal,
          tipo: "ajuste",
          ingreso: tipo === "ingreso" ? montoNumerico : 0,
          gasto: tipo === "gasto" ? montoNumerico : 0,
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

    if (errorAjuste) throw errorAjuste;

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